import { Queue } from 'bull';
import { PrismaService } from '../../common/prisma.service';
import { StripeService } from '../../common/services/stripe.service';
import { TournamentsService } from '../tournaments/tournaments.service';
import { RegisterTeamDto } from './dto/register-team.dto';
import { PaymentsGateway } from './payments.gateway';
import { QueryRegistrationsDto } from './dto/query-registrations.dto';
import { PaymentWebhookDto } from './dto/payment-webhook.dto';
export declare class RegistrationsService {
    private prisma;
    private tournamentsService;
    private stripeService;
    private expiryQueue;
    private paymentsGateway;
    constructor(prisma: PrismaService, tournamentsService: TournamentsService, stripeService: StripeService, expiryQueue: Queue);
    setPaymentsGateway(gateway: PaymentsGateway): void;
    registerTeam(tournamentId: string, userId: string, dto: RegisterTeamDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
        };
        team: {
            id: string;
            name: string;
        };
        members: ({
            teamMember: {
                user: {
                    id: string;
                    name: string;
                    avatarUrl: string | null;
                } | null;
            } & {
                id: string;
                guestName: string | null;
                cpf: string | null;
                isGuest: boolean;
                isCaptain: boolean;
                userId: string | null;
                teamId: string;
            };
        } & {
            id: string;
            isCaptain: boolean;
            teamMemberId: string;
            registrationId: string;
        })[];
        tournament: {
            id: string;
            name: string;
            status: import(".prisma/client").$Enums.TournamentStatus;
        };
        category: {
            id: string;
            type: import(".prisma/client").$Enums.TournamentType;
            modality: import(".prisma/client").$Enums.TournamentModality;
            format: import(".prisma/client").$Enums.TournamentFormat;
            registrationPrice: import("@prisma/client/runtime/library").Decimal | null;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.RegistrationStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        teamId: string;
        tournamentId: string;
        categoryId: string;
        paymentId: string | null;
        paymentStatus: string | null;
        paymentMethod: string | null;
        paidAt: Date | null;
    }>;
    createCheckout(regId: string, userId: string): Promise<{
        url: any;
    }>;
    listByTournament(tournamentId: string, userId: string, query: QueryRegistrationsDto): Promise<({
        user: {
            id: string;
            email: string;
            name: string;
        };
        team: {
            id: string;
            name: string;
        };
        members: ({
            teamMember: {
                user: {
                    id: string;
                    name: string;
                    avatarUrl: string | null;
                } | null;
            } & {
                id: string;
                guestName: string | null;
                cpf: string | null;
                isGuest: boolean;
                isCaptain: boolean;
                userId: string | null;
                teamId: string;
            };
        } & {
            id: string;
            isCaptain: boolean;
            teamMemberId: string;
            registrationId: string;
        })[];
        tournament: {
            id: string;
            name: string;
            status: import(".prisma/client").$Enums.TournamentStatus;
        };
        category: {
            id: string;
            type: import(".prisma/client").$Enums.TournamentType;
            modality: import(".prisma/client").$Enums.TournamentModality;
            format: import(".prisma/client").$Enums.TournamentFormat;
            registrationPrice: import("@prisma/client/runtime/library").Decimal | null;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.RegistrationStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        teamId: string;
        tournamentId: string;
        categoryId: string;
        paymentId: string | null;
        paymentStatus: string | null;
        paymentMethod: string | null;
        paidAt: Date | null;
    })[]>;
    confirmRegistration(tournamentId: string, regId: string, userId: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
        };
        team: {
            id: string;
            name: string;
        };
        members: ({
            teamMember: {
                user: {
                    id: string;
                    name: string;
                    avatarUrl: string | null;
                } | null;
            } & {
                id: string;
                guestName: string | null;
                cpf: string | null;
                isGuest: boolean;
                isCaptain: boolean;
                userId: string | null;
                teamId: string;
            };
        } & {
            id: string;
            isCaptain: boolean;
            teamMemberId: string;
            registrationId: string;
        })[];
        tournament: {
            id: string;
            name: string;
            status: import(".prisma/client").$Enums.TournamentStatus;
        };
        category: {
            id: string;
            type: import(".prisma/client").$Enums.TournamentType;
            modality: import(".prisma/client").$Enums.TournamentModality;
            format: import(".prisma/client").$Enums.TournamentFormat;
            registrationPrice: import("@prisma/client/runtime/library").Decimal | null;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.RegistrationStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        teamId: string;
        tournamentId: string;
        categoryId: string;
        paymentId: string | null;
        paymentStatus: string | null;
        paymentMethod: string | null;
        paidAt: Date | null;
    }>;
    rejectRegistration(tournamentId: string, regId: string, userId: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
        };
        team: {
            id: string;
            name: string;
        };
        members: ({
            teamMember: {
                user: {
                    id: string;
                    name: string;
                    avatarUrl: string | null;
                } | null;
            } & {
                id: string;
                guestName: string | null;
                cpf: string | null;
                isGuest: boolean;
                isCaptain: boolean;
                userId: string | null;
                teamId: string;
            };
        } & {
            id: string;
            isCaptain: boolean;
            teamMemberId: string;
            registrationId: string;
        })[];
        tournament: {
            id: string;
            name: string;
            status: import(".prisma/client").$Enums.TournamentStatus;
        };
        category: {
            id: string;
            type: import(".prisma/client").$Enums.TournamentType;
            modality: import(".prisma/client").$Enums.TournamentModality;
            format: import(".prisma/client").$Enums.TournamentFormat;
            registrationPrice: import("@prisma/client/runtime/library").Decimal | null;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.RegistrationStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        teamId: string;
        tournamentId: string;
        categoryId: string;
        paymentId: string | null;
        paymentStatus: string | null;
        paymentMethod: string | null;
        paidAt: Date | null;
    }>;
    listMine(userId: string): Promise<({
        user: {
            id: string;
            email: string;
            name: string;
        };
        team: {
            id: string;
            name: string;
        };
        members: ({
            teamMember: {
                user: {
                    id: string;
                    name: string;
                    avatarUrl: string | null;
                } | null;
            } & {
                id: string;
                guestName: string | null;
                cpf: string | null;
                isGuest: boolean;
                isCaptain: boolean;
                userId: string | null;
                teamId: string;
            };
        } & {
            id: string;
            isCaptain: boolean;
            teamMemberId: string;
            registrationId: string;
        })[];
        tournament: {
            id: string;
            name: string;
            status: import(".prisma/client").$Enums.TournamentStatus;
        };
        category: {
            id: string;
            type: import(".prisma/client").$Enums.TournamentType;
            modality: import(".prisma/client").$Enums.TournamentModality;
            format: import(".prisma/client").$Enums.TournamentFormat;
            registrationPrice: import("@prisma/client/runtime/library").Decimal | null;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.RegistrationStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        teamId: string;
        tournamentId: string;
        categoryId: string;
        paymentId: string | null;
        paymentStatus: string | null;
        paymentMethod: string | null;
        paidAt: Date | null;
    })[]>;
    getRegisteredMembers(tournamentId: string, teamId: string): Promise<{
        memberIds: string[];
    }>;
    findOne(regId: string, userId: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
        };
        team: {
            id: string;
            name: string;
        };
        members: ({
            teamMember: {
                user: {
                    id: string;
                    name: string;
                    avatarUrl: string | null;
                } | null;
            } & {
                id: string;
                guestName: string | null;
                cpf: string | null;
                isGuest: boolean;
                isCaptain: boolean;
                userId: string | null;
                teamId: string;
            };
        } & {
            id: string;
            isCaptain: boolean;
            teamMemberId: string;
            registrationId: string;
        })[];
        tournament: {
            id: string;
            name: string;
            status: import(".prisma/client").$Enums.TournamentStatus;
        };
        category: {
            id: string;
            type: import(".prisma/client").$Enums.TournamentType;
            modality: import(".prisma/client").$Enums.TournamentModality;
            format: import(".prisma/client").$Enums.TournamentFormat;
            registrationPrice: import("@prisma/client/runtime/library").Decimal | null;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.RegistrationStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        teamId: string;
        tournamentId: string;
        categoryId: string;
        paymentId: string | null;
        paymentStatus: string | null;
        paymentMethod: string | null;
        paidAt: Date | null;
    }>;
    cancelRegistration(regId: string, userId: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
        };
        team: {
            id: string;
            name: string;
        };
        members: ({
            teamMember: {
                user: {
                    id: string;
                    name: string;
                    avatarUrl: string | null;
                } | null;
            } & {
                id: string;
                guestName: string | null;
                cpf: string | null;
                isGuest: boolean;
                isCaptain: boolean;
                userId: string | null;
                teamId: string;
            };
        } & {
            id: string;
            isCaptain: boolean;
            teamMemberId: string;
            registrationId: string;
        })[];
        tournament: {
            id: string;
            name: string;
            status: import(".prisma/client").$Enums.TournamentStatus;
        };
        category: {
            id: string;
            type: import(".prisma/client").$Enums.TournamentType;
            modality: import(".prisma/client").$Enums.TournamentModality;
            format: import(".prisma/client").$Enums.TournamentFormat;
            registrationPrice: import("@prisma/client/runtime/library").Decimal | null;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.RegistrationStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        teamId: string;
        tournamentId: string;
        categoryId: string;
        paymentId: string | null;
        paymentStatus: string | null;
        paymentMethod: string | null;
        paidAt: Date | null;
    }>;
    handleStripeWebhook(event: any): Promise<void>;
    handlePaymentWebhook(dto: PaymentWebhookDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
        };
        team: {
            id: string;
            name: string;
        };
        members: ({
            teamMember: {
                user: {
                    id: string;
                    name: string;
                    avatarUrl: string | null;
                } | null;
            } & {
                id: string;
                guestName: string | null;
                cpf: string | null;
                isGuest: boolean;
                isCaptain: boolean;
                userId: string | null;
                teamId: string;
            };
        } & {
            id: string;
            isCaptain: boolean;
            teamMemberId: string;
            registrationId: string;
        })[];
        tournament: {
            id: string;
            name: string;
            status: import(".prisma/client").$Enums.TournamentStatus;
        };
        category: {
            id: string;
            type: import(".prisma/client").$Enums.TournamentType;
            modality: import(".prisma/client").$Enums.TournamentModality;
            format: import(".prisma/client").$Enums.TournamentFormat;
            registrationPrice: import("@prisma/client/runtime/library").Decimal | null;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.RegistrationStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        teamId: string;
        tournamentId: string;
        categoryId: string;
        paymentId: string | null;
        paymentStatus: string | null;
        paymentMethod: string | null;
        paidAt: Date | null;
    }>;
    private findRegistrationOrThrow;
}
