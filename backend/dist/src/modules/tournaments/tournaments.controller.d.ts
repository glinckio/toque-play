import { TournamentsService } from './tournaments.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateStructureDto } from './dto/update-structure.dto';
import { AddFacilitiesDto } from './dto/add-facilities.dto';
import { AddSponsorsDto } from './dto/add-sponsors.dto';
import { QueryTournamentsDto } from './dto/query-tournaments.dto';
import { ExploreQueryDto } from './dto/explore-query.dto';
export declare class TournamentsController {
    private readonly tournamentsService;
    constructor(tournamentsService: TournamentsService);
    create(userId: string, dto: CreateTournamentDto): Promise<{
        owner: {
            id: string;
            name: string;
            email: string;
            avatarUrl: string | null;
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
                stageId: string;
                available: boolean;
            }[];
        } & {
            number: string | null;
            id: string;
            name: string | null;
            latitude: number | null;
            longitude: number | null;
            tournamentId: string;
            startTime: Date | null;
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
            name: string;
            description: string | null;
            tournamentId: string;
            logoUrl: string | null;
        }[];
        _count: {
            registrations: number;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        status: import(".prisma/client").$Enums.TournamentStatus;
        isPublished: boolean;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }>;
    update(id: string, userId: string, dto: CreateTournamentDto): Promise<{
        owner: {
            id: string;
            name: string;
            email: string;
            avatarUrl: string | null;
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
                stageId: string;
                available: boolean;
            }[];
        } & {
            number: string | null;
            id: string;
            name: string | null;
            latitude: number | null;
            longitude: number | null;
            tournamentId: string;
            startTime: Date | null;
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
            name: string;
            description: string | null;
            tournamentId: string;
            logoUrl: string | null;
        }[];
        _count: {
            registrations: number;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        status: import(".prisma/client").$Enums.TournamentStatus;
        isPublished: boolean;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }>;
    updateStructure(id: string, userId: string, dto: UpdateStructureDto): Promise<{
        owner: {
            id: string;
            name: string;
            email: string;
            avatarUrl: string | null;
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
                stageId: string;
                available: boolean;
            }[];
        } & {
            number: string | null;
            id: string;
            name: string | null;
            latitude: number | null;
            longitude: number | null;
            tournamentId: string;
            startTime: Date | null;
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
            name: string;
            description: string | null;
            tournamentId: string;
            logoUrl: string | null;
        }[];
        _count: {
            registrations: number;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        status: import(".prisma/client").$Enums.TournamentStatus;
        isPublished: boolean;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }>;
    addStageFacilities(id: string, stageId: string, userId: string, dto: AddFacilitiesDto): Promise<({
        facilities: {
            id: string;
            name: string;
            stageId: string;
            available: boolean;
        }[];
    } & {
        number: string | null;
        id: string;
        name: string | null;
        latitude: number | null;
        longitude: number | null;
        tournamentId: string;
        startTime: Date | null;
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
    removeStageFacility(id: string, stageId: string, facilityId: string, userId: string): Promise<void>;
    addSponsors(id: string, userId: string, dto: AddSponsorsDto): Promise<({
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
        description: string | null;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        status: import(".prisma/client").$Enums.TournamentStatus;
        isPublished: boolean;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }) | null>;
    removeSponsor(id: string, sponsorId: string, userId: string): Promise<void>;
    getSummary(id: string, userId: string): Promise<({
        owner: {
            id: string;
            name: string;
            email: string;
            avatarUrl: string | null;
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
                stageId: string;
                available: boolean;
            }[];
        } & {
            number: string | null;
            id: string;
            name: string | null;
            latitude: number | null;
            longitude: number | null;
            tournamentId: string;
            startTime: Date | null;
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
            name: string;
            description: string | null;
            tournamentId: string;
            logoUrl: string | null;
        }[];
        _count: {
            registrations: number;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        status: import(".prisma/client").$Enums.TournamentStatus;
        isPublished: boolean;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }) | null>;
    publish(id: string, userId: string): Promise<{
        owner: {
            id: string;
            name: string;
            email: string;
            avatarUrl: string | null;
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
                stageId: string;
                available: boolean;
            }[];
        } & {
            number: string | null;
            id: string;
            name: string | null;
            latitude: number | null;
            longitude: number | null;
            tournamentId: string;
            startTime: Date | null;
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
            name: string;
            description: string | null;
            tournamentId: string;
            logoUrl: string | null;
        }[];
        _count: {
            registrations: number;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        status: import(".prisma/client").$Enums.TournamentStatus;
        isPublished: boolean;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }>;
    startTournament(id: string, userId: string): Promise<{
        owner: {
            id: string;
            name: string;
            email: string;
            avatarUrl: string | null;
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
                stageId: string;
                available: boolean;
            }[];
        } & {
            number: string | null;
            id: string;
            name: string | null;
            latitude: number | null;
            longitude: number | null;
            tournamentId: string;
            startTime: Date | null;
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
            name: string;
            description: string | null;
            tournamentId: string;
            logoUrl: string | null;
        }[];
        _count: {
            registrations: number;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        status: import(".prisma/client").$Enums.TournamentStatus;
        isPublished: boolean;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }>;
    generateRefereeCode(id: string, userId: string): Promise<{
        code: string;
    }>;
    enterRefereeCode(userId: string, code: string): Promise<{
        tournamentId: string;
        tournamentName: string;
    }>;
    addReferee(id: string, userId: string, email: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        tournamentId: string;
        userId: string;
        codeConfirmed: boolean;
        invitedAt: Date;
    }>;
    removeReferee(id: string, refereeId: string, userId: string): Promise<void>;
    getReferees(id: string): Promise<({
        user: {
            id: string;
            name: string;
            email: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        tournamentId: string;
        userId: string;
        codeConfirmed: boolean;
        invitedAt: Date;
    })[]>;
    saveAsDraft(id: string, userId: string): Promise<{
        owner: {
            id: string;
            name: string;
            email: string;
            avatarUrl: string | null;
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
                stageId: string;
                available: boolean;
            }[];
        } & {
            number: string | null;
            id: string;
            name: string | null;
            latitude: number | null;
            longitude: number | null;
            tournamentId: string;
            startTime: Date | null;
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
            name: string;
            description: string | null;
            tournamentId: string;
            logoUrl: string | null;
        }[];
        _count: {
            registrations: number;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        status: import(".prisma/client").$Enums.TournamentStatus;
        isPublished: boolean;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }>;
    findMine(userId: string): Promise<({
        owner: {
            id: string;
            name: string;
            email: string;
            avatarUrl: string | null;
        };
        stages: {
            number: string | null;
            id: string;
            name: string | null;
            latitude: number | null;
            longitude: number | null;
            tournamentId: string;
            startTime: Date | null;
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
        _count: {
            categories: number;
            registrations: number;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        status: import(".prisma/client").$Enums.TournamentStatus;
        isPublished: boolean;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    })[]>;
    findRefereeMine(userId: string): Promise<{
        invitedAt: Date;
        stages: {
            number: string | null;
            id: string;
            name: string | null;
            latitude: number | null;
            longitude: number | null;
            tournamentId: string;
            startTime: Date | null;
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
        _count: {
            brackets: number;
        };
        id: string;
        name: string;
        description: string | null;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        status: import(".prisma/client").$Enums.TournamentStatus;
        isPublished: boolean;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }[]>;
    explore(query: ExploreQueryDto): Promise<{
        nearby: any[];
        all: {
            id: string;
            name: string;
            imageUrl: string | null;
            status: import(".prisma/client").$Enums.TournamentStatus;
            createdAt: Date;
            owner: {
                id: string;
                name: string;
                email: string;
                avatarUrl: string | null;
            };
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
        }[];
        hasMore: boolean;
        nextCursor: string | null;
    }>;
    findAll(query: QueryTournamentsDto): Promise<({
        owner: {
            id: string;
            name: string;
            email: string;
            avatarUrl: string | null;
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
        _count: {
            categories: number;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        status: import(".prisma/client").$Enums.TournamentStatus;
        isPublished: boolean;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    })[]>;
    findOne(id: string): Promise<{
        owner: {
            id: string;
            name: string;
            email: string;
            avatarUrl: string | null;
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
                stageId: string;
                available: boolean;
            }[];
        } & {
            number: string | null;
            id: string;
            name: string | null;
            latitude: number | null;
            longitude: number | null;
            tournamentId: string;
            startTime: Date | null;
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
            name: string;
            description: string | null;
            tournamentId: string;
            logoUrl: string | null;
        }[];
        _count: {
            registrations: number;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        status: import(".prisma/client").$Enums.TournamentStatus;
        isPublished: boolean;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }>;
    getPublicDetails(id: string, userId: string): Promise<{
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
            name: string;
            email: string;
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
                stageId: string;
                available: boolean;
            }[];
        } & {
            number: string | null;
            id: string;
            name: string | null;
            latitude: number | null;
            longitude: number | null;
            tournamentId: string;
            startTime: Date | null;
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
                refereeCode: string | null;
                refereeCodeExpiresAt: Date | null;
                bestOfSets: number | null;
                tiebreakScore: number | null;
                position: number;
                round: number;
                bracketId: string | null;
                friendlyId: string | null;
                scheduledAt: Date | null;
                group: number | null;
                label: string | null;
                teamAId: string | null;
                teamBId: string | null;
                scoreTeamA: number;
                scoreTeamB: number;
                nextMatchId: string | null;
                winnerId: string | null;
                refereeId: string | null;
                startedAt: Date | null;
                finishedAt: Date | null;
            })[];
        } & {
            id: string;
            tournamentId: string;
            type: import(".prisma/client").$Enums.BracketType;
            categoryId: string;
        })[];
        id: string;
        name: string;
        description: string | null;
        imageUrl: string | null;
        eventType: import(".prisma/client").$Enums.TournamentEventType;
        status: import(".prisma/client").$Enums.TournamentStatus;
        isPublished: boolean;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }>;
    cancel(id: string, userId: string): Promise<void>;
}
