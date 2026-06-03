import { TournamentStatus } from '@prisma/client';
export declare class QueryTournamentsDto {
    city?: string;
    state?: string;
    status?: TournamentStatus;
    categoryType?: string;
    categoryFormat?: string;
    categoryModality?: string;
}
