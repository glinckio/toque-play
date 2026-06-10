import { RegistrationsService } from './registrations.service';
import { RegisterTeamDto } from './dto/register-team.dto';
import { QueryRegistrationsDto } from './dto/query-registrations.dto';
export declare class TournamentRegistrationsController {
    private readonly registrationsService;
    constructor(registrationsService: RegistrationsService);
    registerTeam(tournamentId: string, userId: string, dto: RegisterTeamDto): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        };
        tournament: {
            id: string;
            name: string;
            status: import(".prisma/client").$Enums.TournamentStatus;
        };
        team: {
            id: string;
            name: string;
        };
        category: {
            id: string;
            type: import(".prisma/client").$Enums.TournamentType;
            format: import(".prisma/client").$Enums.TournamentFormat;
            modality: import(".prisma/client").$Enums.TournamentModality;
            registrationPrice: import("@prisma/client/runtime/library").Decimal | null;
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
                userId: string | null;
                teamId: string;
                position: string | null;
                guestName: string | null;
                cpf: string | null;
                isGuest: boolean;
                isCaptain: boolean;
            };
        } & {
            id: string;
            isCaptain: boolean;
            registrationId: string;
            teamMemberId: string;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.RegistrationStatus;
        createdAt: Date;
        updatedAt: Date;
        tournamentId: string;
        userId: string;
        categoryId: string;
        teamId: string;
        paymentId: string | null;
        paymentStatus: string | null;
        paymentMethod: string | null;
        paidAt: Date | null;
    }>;
    listRegistrations(tournamentId: string, userId: string, query: QueryRegistrationsDto): Promise<({
        user: {
            id: string;
            name: string;
            email: string;
        };
        tournament: {
            id: string;
            name: string;
            status: import(".prisma/client").$Enums.TournamentStatus;
        };
        team: {
            id: string;
            name: string;
        };
        category: {
            id: string;
            type: import(".prisma/client").$Enums.TournamentType;
            format: import(".prisma/client").$Enums.TournamentFormat;
            modality: import(".prisma/client").$Enums.TournamentModality;
            registrationPrice: import("@prisma/client/runtime/library").Decimal | null;
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
                userId: string | null;
                teamId: string;
                position: string | null;
                guestName: string | null;
                cpf: string | null;
                isGuest: boolean;
                isCaptain: boolean;
            };
        } & {
            id: string;
            isCaptain: boolean;
            registrationId: string;
            teamMemberId: string;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.RegistrationStatus;
        createdAt: Date;
        updatedAt: Date;
        tournamentId: string;
        userId: string;
        categoryId: string;
        teamId: string;
        paymentId: string | null;
        paymentStatus: string | null;
        paymentMethod: string | null;
        paidAt: Date | null;
    })[]>;
    getRegisteredMembers(tournamentId: string, teamId: string): Promise<{
        memberIds: string[];
    }>;
    confirmRegistration(tournamentId: string, regId: string, userId: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        };
        tournament: {
            id: string;
            name: string;
            status: import(".prisma/client").$Enums.TournamentStatus;
        };
        team: {
            id: string;
            name: string;
        };
        category: {
            id: string;
            type: import(".prisma/client").$Enums.TournamentType;
            format: import(".prisma/client").$Enums.TournamentFormat;
            modality: import(".prisma/client").$Enums.TournamentModality;
            registrationPrice: import("@prisma/client/runtime/library").Decimal | null;
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
                userId: string | null;
                teamId: string;
                position: string | null;
                guestName: string | null;
                cpf: string | null;
                isGuest: boolean;
                isCaptain: boolean;
            };
        } & {
            id: string;
            isCaptain: boolean;
            registrationId: string;
            teamMemberId: string;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.RegistrationStatus;
        createdAt: Date;
        updatedAt: Date;
        tournamentId: string;
        userId: string;
        categoryId: string;
        teamId: string;
        paymentId: string | null;
        paymentStatus: string | null;
        paymentMethod: string | null;
        paidAt: Date | null;
    }>;
    rejectRegistration(tournamentId: string, regId: string, userId: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        };
        tournament: {
            id: string;
            name: string;
            status: import(".prisma/client").$Enums.TournamentStatus;
        };
        team: {
            id: string;
            name: string;
        };
        category: {
            id: string;
            type: import(".prisma/client").$Enums.TournamentType;
            format: import(".prisma/client").$Enums.TournamentFormat;
            modality: import(".prisma/client").$Enums.TournamentModality;
            registrationPrice: import("@prisma/client/runtime/library").Decimal | null;
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
                userId: string | null;
                teamId: string;
                position: string | null;
                guestName: string | null;
                cpf: string | null;
                isGuest: boolean;
                isCaptain: boolean;
            };
        } & {
            id: string;
            isCaptain: boolean;
            registrationId: string;
            teamMemberId: string;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.RegistrationStatus;
        createdAt: Date;
        updatedAt: Date;
        tournamentId: string;
        userId: string;
        categoryId: string;
        teamId: string;
        paymentId: string | null;
        paymentStatus: string | null;
        paymentMethod: string | null;
        paidAt: Date | null;
    }>;
}
