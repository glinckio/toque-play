import { RegistrationsService } from './registrations.service';
export declare class RegistrationsController {
    private readonly registrationsService;
    constructor(registrationsService: RegistrationsService);
    listMine(userId: string): Promise<({
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
    findOne(id: string, userId: string): Promise<{
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
    createCheckout(id: string, userId: string): Promise<{
        url: any;
    }>;
    cancelRegistration(id: string, userId: string): Promise<{
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
