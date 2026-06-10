import { PrismaService } from '../../common/prisma.service';
import { StorageService } from '../storage/storage.service';
import { NotificationService } from '../../common/services/notification.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateStructureDto } from './dto/update-structure.dto';
import { AddSponsorsDto } from './dto/add-sponsors.dto';
import { QueryTournamentsDto } from './dto/query-tournaments.dto';
import { ExploreQueryDto } from './dto/explore-query.dto';
export declare class TournamentsService {
    private prisma;
    private storage;
    private notificationService;
    constructor(prisma: PrismaService, storage: StorageService, notificationService: NotificationService);
    create(userId: string, dto: CreateTournamentDto): Promise<{
        _count: {
            registrations: number;
        };
        owner: {
            id: string;
            name: string;
            avatarUrl: string | null;
            email: string;
        };
        categories: {
            id: string;
            tournamentId: string;
            type: import(".prisma/client").$Enums.TournamentType;
            format: import(".prisma/client").$Enums.TournamentFormat;
            modality: import(".prisma/client").$Enums.TournamentModality;
            minMembers: number;
            maxMembers: number;
            bestOfSets: number;
            semifinalBestOfSets: number | null;
            finalBestOfSets: number | null;
            tiebreakScore: number | null;
            startTime: Date | null;
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
            tournamentId: string;
            startTime: Date | null;
            name: string | null;
            latitude: number | null;
            longitude: number | null;
            date: Date;
            maxTeams: number | null;
            street: string | null;
            neighborhood: string | null;
            address: string | null;
            city: string | null;
            state: string | null;
            cep: string | null;
            regionRadius: number | null;
        })[];
        sponsors: {
            id: string;
            tournamentId: string;
            name: string;
            description: string | null;
            logoUrl: string | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TournamentStatus;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        isPublished: boolean;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
    }>;
    update(tournamentId: string, userId: string, dto: CreateTournamentDto): Promise<{
        _count: {
            registrations: number;
        };
        owner: {
            id: string;
            name: string;
            avatarUrl: string | null;
            email: string;
        };
        categories: {
            id: string;
            tournamentId: string;
            type: import(".prisma/client").$Enums.TournamentType;
            format: import(".prisma/client").$Enums.TournamentFormat;
            modality: import(".prisma/client").$Enums.TournamentModality;
            minMembers: number;
            maxMembers: number;
            bestOfSets: number;
            semifinalBestOfSets: number | null;
            finalBestOfSets: number | null;
            tiebreakScore: number | null;
            startTime: Date | null;
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
            tournamentId: string;
            startTime: Date | null;
            name: string | null;
            latitude: number | null;
            longitude: number | null;
            date: Date;
            maxTeams: number | null;
            street: string | null;
            neighborhood: string | null;
            address: string | null;
            city: string | null;
            state: string | null;
            cep: string | null;
            regionRadius: number | null;
        })[];
        sponsors: {
            id: string;
            tournamentId: string;
            name: string;
            description: string | null;
            logoUrl: string | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TournamentStatus;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        isPublished: boolean;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
    }>;
    updateStructure(tournamentId: string, userId: string, dto: UpdateStructureDto): Promise<{
        _count: {
            registrations: number;
        };
        owner: {
            id: string;
            name: string;
            avatarUrl: string | null;
            email: string;
        };
        categories: {
            id: string;
            tournamentId: string;
            type: import(".prisma/client").$Enums.TournamentType;
            format: import(".prisma/client").$Enums.TournamentFormat;
            modality: import(".prisma/client").$Enums.TournamentModality;
            minMembers: number;
            maxMembers: number;
            bestOfSets: number;
            semifinalBestOfSets: number | null;
            finalBestOfSets: number | null;
            tiebreakScore: number | null;
            startTime: Date | null;
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
            tournamentId: string;
            startTime: Date | null;
            name: string | null;
            latitude: number | null;
            longitude: number | null;
            date: Date;
            maxTeams: number | null;
            street: string | null;
            neighborhood: string | null;
            address: string | null;
            city: string | null;
            state: string | null;
            cep: string | null;
            regionRadius: number | null;
        })[];
        sponsors: {
            id: string;
            tournamentId: string;
            name: string;
            description: string | null;
            logoUrl: string | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TournamentStatus;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        isPublished: boolean;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
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
        tournamentId: string;
        startTime: Date | null;
        name: string | null;
        latitude: number | null;
        longitude: number | null;
        date: Date;
        maxTeams: number | null;
        street: string | null;
        neighborhood: string | null;
        address: string | null;
        city: string | null;
        state: string | null;
        cep: string | null;
        regionRadius: number | null;
    }) | null>;
    removeStageFacility(tournamentId: string, stageId: string, facilityId: string, userId: string): Promise<void>;
    addSponsors(tournamentId: string, userId: string, dto: AddSponsorsDto): Promise<({
        sponsors: {
            id: string;
            tournamentId: string;
            name: string;
            description: string | null;
            logoUrl: string | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TournamentStatus;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        isPublished: boolean;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
    }) | null>;
    removeSponsor(tournamentId: string, sponsorId: string, userId: string): Promise<void>;
    getSummary(tournamentId: string, userId: string): Promise<({
        _count: {
            registrations: number;
        };
        owner: {
            id: string;
            name: string;
            avatarUrl: string | null;
            email: string;
        };
        categories: {
            id: string;
            tournamentId: string;
            type: import(".prisma/client").$Enums.TournamentType;
            format: import(".prisma/client").$Enums.TournamentFormat;
            modality: import(".prisma/client").$Enums.TournamentModality;
            minMembers: number;
            maxMembers: number;
            bestOfSets: number;
            semifinalBestOfSets: number | null;
            finalBestOfSets: number | null;
            tiebreakScore: number | null;
            startTime: Date | null;
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
            tournamentId: string;
            startTime: Date | null;
            name: string | null;
            latitude: number | null;
            longitude: number | null;
            date: Date;
            maxTeams: number | null;
            street: string | null;
            neighborhood: string | null;
            address: string | null;
            city: string | null;
            state: string | null;
            cep: string | null;
            regionRadius: number | null;
        })[];
        sponsors: {
            id: string;
            tournamentId: string;
            name: string;
            description: string | null;
            logoUrl: string | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TournamentStatus;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        isPublished: boolean;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
    }) | null>;
    publish(tournamentId: string, userId: string): Promise<{
        _count: {
            registrations: number;
        };
        owner: {
            id: string;
            name: string;
            avatarUrl: string | null;
            email: string;
        };
        categories: {
            id: string;
            tournamentId: string;
            type: import(".prisma/client").$Enums.TournamentType;
            format: import(".prisma/client").$Enums.TournamentFormat;
            modality: import(".prisma/client").$Enums.TournamentModality;
            minMembers: number;
            maxMembers: number;
            bestOfSets: number;
            semifinalBestOfSets: number | null;
            finalBestOfSets: number | null;
            tiebreakScore: number | null;
            startTime: Date | null;
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
            tournamentId: string;
            startTime: Date | null;
            name: string | null;
            latitude: number | null;
            longitude: number | null;
            date: Date;
            maxTeams: number | null;
            street: string | null;
            neighborhood: string | null;
            address: string | null;
            city: string | null;
            state: string | null;
            cep: string | null;
            regionRadius: number | null;
        })[];
        sponsors: {
            id: string;
            tournamentId: string;
            name: string;
            description: string | null;
            logoUrl: string | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TournamentStatus;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        isPublished: boolean;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
    }>;
    startTournament(tournamentId: string, userId: string): Promise<{
        _count: {
            registrations: number;
        };
        owner: {
            id: string;
            name: string;
            avatarUrl: string | null;
            email: string;
        };
        categories: {
            id: string;
            tournamentId: string;
            type: import(".prisma/client").$Enums.TournamentType;
            format: import(".prisma/client").$Enums.TournamentFormat;
            modality: import(".prisma/client").$Enums.TournamentModality;
            minMembers: number;
            maxMembers: number;
            bestOfSets: number;
            semifinalBestOfSets: number | null;
            finalBestOfSets: number | null;
            tiebreakScore: number | null;
            startTime: Date | null;
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
            tournamentId: string;
            startTime: Date | null;
            name: string | null;
            latitude: number | null;
            longitude: number | null;
            date: Date;
            maxTeams: number | null;
            street: string | null;
            neighborhood: string | null;
            address: string | null;
            city: string | null;
            state: string | null;
            cep: string | null;
            regionRadius: number | null;
        })[];
        sponsors: {
            id: string;
            tournamentId: string;
            name: string;
            description: string | null;
            logoUrl: string | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TournamentStatus;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        isPublished: boolean;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
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
            name: string;
            avatarUrl: string | null;
            email: string;
        };
    } & {
        id: string;
        tournamentId: string;
        userId: string;
        codeConfirmed: boolean;
        invitedAt: Date;
    }>;
    removeReferee(tournamentId: string, organizerId: string, refereeId: string): Promise<void>;
    completeTournament(tournamentId: string, userId: string): Promise<{
        _count: {
            registrations: number;
        };
        owner: {
            id: string;
            name: string;
            avatarUrl: string | null;
            email: string;
        };
        categories: {
            id: string;
            tournamentId: string;
            type: import(".prisma/client").$Enums.TournamentType;
            format: import(".prisma/client").$Enums.TournamentFormat;
            modality: import(".prisma/client").$Enums.TournamentModality;
            minMembers: number;
            maxMembers: number;
            bestOfSets: number;
            semifinalBestOfSets: number | null;
            finalBestOfSets: number | null;
            tiebreakScore: number | null;
            startTime: Date | null;
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
            tournamentId: string;
            startTime: Date | null;
            name: string | null;
            latitude: number | null;
            longitude: number | null;
            date: Date;
            maxTeams: number | null;
            street: string | null;
            neighborhood: string | null;
            address: string | null;
            city: string | null;
            state: string | null;
            cep: string | null;
            regionRadius: number | null;
        })[];
        sponsors: {
            id: string;
            tournamentId: string;
            name: string;
            description: string | null;
            logoUrl: string | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TournamentStatus;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        isPublished: boolean;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
    }>;
    getReferees(tournamentId: string): Promise<({
        user: {
            id: string;
            name: string;
            avatarUrl: string | null;
            email: string;
        };
    } & {
        id: string;
        tournamentId: string;
        userId: string;
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
            tournamentId: string;
            startTime: Date | null;
            name: string | null;
            latitude: number | null;
            longitude: number | null;
            date: Date;
            maxTeams: number | null;
            street: string | null;
            neighborhood: string | null;
            address: string | null;
            city: string | null;
            state: string | null;
            cep: string | null;
            regionRadius: number | null;
        }[];
        id: string;
        name: string;
        description: string | null;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TournamentStatus;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        isPublished: boolean;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
    }[]>;
    saveAsDraft(tournamentId: string, userId: string): Promise<{
        _count: {
            registrations: number;
        };
        owner: {
            id: string;
            name: string;
            avatarUrl: string | null;
            email: string;
        };
        categories: {
            id: string;
            tournamentId: string;
            type: import(".prisma/client").$Enums.TournamentType;
            format: import(".prisma/client").$Enums.TournamentFormat;
            modality: import(".prisma/client").$Enums.TournamentModality;
            minMembers: number;
            maxMembers: number;
            bestOfSets: number;
            semifinalBestOfSets: number | null;
            finalBestOfSets: number | null;
            tiebreakScore: number | null;
            startTime: Date | null;
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
            tournamentId: string;
            startTime: Date | null;
            name: string | null;
            latitude: number | null;
            longitude: number | null;
            date: Date;
            maxTeams: number | null;
            street: string | null;
            neighborhood: string | null;
            address: string | null;
            city: string | null;
            state: string | null;
            cep: string | null;
            regionRadius: number | null;
        })[];
        sponsors: {
            id: string;
            tournamentId: string;
            name: string;
            description: string | null;
            logoUrl: string | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TournamentStatus;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        isPublished: boolean;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
    }>;
    findAll(query: QueryTournamentsDto): Promise<({
        _count: {
            categories: number;
        };
        owner: {
            id: string;
            name: string;
            avatarUrl: string | null;
            email: string;
        };
        categories: {
            id: string;
            tournamentId: string;
            type: import(".prisma/client").$Enums.TournamentType;
            format: import(".prisma/client").$Enums.TournamentFormat;
            modality: import(".prisma/client").$Enums.TournamentModality;
            minMembers: number;
            maxMembers: number;
            bestOfSets: number;
            semifinalBestOfSets: number | null;
            finalBestOfSets: number | null;
            tiebreakScore: number | null;
            startTime: Date | null;
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
        description: string | null;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TournamentStatus;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        isPublished: boolean;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
    })[]>;
    findMine(userId: string): Promise<({
        _count: {
            registrations: number;
            categories: number;
        };
        owner: {
            id: string;
            name: string;
            avatarUrl: string | null;
            email: string;
        };
        stages: {
            number: string | null;
            id: string;
            tournamentId: string;
            startTime: Date | null;
            name: string | null;
            latitude: number | null;
            longitude: number | null;
            date: Date;
            maxTeams: number | null;
            street: string | null;
            neighborhood: string | null;
            address: string | null;
            city: string | null;
            state: string | null;
            cep: string | null;
            regionRadius: number | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TournamentStatus;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        isPublished: boolean;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
    })[]>;
    findOne(tournamentId: string): Promise<{
        _count: {
            registrations: number;
        };
        owner: {
            id: string;
            name: string;
            avatarUrl: string | null;
            email: string;
        };
        categories: {
            id: string;
            tournamentId: string;
            type: import(".prisma/client").$Enums.TournamentType;
            format: import(".prisma/client").$Enums.TournamentFormat;
            modality: import(".prisma/client").$Enums.TournamentModality;
            minMembers: number;
            maxMembers: number;
            bestOfSets: number;
            semifinalBestOfSets: number | null;
            finalBestOfSets: number | null;
            tiebreakScore: number | null;
            startTime: Date | null;
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
            tournamentId: string;
            startTime: Date | null;
            name: string | null;
            latitude: number | null;
            longitude: number | null;
            date: Date;
            maxTeams: number | null;
            street: string | null;
            neighborhood: string | null;
            address: string | null;
            city: string | null;
            state: string | null;
            cep: string | null;
            regionRadius: number | null;
        })[];
        sponsors: {
            id: string;
            tournamentId: string;
            name: string;
            description: string | null;
            logoUrl: string | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TournamentStatus;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        isPublished: boolean;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
    }>;
    cancel(tournamentId: string, userId: string): Promise<{
        _count: {
            registrations: number;
        };
        owner: {
            id: string;
            name: string;
            avatarUrl: string | null;
            email: string;
        };
        categories: {
            id: string;
            tournamentId: string;
            type: import(".prisma/client").$Enums.TournamentType;
            format: import(".prisma/client").$Enums.TournamentFormat;
            modality: import(".prisma/client").$Enums.TournamentModality;
            minMembers: number;
            maxMembers: number;
            bestOfSets: number;
            semifinalBestOfSets: number | null;
            finalBestOfSets: number | null;
            tiebreakScore: number | null;
            startTime: Date | null;
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
            tournamentId: string;
            startTime: Date | null;
            name: string | null;
            latitude: number | null;
            longitude: number | null;
            date: Date;
            maxTeams: number | null;
            street: string | null;
            neighborhood: string | null;
            address: string | null;
            city: string | null;
            state: string | null;
            cep: string | null;
            regionRadius: number | null;
        })[];
        sponsors: {
            id: string;
            tournamentId: string;
            name: string;
            description: string | null;
            logoUrl: string | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TournamentStatus;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        isPublished: boolean;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
    }>;
    verifyOwnership(tournamentId: string, userId: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TournamentStatus;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        isPublished: boolean;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
    }>;
    explore(query: ExploreQueryDto): Promise<{
        id: string;
        registrations: {
            team: {
                id: string;
                name: string;
                avatarUrl: string | null;
            };
        }[];
        _count: {
            registrations: number;
        };
        name: string;
        createdAt: Date;
        owner: {
            id: string;
            name: string;
            avatarUrl: string | null;
            email: string;
        };
        status: import(".prisma/client").$Enums.TournamentStatus;
        imageUrl: string | null;
        categories: {
            type: import(".prisma/client").$Enums.TournamentType;
            format: import(".prisma/client").$Enums.TournamentFormat;
            modality: import(".prisma/client").$Enums.TournamentModality;
            registrationPrice: import("@prisma/client/runtime/library").Decimal | null;
        }[];
        stages: {
            number: string | null;
            date: Date;
            maxTeams: number | null;
            street: string | null;
            neighborhood: string | null;
            city: string | null;
            state: string | null;
        }[];
    }[]>;
    exploreWithNearby(query: ExploreQueryDto & {
        latitude?: number;
        longitude?: number;
    }): Promise<{
        nearby: any[];
        all: {
            id: string;
            registrations: {
                team: {
                    id: string;
                    name: string;
                    avatarUrl: string | null;
                };
            }[];
            _count: {
                registrations: number;
            };
            name: string;
            createdAt: Date;
            owner: {
                id: string;
                name: string;
                avatarUrl: string | null;
                email: string;
            };
            status: import(".prisma/client").$Enums.TournamentStatus;
            imageUrl: string | null;
            categories: {
                type: import(".prisma/client").$Enums.TournamentType;
                format: import(".prisma/client").$Enums.TournamentFormat;
                modality: import(".prisma/client").$Enums.TournamentModality;
                registrationPrice: import("@prisma/client/runtime/library").Decimal | null;
            }[];
            stages: {
                number: string | null;
                date: Date;
                maxTeams: number | null;
                street: string | null;
                neighborhood: string | null;
                city: string | null;
                state: string | null;
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
                bestOfSets: number | null;
                tiebreakScore: number | null;
                status: import(".prisma/client").$Enums.MatchStatus;
                refereeCode: string | null;
                refereeCodeExpiresAt: Date | null;
                scheduledAt: Date | null;
                position: number;
                round: number;
                refereeId: string | null;
                friendlyId: string | null;
                bracketId: string | null;
                group: number | null;
                label: string | null;
                teamAId: string | null;
                teamBId: string | null;
                scoreTeamA: number;
                scoreTeamB: number;
                nextMatchId: string | null;
                winnerId: string | null;
                startedAt: Date | null;
                finishedAt: Date | null;
            })[];
        } & {
            id: string;
            tournamentId: string;
            type: import(".prisma/client").$Enums.BracketType;
            categoryId: string;
        })[];
        owner: {
            id: string;
            name: string;
            avatarUrl: string | null;
            email: string;
        };
        categories: ({
            registrations: {
                id: string;
                team: {
                    id: string;
                    name: string;
                    avatarUrl: string | null;
                };
                status: import(".prisma/client").$Enums.RegistrationStatus;
            }[];
        } & {
            id: string;
            tournamentId: string;
            type: import(".prisma/client").$Enums.TournamentType;
            format: import(".prisma/client").$Enums.TournamentFormat;
            modality: import(".prisma/client").$Enums.TournamentModality;
            minMembers: number;
            maxMembers: number;
            bestOfSets: number;
            semifinalBestOfSets: number | null;
            finalBestOfSets: number | null;
            tiebreakScore: number | null;
            startTime: Date | null;
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
            tournamentId: string;
            startTime: Date | null;
            name: string | null;
            latitude: number | null;
            longitude: number | null;
            date: Date;
            maxTeams: number | null;
            street: string | null;
            neighborhood: string | null;
            address: string | null;
            city: string | null;
            state: string | null;
            cep: string | null;
            regionRadius: number | null;
        })[];
        sponsors: {
            id: string;
            tournamentId: string;
            name: string;
            description: string | null;
            logoUrl: string | null;
        }[];
        id: string;
        name: string;
        description: string | null;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TournamentStatus;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        isPublished: boolean;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
    }>;
    private ensureDraft;
    private ensureEditable;
    getBanners(): Promise<string[]>;
    uploadCover(tournamentId: string, userId: string, file: Express.Multer.File): Promise<{
        _count: {
            registrations: number;
        };
        owner: {
            id: string;
            name: string;
            avatarUrl: string | null;
            email: string;
        };
        categories: {
            id: string;
            tournamentId: string;
            type: import(".prisma/client").$Enums.TournamentType;
            format: import(".prisma/client").$Enums.TournamentFormat;
            modality: import(".prisma/client").$Enums.TournamentModality;
            minMembers: number;
            maxMembers: number;
            bestOfSets: number;
            semifinalBestOfSets: number | null;
            finalBestOfSets: number | null;
            tiebreakScore: number | null;
            startTime: Date | null;
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
            tournamentId: string;
            startTime: Date | null;
            name: string | null;
            latitude: number | null;
            longitude: number | null;
            date: Date;
            maxTeams: number | null;
            street: string | null;
            neighborhood: string | null;
            address: string | null;
            city: string | null;
            state: string | null;
            cep: string | null;
            regionRadius: number | null;
        })[];
        sponsors: {
            id: string;
            tournamentId: string;
            name: string;
            description: string | null;
            logoUrl: string | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TournamentStatus;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        isPublished: boolean;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
    }>;
    setBannerUrl(tournamentId: string, userId: string, imageUrl: string): Promise<{
        _count: {
            registrations: number;
        };
        owner: {
            id: string;
            name: string;
            avatarUrl: string | null;
            email: string;
        };
        categories: {
            id: string;
            tournamentId: string;
            type: import(".prisma/client").$Enums.TournamentType;
            format: import(".prisma/client").$Enums.TournamentFormat;
            modality: import(".prisma/client").$Enums.TournamentModality;
            minMembers: number;
            maxMembers: number;
            bestOfSets: number;
            semifinalBestOfSets: number | null;
            finalBestOfSets: number | null;
            tiebreakScore: number | null;
            startTime: Date | null;
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
            tournamentId: string;
            startTime: Date | null;
            name: string | null;
            latitude: number | null;
            longitude: number | null;
            date: Date;
            maxTeams: number | null;
            street: string | null;
            neighborhood: string | null;
            address: string | null;
            city: string | null;
            state: string | null;
            cep: string | null;
            regionRadius: number | null;
        })[];
        sponsors: {
            id: string;
            tournamentId: string;
            name: string;
            description: string | null;
            logoUrl: string | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TournamentStatus;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        isPublished: boolean;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
    }>;
}
