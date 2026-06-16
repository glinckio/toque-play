import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma.service';
import { RedisService } from '../../common/redis/redis.service';
import { AuditService } from '../audit/audit.service';
import { AppError } from '../../common/errors/app-error';
import * as crypto from 'crypto';

@Injectable()
export class PrivacyService {
  private readonly logger = new Logger(PrivacyService.name);
  private static readonly EXPORT_RATE_KEY = (userId: string) =>
    `lgpd:export:cooldown:${userId}`;
  private static readonly EXPORT_COOLDOWN_SEC = 24 * 60 * 60; // 1/day

  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
    private auditService: AuditService,
    private configService: ConfigService,
  ) {}

  /**
   * LGPD art. 18, V — acesso/portabilidade: returns all data we hold about the user.
   * Cooldown 1/day to avoid abuse.
   */
  async exportUserData(userId: string, requester: { email: string; ip?: string | null; userAgent?: string | null }) {
    const cooldownKey = PrivacyService.EXPORT_RATE_KEY(userId);
    const first = await this.redisService.setNx(
      cooldownKey,
      '1',
      PrivacyService.EXPORT_COOLDOWN_SEC,
    );
    if (!first) {
      throw AppError.dataExportRateLimited();
    }

    const [user, teamMembers, registrations, friendlies, notifications, chatMessages, auditLogs, consents] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true, email: true, name: true, role: true, status: true,
          phone: true, bio: true, avatarUrl: true, isEmailVerified: true,
          createdAt: true, updatedAt: true, latitude: true, longitude: true,
          notificationPreferences: true,
        },
      }),
      this.prisma.teamMember.findMany({
        where: { userId },
        include: { team: { select: { id: true, name: true } } },
      }),
      this.prisma.registration.findMany({
        where: { userId },
        include: {
          tournament: { select: { id: true, name: true } },
          category: { select: { id: true, type: true, format: true, modality: true } },
          team: { select: { id: true, name: true } },
        },
      }),
      this.prisma.friendly.findMany({
        where: { requesterId: userId },
        select: { id: true, status: true, date: true, createdAt: true },
      }),
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 500,
      }),
      this.prisma.chatMessage.findMany({
        where: { senderId: userId },
        orderBy: { createdAt: 'desc' },
        take: 500,
      }),
      this.prisma.auditLog.findMany({
        where: { actorId: userId },
        orderBy: { createdAt: 'desc' },
        take: 1000,
      }),
      this.prisma.userConsent.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    void this.auditService.log({
      action: 'USER_DATA_EXPORTED',
      entityType: 'User',
      entityId: userId,
      actorId: userId,
      actorEmail: requester.email,
      ipAddress: requester.ip ?? null,
      userAgent: requester.userAgent ?? null,
      newValues: { summary: 'full export generated' },
    });

    return {
      generatedAt: new Date().toISOString(),
      user,
      consents,
      teamMembers,
      registrations,
      friendliesRequested: friendlies,
      notifications,
      chatMessages,
      auditLogs,
    };
  }

  /**
   * LGPD art. 18, VI — eliminação: anonymize user. Financial records kept 5y (art. 16 II).
   */
  async deleteAccount(
    userId: string,
    confirmation: { email: string; expectedEmail: string },
    ctx?: { ip?: string | null; userAgent?: string | null },
  ) {
    if (confirmation.email !== confirmation.expectedEmail) {
      throw AppError.accountDeletionConfirmationRequired();
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw AppError.userNotFound();
    }

    const anonId = crypto.randomUUID();
    const anonymousEmail = `deleted+${anonId}@toqueplay.local`;

    // Anonymize PII but keep row for financial/legal referential integrity.
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: 'Deleted User',
        email: anonymousEmail,
        password: null,
        googleId: null,
        phone: null,
        bio: null,
        avatarUrl: null,
        latitude: null,
        longitude: null,
        status: 'BLOCKED',
        notificationPreferences: { disabled: true },
      },
    });

    // Revoke all sessions.
    await this.prisma.refreshToken.deleteMany({ where: { userId } });
    await this.prisma.deviceToken.deleteMany({ where: { userId } });

    // Soft-delete chat messages authored by user (replace content with tombstone).
    await this.prisma.chatMessage.updateMany({
      where: { senderId: userId },
      data: { content: '[mensagem removida — conta excluída]' },
    });

    void this.auditService.log({
      action: 'USER_ACCOUNT_DELETED',
      entityType: 'User',
      entityId: userId,
      actorId: userId,
      actorEmail: anonymousEmail,
      ipAddress: ctx?.ip ?? null,
      userAgent: ctx?.userAgent ?? null,
      oldValues: { email: user.email, name: user.name },
      newValues: { email: anonymousEmail, anonymizedAt: new Date().toISOString() },
    });

    this.logger.log(`user ${userId} anonymized (financial records retained for legal compliance)`);

    return { message: 'Conta excluída e dados anonimizados.' };
  }

  /**
   * LGPD art. 18, I — confirmação: summary counts per entity.
   */
  async getDataSummary(userId: string) {
    const [teams, registrations, friendlies, notifications, chatMessages, consents] = await Promise.all([
      this.prisma.teamMember.count({ where: { userId } }),
      this.prisma.registration.count({ where: { userId } }),
      this.prisma.friendly.count({ where: { requesterId: userId } }),
      this.prisma.notification.count({ where: { userId } }),
      this.prisma.chatMessage.count({ where: { senderId: userId } }),
      this.prisma.userConsent.count({ where: { userId } }),
    ]);

    return {
      userId,
      teams,
      registrations,
      friendliesRequested: friendlies,
      notifications,
      chatMessages,
      consents,
    };
  }

  /**
   * Returns current consent state + active Terms version. App compares with
   * locally stored version to decide whether to re-prompt the user.
   */
  async getConsents(userId: string) {
    const version = this.configService.get<string>('TERMS_VERSION') ?? 'v1';
    const rows = await this.prisma.userConsent.findMany({
      where: { userId, version },
      orderBy: { createdAt: 'desc' },
    });

    // dedupe by purpose (most recent wins)
    const byPurpose = new Map<string, boolean>();
    for (const r of rows) {
      byPurpose.set(r.purpose, r.accepted);
    }

    const hasTerms = await this.prisma.userConsent.findFirst({
      where: { userId, purpose: 'TERMS' },
      orderBy: { createdAt: 'desc' },
    });

    return {
      version,
      lastAcceptedAt: hasTerms?.createdAt ?? null,
      consents: {
        terms: byPurpose.get('TERMS') ?? false,
        notificationsPush: byPurpose.get('NOTIFICATIONS_PUSH') ?? false,
        locationDiscovery: byPurpose.get('LOCATION_DISCOVERY') ?? false,
        marketingEmail: byPurpose.get('MARKETING_EMAIL') ?? false,
      },
    };
  }

  async updateConsents(
    userId: string,
    dto: { notificationsPush?: boolean; locationDiscovery?: boolean; marketingEmail?: boolean },
    requester: { email: string; ip?: string | null; userAgent?: string | null },
  ) {
    const version = this.configService.get<string>('TERMS_VERSION') ?? 'v1';
    const base = {
      userId,
      version,
      ipAddress: requester.ip ?? null,
      userAgent: requester.userAgent ?? null,
    };

    const records: Array<{
      userId: string;
      version: string;
      purpose: any;
      accepted: boolean;
      ipAddress: string | null;
      userAgent: string | null;
    }> = [];

    if (dto.notificationsPush !== undefined) {
      records.push({ ...base, purpose: 'NOTIFICATIONS_PUSH', accepted: dto.notificationsPush });
    }
    if (dto.locationDiscovery !== undefined) {
      records.push({ ...base, purpose: 'LOCATION_DISCOVERY', accepted: dto.locationDiscovery });
    }
    if (dto.marketingEmail !== undefined) {
      records.push({ ...base, purpose: 'MARKETING_EMAIL', accepted: dto.marketingEmail });
    }

    if (records.length > 0) {
      await this.prisma.userConsent.createMany({ data: records });
    }

    void this.auditService.log({
      action: 'USER_CONSENTS_UPDATED',
      entityType: 'User',
      entityId: userId,
      actorId: userId,
      actorEmail: requester.email,
      ipAddress: requester.ip ?? null,
      userAgent: requester.userAgent ?? null,
      newValues: dto,
    });

    return this.getConsents(userId);
  }
}
