import { PrismaService } from '../../common/prisma.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateStructureDto } from './dto/update-structure.dto';
import { AddSponsorsDto } from './dto/add-sponsors.dto';
import { QueryTournamentsDto } from './dto/query-tournaments.dto';
import { ExploreQueryDto } from './dto/explore-query.dto';
export declare class TournamentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateTournamentDto): Promise<{
        owner: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string | null;
        };
        _count: {
            registrations: number;
        };
        categories: {
            id: string;
            type: import(".prisma/client").$Enums.TournamentType;
            startTime: Date | null;
            modality: import(".prisma/client").$Enums.TournamentModality;
            bestOfSets: number;
            tournamentId: string;
            format: import(".prisma/client").$Enums.TournamentFormat;
            minMembers: number;
            maxMembers: number;
            semifinalBestOfSets: number | null;
            finalBestOfSets: number | null;
            registrationPrice: import("@prisma/client/runtime/library").Decimal | null;
            registrationDeadline: Date | null;
            registrationRules: string | null;
            tiebreakerCriteria: import("@prisma/client/runtime/library").JsonValue | null;
            bracketType: import(".prisma/client").$Enums.BracketType | null;
            groupsCount: number | null;
            teamsPerGroup: number | null;
            teamsAdvancing: number | null;
        }[];
        stages: ({
            facilities: {
                id: string;
                name: string;
                available: boolean;
                stageId: string;
            }[];
        } & {
            number: string | null;
            id: string;
            name: string | null;
            latitude: number | null;
            longitude: number | null;
            date: Date;
            startTime: Date | null;
            address: string | null;
            city: string | null;
            state: string | null;
            regionRadius: number | null;
            tournamentId: string;
            maxTeams: number | null;
            street: string | null;
            neighborhood: string | null;
            cep: string | null;
        })[];
        sponsors: {
            id: string;
            name: string;
            description: string | null;
            tournamentId: string;
            logoUrl: string | null;
        }[];
    } & {
        id: string;
        name: string;
        status: import(".prisma/client").$Enums.TournamentStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        ownerId: string;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        isPublished: boolean;
    }>;
    update(tournamentId: string, userId: string, dto: CreateTournamentDto): Promise<{
        owner: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string | null;
        };
        _count: {
            registrations: number;
        };
        categories: {
            id: string;
            type: import(".prisma/client").$Enums.TournamentType;
            startTime: Date | null;
            modality: import(".prisma/client").$Enums.TournamentModality;
            bestOfSets: number;
            tournamentId: string;
            format: import(".prisma/client").$Enums.TournamentFormat;
            minMembers: number;
            maxMembers: number;
            semifinalBestOfSets: number | null;
            finalBestOfSets: number | null;
            registrationPrice: import("@prisma/client/runtime/library").Decimal | null;
            registrationDeadline: Date | null;
            registrationRules: string | null;
            tiebreakerCriteria: import("@prisma/client/runtime/library").JsonValue | null;
            bracketType: import(".prisma/client").$Enums.BracketType | null;
            groupsCount: number | null;
            teamsPerGroup: number | null;
            teamsAdvancing: number | null;
        }[];
        stages: ({
            facilities: {
                id: string;
                name: string;
                available: boolean;
                stageId: string;
            }[];
        } & {
            number: string | null;
            id: string;
            name: string | null;
            latitude: number | null;
            longitude: number | null;
            date: Date;
            startTime: Date | null;
            address: string | null;
            city: string | null;
            state: string | null;
            regionRadius: number | null;
            tournamentId: string;
            maxTeams: number | null;
            street: string | null;
            neighborhood: string | null;
            cep: string | null;
        })[];
        sponsors: {
            id: string;
            name: string;
            description: string | null;
            tournamentId: string;
            logoUrl: string | null;
        }[];
    } & {
        id: string;
        name: string;
        status: import(".prisma/client").$Enums.TournamentStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        ownerId: string;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        isPublished: boolean;
    }>;
    updateStructure(tournamentId: string, userId: string, dto: UpdateStructureDto): Promise<{
        owner: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string | null;
        };
        _count: {
            registrations: number;
        };
        categories: {
            id: string;
            type: import(".prisma/client").$Enums.TournamentType;
            startTime: Date | null;
            modality: import(".prisma/client").$Enums.TournamentModality;
            bestOfSets: number;
            tournamentId: string;
            format: import(".prisma/client").$Enums.TournamentFormat;
            minMembers: number;
            maxMembers: number;
            semifinalBestOfSets: number | null;
            finalBestOfSets: number | null;
            registrationPrice: import("@prisma/client/runtime/library").Decimal | null;
            registrationDeadline: Date | null;
            registrationRules: string | null;
            tiebreakerCriteria: import("@prisma/client/runtime/library").JsonValue | null;
            bracketType: import(".prisma/client").$Enums.BracketType | null;
            groupsCount: number | null;
            teamsPerGroup: number | null;
            teamsAdvancing: number | null;
        }[];
        stages: ({
            facilities: {
                id: string;
                name: string;
                available: boolean;
                stageId: string;
            }[];
        } & {
            number: string | null;
            id: string;
            name: string | null;
            latitude: number | null;
            longitude: number | null;
            date: Date;
            startTime: Date | null;
            address: string | null;
            city: string | null;
            state: string | null;
            regionRadius: number | null;
            tournamentId: string;
            maxTeams: number | null;
            street: string | null;
            neighborhood: string | null;
            cep: string | null;
        })[];
        sponsors: {
            id: string;
            name: string;
            description: string | null;
            tournamentId: string;
            logoUrl: string | null;
        }[];
    } & {
        id: string;
        name: string;
        status: import(".prisma/client").$Enums.TournamentStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        ownerId: string;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        isPublished: boolean;
    }>;
    addStageFacilities(tournamentId: string, stageId: string, userId: string, facilities: {
        name: string;
        available?: boolean;
    }[]): Promise<({
        facilities: {
            id: string;
            name: string;
            available: boolean;
            stageId: string;
        }[];
    } & {
        number: string | null;
        id: string;
        name: string | null;
        latitude: number | null;
        longitude: number | null;
        date: Date;
        startTime: Date | null;
        address: string | null;
        city: string | null;
        state: string | null;
        regionRadius: number | null;
        tournamentId: string;
        maxTeams: number | null;
        street: string | null;
        neighborhood: string | null;
        cep: string | null;
    }) | null>;
    removeStageFacility(tournamentId: string, stageId: string, facilityId: string, userId: string): Promise<void>;
    addSponsors(tournamentId: string, userId: string, dto: AddSponsorsDto): Promise<({
        sponsors: {
            id: string;
            name: string;
            description: string | null;
            tournamentId: string;
            logoUrl: string | null;
        }[];
    } & {
        id: string;
        name: string;
        status: import(".prisma/client").$Enums.TournamentStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        ownerId: string;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        isPublished: boolean;
    }) | null>;
    removeSponsor(tournamentId: string, sponsorId: string, userId: string): Promise<void>;
    getSummary(tournamentId: string, userId: string): Promise<({
        owner: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string | null;
        };
        _count: {
            registrations: number;
        };
        categories: {
            id: string;
            type: import(".prisma/client").$Enums.TournamentType;
            startTime: Date | null;
            modality: import(".prisma/client").$Enums.TournamentModality;
            bestOfSets: number;
            tournamentId: string;
            format: import(".prisma/client").$Enums.TournamentFormat;
            minMembers: number;
            maxMembers: number;
            semifinalBestOfSets: number | null;
            finalBestOfSets: number | null;
            registrationPrice: import("@prisma/client/runtime/library").Decimal | null;
            registrationDeadline: Date | null;
            registrationRules: string | null;
            tiebreakerCriteria: import("@prisma/client/runtime/library").JsonValue | null;
            bracketType: import(".prisma/client").$Enums.BracketType | null;
            groupsCount: number | null;
            teamsPerGroup: number | null;
            teamsAdvancing: number | null;
        }[];
        stages: ({
            facilities: {
                id: string;
                name: string;
                available: boolean;
                stageId: string;
            }[];
        } & {
            number: string | null;
            id: string;
            name: string | null;
            latitude: number | null;
            longitude: number | null;
            date: Date;
            startTime: Date | null;
            address: string | null;
            city: string | null;
            state: string | null;
            regionRadius: number | null;
            tournamentId: string;
            maxTeams: number | null;
            street: string | null;
            neighborhood: string | null;
            cep: string | null;
        })[];
        sponsors: {
            id: string;
            name: string;
            description: string | null;
            tournamentId: string;
            logoUrl: string | null;
        }[];
    } & {
        id: string;
        name: string;
        status: import(".prisma/client").$Enums.TournamentStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        ownerId: string;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        isPublished: boolean;
    }) | null>;
    publish(tournamentId: string, userId: string): Promise<{
        owner: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string | null;
        };
        _count: {
            registrations: number;
        };
        categories: {
            id: string;
            type: import(".prisma/client").$Enums.TournamentType;
            startTime: Date | null;
            modality: import(".prisma/client").$Enums.TournamentModality;
            bestOfSets: number;
            tournamentId: string;
            format: import(".prisma/client").$Enums.TournamentFormat;
            minMembers: number;
            maxMembers: number;
            semifinalBestOfSets: number | null;
            finalBestOfSets: number | null;
            registrationPrice: import("@prisma/client/runtime/library").Decimal | null;
            registrationDeadline: Date | null;
            registrationRules: string | null;
            tiebreakerCriteria: import("@prisma/client/runtime/library").JsonValue | null;
            bracketType: import(".prisma/client").$Enums.BracketType | null;
            groupsCount: number | null;
            teamsPerGroup: number | null;
            teamsAdvancing: number | null;
        }[];
        stages: ({
            facilities: {
                id: string;
                name: string;
                available: boolean;
                stageId: string;
            }[];
        } & {
            number: string | null;
            id: string;
            name: string | null;
            latitude: number | null;
            longitude: number | null;
            date: Date;
            startTime: Date | null;
            address: string | null;
            city: string | null;
            state: string | null;
            regionRadius: number | null;
            tournamentId: string;
            maxTeams: number | null;
            street: string | null;
            neighborhood: string | null;
            cep: string | null;
        })[];
        sponsors: {
            id: string;
            name: string;
            description: string | null;
            tournamentId: string;
            logoUrl: string | null;
        }[];
    } & {
        id: string;
        name: string;
        status: import(".prisma/client").$Enums.TournamentStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        ownerId: string;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        isPublished: boolean;
    }>;
    startTournament(tournamentId: string, userId: string): Promise<{
        owner: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string | null;
        };
        _count: {
            registrations: number;
        };
        categories: {
            id: string;
            type: import(".prisma/client").$Enums.TournamentType;
            startTime: Date | null;
            modality: import(".prisma/client").$Enums.TournamentModality;
            bestOfSets: number;
            tournamentId: string;
            format: import(".prisma/client").$Enums.TournamentFormat;
            minMembers: number;
            maxMembers: number;
            semifinalBestOfSets: number | null;
            finalBestOfSets: number | null;
            registrationPrice: import("@prisma/client/runtime/library").Decimal | null;
            registrationDeadline: Date | null;
            registrationRules: string | null;
            tiebreakerCriteria: import("@prisma/client/runtime/library").JsonValue | null;
            bracketType: import(".prisma/client").$Enums.BracketType | null;
            groupsCount: number | null;
            teamsPerGroup: number | null;
            teamsAdvancing: number | null;
        }[];
        stages: ({
            facilities: {
                id: string;
                name: string;
                available: boolean;
                stageId: string;
            }[];
        } & {
            number: string | null;
            id: string;
            name: string | null;
            latitude: number | null;
            longitude: number | null;
            date: Date;
            startTime: Date | null;
            address: string | null;
            city: string | null;
            state: string | null;
            regionRadius: number | null;
            tournamentId: string;
            maxTeams: number | null;
            street: string | null;
            neighborhood: string | null;
            cep: string | null;
        })[];
        sponsors: {
            id: string;
            name: string;
            description: string | null;
            tournamentId: string;
            logoUrl: string | null;
        }[];
    } & {
        id: string;
        name: string;
        status: import(".prisma/client").$Enums.TournamentStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        ownerId: string;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        isPublished: boolean;
    }>;
    generateRefereeCode(tournamentId: string, userId: string): Promise<{
        code: string;
    }>;
    enterRefereeCode(userId: string, code: string): Promise<{
        tournamentId: string;
        tournamentName: string;
    }>;
    addReferee(tournamentId: string, organizerId: string, email: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        userId: string;
        tournamentId: string;
        codeConfirmed: boolean;
        invitedAt: Date;
    }>;
    removeReferee(tournamentId: string, organizerId: string, refereeId: string): Promise<void>;
    getReferees(tournamentId: string): Promise<({
        user: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        userId: string;
        tournamentId: string;
        codeConfirmed: boolean;
        invitedAt: Date;
    })[]>;
    findRefereeTournaments(userId: string): Promise<{
        invitedAt: Date;
        _count: {
            brackets: number;
        };
        stages: {
            number: string | null;
            id: string;
            name: string | null;
            latitude: number | null;
            longitude: number | null;
            date: Date;
            startTime: Date | null;
            address: string | null;
            city: string | null;
            state: string | null;
            regionRadius: number | null;
            tournamentId: string;
            maxTeams: number | null;
            street: string | null;
            neighborhood: string | null;
            cep: string | null;
        }[];
        id: string;
        name: string;
        status: import(".prisma/client").$Enums.TournamentStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        ownerId: string;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        isPublished: boolean;
    }[]>;
    saveAsDraft(tournamentId: string, userId: string): Promise<{
        owner: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string | null;
        };
        _count: {
            registrations: number;
        };
        categories: {
            id: string;
            type: import(".prisma/client").$Enums.TournamentType;
            startTime: Date | null;
            modality: import(".prisma/client").$Enums.TournamentModality;
            bestOfSets: number;
            tournamentId: string;
            format: import(".prisma/client").$Enums.TournamentFormat;
            minMembers: number;
            maxMembers: number;
            semifinalBestOfSets: number | null;
            finalBestOfSets: number | null;
            registrationPrice: import("@prisma/client/runtime/library").Decimal | null;
            registrationDeadline: Date | null;
            registrationRules: string | null;
            tiebreakerCriteria: import("@prisma/client/runtime/library").JsonValue | null;
            bracketType: import(".prisma/client").$Enums.BracketType | null;
            groupsCount: number | null;
            teamsPerGroup: number | null;
            teamsAdvancing: number | null;
        }[];
        stages: ({
            facilities: {
                id: string;
                name: string;
                available: boolean;
                stageId: string;
            }[];
        } & {
            number: string | null;
            id: string;
            name: string | null;
            latitude: number | null;
            longitude: number | null;
            date: Date;
            startTime: Date | null;
            address: string | null;
            city: string | null;
            state: string | null;
            regionRadius: number | null;
            tournamentId: string;
            maxTeams: number | null;
            street: string | null;
            neighborhood: string | null;
            cep: string | null;
        })[];
        sponsors: {
            id: string;
            name: string;
            description: string | null;
            tournamentId: string;
            logoUrl: string | null;
        }[];
    } & {
        id: string;
        name: string;
        status: import(".prisma/client").$Enums.TournamentStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        ownerId: string;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        isPublished: boolean;
    }>;
    findAll(query: QueryTournamentsDto): Promise<({
        owner: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string | null;
        };
        _count: {
            categories: number;
        };
        categories: {
            id: string;
            type: import(".prisma/client").$Enums.TournamentType;
            startTime: Date | null;
            modality: import(".prisma/client").$Enums.TournamentModality;
            bestOfSets: number;
            tournamentId: string;
            format: import(".prisma/client").$Enums.TournamentFormat;
            minMembers: number;
            maxMembers: number;
            semifinalBestOfSets: number | null;
            finalBestOfSets: number | null;
            registrationPrice: import("@prisma/client/runtime/library").Decimal | null;
            registrationDeadline: Date | null;
            registrationRules: string | null;
            tiebreakerCriteria: import("@prisma/client/runtime/library").JsonValue | null;
            bracketType: import(".prisma/client").$Enums.BracketType | null;
            groupsCount: number | null;
            teamsPerGroup: number | null;
            teamsAdvancing: number | null;
        }[];
    } & {
        id: string;
        name: string;
        status: import(".prisma/client").$Enums.TournamentStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        ownerId: string;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        isPublished: boolean;
    })[]>;
    findMine(userId: string): Promise<({
        owner: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string | null;
        };
        _count: {
            registrations: number;
            categories: number;
        };
        stages: {
            number: string | null;
            id: string;
            name: string | null;
            latitude: number | null;
            longitude: number | null;
            date: Date;
            startTime: Date | null;
            address: string | null;
            city: string | null;
            state: string | null;
            regionRadius: number | null;
            tournamentId: string;
            maxTeams: number | null;
            street: string | null;
            neighborhood: string | null;
            cep: string | null;
        }[];
    } & {
        id: string;
        name: string;
        status: import(".prisma/client").$Enums.TournamentStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        ownerId: string;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        isPublished: boolean;
    })[]>;
    findOne(tournamentId: string): Promise<{
        owner: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string | null;
        };
        _count: {
            registrations: number;
        };
        categories: {
            id: string;
            type: import(".prisma/client").$Enums.TournamentType;
            startTime: Date | null;
            modality: import(".prisma/client").$Enums.TournamentModality;
            bestOfSets: number;
            tournamentId: string;
            format: import(".prisma/client").$Enums.TournamentFormat;
            minMembers: number;
            maxMembers: number;
            semifinalBestOfSets: number | null;
            finalBestOfSets: number | null;
            registrationPrice: import("@prisma/client/runtime/library").Decimal | null;
            registrationDeadline: Date | null;
            registrationRules: string | null;
            tiebreakerCriteria: import("@prisma/client/runtime/library").JsonValue | null;
            bracketType: import(".prisma/client").$Enums.BracketType | null;
            groupsCount: number | null;
            teamsPerGroup: number | null;
            teamsAdvancing: number | null;
        }[];
        stages: ({
            facilities: {
                id: string;
                name: string;
                available: boolean;
                stageId: string;
            }[];
        } & {
            number: string | null;
            id: string;
            name: string | null;
            latitude: number | null;
            longitude: number | null;
            date: Date;
            startTime: Date | null;
            address: string | null;
            city: string | null;
            state: string | null;
            regionRadius: number | null;
            tournamentId: string;
            maxTeams: number | null;
            street: string | null;
            neighborhood: string | null;
            cep: string | null;
        })[];
        sponsors: {
            id: string;
            name: string;
            description: string | null;
            tournamentId: string;
            logoUrl: string | null;
        }[];
    } & {
        id: string;
        name: string;
        status: import(".prisma/client").$Enums.TournamentStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        ownerId: string;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        isPublished: boolean;
    }>;
    cancel(tournamentId: string, userId: string): Promise<{
        owner: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string | null;
        };
        _count: {
            registrations: number;
        };
        categories: {
            id: string;
            type: import(".prisma/client").$Enums.TournamentType;
            startTime: Date | null;
            modality: import(".prisma/client").$Enums.TournamentModality;
            bestOfSets: number;
            tournamentId: string;
            format: import(".prisma/client").$Enums.TournamentFormat;
            minMembers: number;
            maxMembers: number;
            semifinalBestOfSets: number | null;
            finalBestOfSets: number | null;
            registrationPrice: import("@prisma/client/runtime/library").Decimal | null;
            registrationDeadline: Date | null;
            registrationRules: string | null;
            tiebreakerCriteria: import("@prisma/client/runtime/library").JsonValue | null;
            bracketType: import(".prisma/client").$Enums.BracketType | null;
            groupsCount: number | null;
            teamsPerGroup: number | null;
            teamsAdvancing: number | null;
        }[];
        stages: ({
            facilities: {
                id: string;
                name: string;
                available: boolean;
                stageId: string;
            }[];
        } & {
            number: string | null;
            id: string;
            name: string | null;
            latitude: number | null;
            longitude: number | null;
            date: Date;
            startTime: Date | null;
            address: string | null;
            city: string | null;
            state: string | null;
            regionRadius: number | null;
            tournamentId: string;
            maxTeams: number | null;
            street: string | null;
            neighborhood: string | null;
            cep: string | null;
        })[];
        sponsors: {
            id: string;
            name: string;
            description: string | null;
            tournamentId: string;
            logoUrl: string | null;
        }[];
    } & {
        id: string;
        name: string;
        status: import(".prisma/client").$Enums.TournamentStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        ownerId: string;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        isPublished: boolean;
    }>;
    verifyOwnership(tournamentId: string, userId: string): Promise<{
        id: string;
        name: string;
        status: import(".prisma/client").$Enums.TournamentStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        ownerId: string;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        isPublished: boolean;
    }>;
    explore(query: ExploreQueryDto): Promise<{
        id: string;
        name: string;
        status: import(".prisma/client").$Enums.TournamentStatus;
        createdAt: Date;
        registrations: {
            team: {
                id: string;
                name: string;
                avatarUrl: string | null;
            };
        }[];
        owner: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string | null;
        };
        _count: {
            registrations: number;
        };
        imageUrl: string | null;
        categories: {
            type: import(".prisma/client").$Enums.TournamentType;
            modality: import(".prisma/client").$Enums.TournamentModality;
            format: import(".prisma/client").$Enums.TournamentFormat;
            registrationPrice: import("@prisma/client/runtime/library").Decimal | null;
        }[];
        stages: {
            number: string | null;
            date: Date;
            city: string | null;
            state: string | null;
            maxTeams: number | null;
            street: string | null;
            neighborhood: string | null;
        }[];
    }[]>;
    exploreWithNearby(query: ExploreQueryDto & {
        latitude?: number;
        longitude?: number;
    }): Promise<{
        nearby: any[];
        all: {
            id: string;
            name: string;
            status: import(".prisma/client").$Enums.TournamentStatus;
            createdAt: Date;
            registrations: {
                team: {
                    id: string;
                    name: string;
                    avatarUrl: string | null;
                };
            }[];
            owner: {
                id: string;
                email: string;
                name: string;
                avatarUrl: string | null;
            };
            _count: {
                registrations: number;
            };
            imageUrl: string | null;
            categories: {
                type: import(".prisma/client").$Enums.TournamentType;
                modality: import(".prisma/client").$Enums.TournamentModality;
                format: import(".prisma/client").$Enums.TournamentFormat;
                registrationPrice: import("@prisma/client/runtime/library").Decimal | null;
            }[];
            stages: {
                number: string | null;
                date: Date;
                city: string | null;
                state: string | null;
                maxTeams: number | null;
                street: string | null;
                neighborhood: string | null;
            }[];
        }[];
        hasMore: boolean;
        nextCursor: string | null;
    }>;
    getPublicDetails(tournamentId: string, userId?: string): Promise<{
        userRegistration: {
            id: string;
            status: import(".prisma/client").$Enums.RegistrationStatus;
            category: {
                type: import(".prisma/client").$Enums.TournamentType;
                format: import(".prisma/client").$Enums.TournamentFormat;
            };
        } | null;
        owner: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string | null;
        };
        categories: ({
            registrations: {
                id: string;
                status: import(".prisma/client").$Enums.RegistrationStatus;
                team: {
                    id: string;
                    name: string;
                    avatarUrl: string | null;
                };
            }[];
        } & {
            id: string;
            type: import(".prisma/client").$Enums.TournamentType;
            startTime: Date | null;
            modality: import(".prisma/client").$Enums.TournamentModality;
            bestOfSets: number;
            tournamentId: string;
            format: import(".prisma/client").$Enums.TournamentFormat;
            minMembers: number;
            maxMembers: number;
            semifinalBestOfSets: number | null;
            finalBestOfSets: number | null;
            registrationPrice: import("@prisma/client/runtime/library").Decimal | null;
            registrationDeadline: Date | null;
            registrationRules: string | null;
            tiebreakerCriteria: import("@prisma/client/runtime/library").JsonValue | null;
            bracketType: import(".prisma/client").$Enums.BracketType | null;
            groupsCount: number | null;
            teamsPerGroup: number | null;
            teamsAdvancing: number | null;
        })[];
        stages: ({
            facilities: {
                id: string;
                name: string;
                available: boolean;
                stageId: string;
            }[];
        } & {
            number: string | null;
            id: string;
            name: string | null;
            latitude: number | null;
            longitude: number | null;
            date: Date;
            startTime: Date | null;
            address: string | null;
            city: string | null;
            state: string | null;
            regionRadius: number | null;
            tournamentId: string;
            maxTeams: number | null;
            street: string | null;
            neighborhood: string | null;
            cep: string | null;
        })[];
        sponsors: {
            id: string;
            name: string;
            description: string | null;
            tournamentId: string;
            logoUrl: string | null;
        }[];
        brackets: ({
            matches: ({
                teamA: {
                    id: string;
                    name: string;
                    avatarUrl: string | null;
                } | null;
                teamB: {
                    id: string;
                    name: string;
                    avatarUrl: string | null;
                } | null;
                winner: {
                    id: string;
                    name: string;
                } | null;
            } & {
                id: string;
                status: import(".prisma/client").$Enums.MatchStatus;
                teamAId: string | null;
                teamBId: string | null;
                scoreTeamA: number;
                scoreTeamB: number;
                refereeCode: string | null;
                refereeCodeExpiresAt: Date | null;
                bracketId: string | null;
                friendlyId: string | null;
                round: number;
                position: number;
                scheduledAt: Date | null;
                group: number | null;
                bestOfSets: number | null;
                label: string | null;
                nextMatchId: string | null;
                winnerId: string | null;
                refereeId: string | null;
                startedAt: Date | null;
                finishedAt: Date | null;
            })[];
        } & {
            id: string;
            type: import(".prisma/client").$Enums.BracketType;
            tournamentId: string;
            categoryId: string;
        })[];
        id: string;
        name: string;
        status: import(".prisma/client").$Enums.TournamentStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        ownerId: string;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        isPublished: boolean;
    }>;
    private ensureDraft;
    private ensureEditable;
}
