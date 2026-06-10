import { TournamentType, TournamentFormat, TournamentModality, TournamentEventType, BracketType } from '@prisma/client';
export declare class FacilityDto {
    name: string;
    available?: boolean;
}
export declare class StageDto {
    name?: string;
    date: string;
    startTime?: string;
    maxTeams?: number;
    address?: string;
    street?: string;
    number?: string;
    neighborhood?: string;
    cep?: string;
    city?: string;
    state?: string;
    latitude?: number;
    longitude?: number;
    regionRadius?: number;
    facilities?: FacilityDto[];
}
export declare class CategoryDto {
    type: TournamentType;
    format: TournamentFormat;
    modality: TournamentModality;
    minMembers?: number;
    maxMembers?: number;
    bestOfSets?: number;
    semifinalBestOfSets?: number;
    finalBestOfSets?: number;
    tiebreakScore?: number;
    startTime?: string;
    registrationPrice?: number;
    registrationDeadline?: string;
    registrationRules?: string;
    tiebreakerCriteria?: string[];
    bracketType?: BracketType;
    groupsCount?: number;
    teamsPerGroup?: number;
    teamsAdvancing?: number;
}
export declare class UpdateStructureDto {
    eventType: TournamentEventType;
    stages?: StageDto[];
    categories?: CategoryDto[];
}
