import { RegistrationsService } from './registrations.service';
export declare class RegistrationsController {
    private readonly registrationsService;
    constructor(registrationsService: RegistrationsService);
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
    findOne(id: string, userId: string): Promise<{
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
    createCheckout(id: string, userId: string): Promise<{
        url: any;
    }>;
    cancelRegistration(id: string, userId: string): Promise<{
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
}
