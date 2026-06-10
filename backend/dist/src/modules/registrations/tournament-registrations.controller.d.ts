import { RegistrationsService } from './registrations.service';
import { RegisterTeamDto } from './dto/register-team.dto';
import { QueryRegistrationsDto } from './dto/query-registrations.dto';
export declare class TournamentRegistrationsController {
    private readonly registrationsService;
    constructor(registrationsService: RegistrationsService);
    registerTeam(tournamentId: string, userId: string, dto: RegisterTeamDto): Promise<{
        tournament: {
            id: string;
            name: string;
            status: import(".prisma/client").$Enums.TournamentStatus;
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
                teamId: string;
                userId: string | null;
                guestName: string | null;
                cpf: string | null;
                isGuest: boolean;
                isCaptain: boolean;
                positions: import(".prisma/client").$Enums.VolleyballPosition[];
            };
        } & {
            id: string;
            isCaptain: boolean;
            registrationId: string;
            teamMemberId: string;
        })[];
        user: {
            id: string;
            name: string;
            email: string;
        };
        category: {
            id: string;
            type: import(".prisma/client").$Enums.TournamentType;
            format: import(".prisma/client").$Enums.TournamentFormat;
            modality: import(".prisma/client").$Enums.TournamentModality;
            registrationPrice: import("@prisma/client/runtime/library").Decimal | null;
        };
    } & {
        id: string;
        tournamentId: string;
        createdAt: Date;
        updatedAt: Date;
        teamId: string;
        userId: string;
        status: import(".prisma/client").$Enums.RegistrationStatus;
        paymentId: string | null;
        paymentStatus: string | null;
        paymentMethod: string | null;
        paidAt: Date | null;
        categoryId: string;
    }>;
    listRegistrations(tournamentId: string, userId: string, query: QueryRegistrationsDto): Promise<({
        tournament: {
            id: string;
            name: string;
            status: import(".prisma/client").$Enums.TournamentStatus;
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
                teamId: string;
                userId: string | null;
                guestName: string | null;
                cpf: string | null;
                isGuest: boolean;
                isCaptain: boolean;
                positions: import(".prisma/client").$Enums.VolleyballPosition[];
            };
        } & {
            id: string;
            isCaptain: boolean;
            registrationId: string;
            teamMemberId: string;
        })[];
        user: {
            id: string;
            name: string;
            email: string;
        };
        category: {
            id: string;
            type: import(".prisma/client").$Enums.TournamentType;
            format: import(".prisma/client").$Enums.TournamentFormat;
            modality: import(".prisma/client").$Enums.TournamentModality;
            registrationPrice: import("@prisma/client/runtime/library").Decimal | null;
        };
    } & {
        id: string;
        tournamentId: string;
        createdAt: Date;
        updatedAt: Date;
        teamId: string;
        userId: string;
        status: import(".prisma/client").$Enums.RegistrationStatus;
        paymentId: string | null;
        paymentStatus: string | null;
        paymentMethod: string | null;
        paidAt: Date | null;
        categoryId: string;
    })[]>;
    getRegisteredMembers(tournamentId: string, teamId: string): Promise<{
        memberIds: string[];
    }>;
    confirmRegistration(tournamentId: string, regId: string, userId: string): Promise<{
        tournament: {
            id: string;
            name: string;
            status: import(".prisma/client").$Enums.TournamentStatus;
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
                teamId: string;
                userId: string | null;
                guestName: string | null;
                cpf: string | null;
                isGuest: boolean;
                isCaptain: boolean;
                positions: import(".prisma/client").$Enums.VolleyballPosition[];
            };
        } & {
            id: string;
            isCaptain: boolean;
            registrationId: string;
            teamMemberId: string;
        })[];
        user: {
            id: string;
            name: string;
            email: string;
        };
        category: {
            id: string;
            type: import(".prisma/client").$Enums.TournamentType;
            format: import(".prisma/client").$Enums.TournamentFormat;
            modality: import(".prisma/client").$Enums.TournamentModality;
            registrationPrice: import("@prisma/client/runtime/library").Decimal | null;
        };
    } & {
        id: string;
        tournamentId: string;
        createdAt: Date;
        updatedAt: Date;
        teamId: string;
        userId: string;
        status: import(".prisma/client").$Enums.RegistrationStatus;
        paymentId: string | null;
        paymentStatus: string | null;
        paymentMethod: string | null;
        paidAt: Date | null;
        categoryId: string;
    }>;
    rejectRegistration(tournamentId: string, regId: string, userId: string): Promise<{
        tournament: {
            id: string;
            name: string;
            status: import(".prisma/client").$Enums.TournamentStatus;
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
                teamId: string;
                userId: string | null;
                guestName: string | null;
                cpf: string | null;
                isGuest: boolean;
                isCaptain: boolean;
                positions: import(".prisma/client").$Enums.VolleyballPosition[];
            };
        } & {
            id: string;
            isCaptain: boolean;
            registrationId: string;
            teamMemberId: string;
        })[];
        user: {
            id: string;
            name: string;
            email: string;
        };
        category: {
            id: string;
            type: import(".prisma/client").$Enums.TournamentType;
            format: import(".prisma/client").$Enums.TournamentFormat;
            modality: import(".prisma/client").$Enums.TournamentModality;
            registrationPrice: import("@prisma/client/runtime/library").Decimal | null;
        };
    } & {
        id: string;
        tournamentId: string;
        createdAt: Date;
        updatedAt: Date;
        teamId: string;
        userId: string;
        status: import(".prisma/client").$Enums.RegistrationStatus;
        paymentId: string | null;
        paymentStatus: string | null;
        paymentMethod: string | null;
        paidAt: Date | null;
        categoryId: string;
    }>;
}
