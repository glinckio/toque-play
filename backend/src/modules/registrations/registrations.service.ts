import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from '../../common/prisma.service';
import { AppError } from '../../common/errors/app-error';
import { StripeService } from '../../common/services/stripe.service';
import { NotificationService } from '../../common/services/notification.service';
import { TournamentsService } from '../tournaments/tournaments.service';
import { RegisterTeamDto } from './dto/register-team.dto';
import { PaymentsGateway } from './payments.gateway';
import { QueryRegistrationsDto } from './dto/query-registrations.dto';
import { PaymentWebhookDto } from './dto/payment-webhook.dto';
import {
  TournamentStatus,
  RegistrationStatus,
} from '@prisma/client';

const REGISTRATION_INCLUDE = {
  tournament: { select: { id: true, name: true, status: true } },
  category: { select: { id: true, type: true, format: true, modality: true, registrationPrice: true } },
  team: { select: { id: true, name: true } },
  user: { select: { id: true, name: true, email: true } },
  members: {
    include: {
      teamMember: {
        include: {
          user: { select: { id: true, name: true, avatarUrl: true } },
        },
      },
    },
  },
};

@Injectable()
export class RegistrationsService {
  private paymentsGateway: PaymentsGateway;

  constructor(
    private prisma: PrismaService,
    private tournamentsService: TournamentsService,
    private stripeService: StripeService,
    private notificationService: NotificationService,
    @InjectQueue('registration-expiry') private expiryQueue: Queue,
  ) {}

  setPaymentsGateway(gateway: PaymentsGateway) {
    this.paymentsGateway = gateway;
  }

  async registerTeam(tournamentId: string, userId: string, dto: RegisterTeamDto) {
    const tournament = await this.prisma.tournament.findUnique({
      where: { id: tournamentId },
    });
    if (!tournament) throw AppError.tournamentNotFound();

    if (
      tournament.status !== TournamentStatus.PUBLISHED &&
      tournament.status !== TournamentStatus.REGISTRATION_OPEN
    ) {
      throw AppError.tournamentNotOpen();
    }

    const category = await this.prisma.tournamentCategory.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category || category.tournamentId !== tournamentId) {
      throw AppError.categoryNotInTournament();
    }

    if (category.registrationDeadline && new Date() > new Date(category.registrationDeadline)) {
      throw AppError.registrationDeadlineExpired();
    }

    const team = await this.prisma.team.findUnique({
      where: { id: dto.teamId },
      include: { members: true },
    });
    if (!team) {
      throw AppError.teamNotFound();
    }
    if (team.ownerId !== userId) {
      throw AppError.notTeamOwner();
    }

    // Validate selected members belong to team
    const teamMemberIds = new Set(team.members.map((m) => m.id));

    for (const mid of dto.memberIds) {
      if (!teamMemberIds.has(mid)) {
        throw AppError.teamSizeMismatch();
      }
    }
    if (dto.memberIds.length < category.minMembers || dto.memberIds.length > category.maxMembers) {
      throw AppError.teamSizeMismatch();
    }

    // Check if any selected member is already registered in this tournament
    const alreadyRegistered = await this.prisma.registrationMember.findMany({
      where: {
        teamMemberId: { in: dto.memberIds },
        registration: {
          tournamentId,
          status: { notIn: [RegistrationStatus.CANCELLED, RegistrationStatus.REJECTED] },
        },
      },
      select: { teamMemberId: true },
    });
    if (alreadyRegistered.length > 0) {
      throw AppError.teamAlreadyRegistered();
    }

    const isFree = !category.registrationPrice || Number(category.registrationPrice) === 0;
    const status: RegistrationStatus = isFree ? RegistrationStatus.PENDING_CONFIRMATION : RegistrationStatus.PENDING_PAYMENT;

    const registration = await this.prisma.registration.create({
      data: {
        tournamentId,
        categoryId: dto.categoryId,
        teamId: dto.teamId,
        userId,
        status,
        members: {
          create: dto.memberIds.map((teamMemberId) => ({
            teamMemberId,
            isCaptain: dto.captainMemberId ? teamMemberId === dto.captainMemberId : false,
          })),
        },
      },
      include: REGISTRATION_INCLUDE,
    });

    // Schedule expiry job for paid registrations (30 min delay)
    if (!isFree) {
      await this.expiryQueue.add(
        'expire',
        { registrationId: registration.id },
        { delay: 30 * 60 * 1000 },
      );
    }

    return registration;
  }

  async createCheckout(regId: string, userId: string) {
    const registration = await this.findRegistrationOrThrow(regId);

    if (registration.userId !== userId) {
      throw AppError.notRegistrationOwner();
    }

    if (registration.status !== RegistrationStatus.PENDING_PAYMENT) {
      throw AppError.registrationAlreadyConfirmed();
    }

    const category = await this.prisma.tournamentCategory.findUnique({
      where: { id: registration.categoryId },
    });

    const session = await this.stripeService.createCheckoutSession({
      registrationId: regId,
      amount: Number(category!.registrationPrice),
      tournamentName: registration.tournament.name,
      categoryName: `${category!.type} ${category!.format} ${category!.modality}`,
      teamName: registration.team.name,
    });

    await this.prisma.registration.update({
      where: { id: regId },
      data: { paymentId: session.id },
    });

    return { url: session.url };
  }

  async listByTournament(tournamentId: string, userId: string, query: QueryRegistrationsDto) {
    await this.tournamentsService.verifyOwnership(tournamentId, userId);

    const where: any = { tournamentId };
    if (query.status) where.status = query.status;
    if (query.categoryId) where.categoryId = query.categoryId;

    return this.prisma.registration.findMany({
      where,
      include: REGISTRATION_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  async confirmRegistration(tournamentId: string, regId: string, userId: string) {
    await this.tournamentsService.verifyOwnership(tournamentId, userId);

    const registration = await this.findRegistrationOrThrow(regId);

    if (registration.tournamentId !== tournamentId) {
      throw AppError.registrationNotFound();
    }

    if (registration.status === RegistrationStatus.CONFIRMED) {
      throw AppError.registrationAlreadyConfirmed();
    }

    if (registration.status === RegistrationStatus.PENDING_PAYMENT) {
      throw AppError.paymentRequired();
    }

    const updated = await this.prisma.registration.update({
      where: { id: regId },
      data: { status: RegistrationStatus.CONFIRMED },
      include: REGISTRATION_INCLUDE,
    });

    // Notify all registered athletes
    const memberUserIds = updated.members
      .map((m: any) => m.teamMember?.user?.id)
      .filter((id: string | null | undefined): id is string => !!id && id !== userId);
    if (memberUserIds.length > 0) {
      await this.notificationService.sendToUsers(memberUserIds, {
        title: 'Inscrição Confirmada!',
        body: `Sua inscrição no torneio "${updated.tournament.name}" foi confirmada.`,
        type: 'REGISTRATION_CONFIRMED',
        referenceId: tournamentId,
      });
    }

    return updated;
  }

  async rejectRegistration(tournamentId: string, regId: string, userId: string) {
    await this.tournamentsService.verifyOwnership(tournamentId, userId);

    const registration = await this.findRegistrationOrThrow(regId);

    if (registration.tournamentId !== tournamentId) {
      throw AppError.registrationNotFound();
    }

    if (registration.status === RegistrationStatus.CANCELLED) {
      throw AppError.registrationAlreadyCancelled();
    }

    if (registration.status === RegistrationStatus.REJECTED) {
      throw AppError.registrationAlreadyConfirmed();
    }

    return this.prisma.registration.update({
      where: { id: regId },
      data: { status: RegistrationStatus.REJECTED },
      include: REGISTRATION_INCLUDE,
    });
  }

  async listMine(userId: string) {
    return this.prisma.registration.findMany({
      where: { userId },
      include: REGISTRATION_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRegisteredMembers(tournamentId: string, teamId: string) {
    const regs = await this.prisma.registration.findMany({
      where: {
        tournamentId,
        teamId,
        status: { notIn: [RegistrationStatus.CANCELLED, RegistrationStatus.REJECTED] },
      },
      select: {
        members: { select: { teamMemberId: true } },
      },
    });
    const memberIds = regs.flatMap((r) => r.members.map((m) => m.teamMemberId));
    return { memberIds };
  }

  async findOne(regId: string, userId: string) {
    const registration = await this.findRegistrationOrThrow(regId);

    if (registration.userId !== userId) {
      throw AppError.notRegistrationOwner();
    }

    return registration;
  }

  async cancelRegistration(regId: string, userId: string) {
    const registration = await this.findRegistrationOrThrow(regId);

    if (registration.userId !== userId) {
      throw AppError.notRegistrationOwner();
    }

    if (registration.status === RegistrationStatus.CANCELLED) {
      throw AppError.registrationAlreadyCancelled();
    }

    const tournament = await this.prisma.tournament.findUnique({
      where: { id: registration.tournamentId },
    });

    if (
      tournament!.status === TournamentStatus.IN_PROGRESS ||
      tournament!.status === TournamentStatus.FINISHED ||
      tournament!.status === TournamentStatus.CANCELLED
    ) {
      throw AppError.cannotCancelStarted();
    }

    return this.prisma.registration.update({
      where: { id: regId },
      data: { status: RegistrationStatus.CANCELLED },
      include: REGISTRATION_INCLUDE,
    });
  }

  async handleStripeWebhook(event: any) {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const registrationId = session.metadata?.registrationId;

      if (!registrationId) return;

      const reg = await this.prisma.registration.update({
        where: { id: registrationId },
        data: {
          paymentId: session.payment_intent as string,
          paymentStatus: session.payment_status,
          paidAt: new Date(),
          status: RegistrationStatus.CONFIRMED,
        },
        include: REGISTRATION_INCLUDE,
      });

      // Notify registered athletes
      const memberUserIds = reg.members
        .map((m: any) => m.teamMember?.user?.id)
        .filter((id: string | null | undefined): id is string => !!id);
      if (memberUserIds.length > 0) {
        await this.notificationService.sendToUsers(memberUserIds, {
          title: 'Pagamento Confirmado!',
          body: `Sua inscrição no torneio "${reg.tournament.name}" foi confirmada.`,
          type: 'REGISTRATION_CONFIRMED',
          referenceId: reg.tournamentId,
        });
      }

      // Notify via socket
      if (this.paymentsGateway) {
        this.paymentsGateway.emitPaymentConfirmed(reg.userId, registrationId);
      }
    }
  }

  async handlePaymentWebhook(dto: PaymentWebhookDto) {
    const registration = await this.findRegistrationOrThrow(dto.registrationId);

    const newStatus: RegistrationStatus =
      dto.status === 'CONFIRMED'
        ? RegistrationStatus.CONFIRMED
        : RegistrationStatus.PENDING_CONFIRMATION;

    const updated = await this.prisma.registration.update({
      where: { id: dto.registrationId },
      data: {
        paymentId: dto.paymentId,
        paymentStatus: dto.status,
        paidAt: new Date(),
        status: newStatus,
      },
      include: REGISTRATION_INCLUDE,
    });

    // Notify via socket
    if (this.paymentsGateway && newStatus === RegistrationStatus.CONFIRMED) {
      this.paymentsGateway.emitPaymentConfirmed(updated.userId, dto.registrationId);
    }

    return updated;
  }

  private async findRegistrationOrThrow(regId: string) {
    const registration = await this.prisma.registration.findUnique({
      where: { id: regId },
      include: REGISTRATION_INCLUDE,
    });

    if (!registration) {
      throw AppError.registrationNotFound();
    }

    return registration;
  }
}
