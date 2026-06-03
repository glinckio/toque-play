import { BracketsService } from './brackets.service';
import { GenerateBracketDto } from './dto/generate-bracket.dto';
export declare class BracketsController {
    private readonly bracketsService;
    constructor(bracketsService: BracketsService);
    generateBracket(tournamentId: string, userId: string, dto: GenerateBracketDto): Promise<({
        category: {
            id: string;
            type: import(".prisma/client").$Enums.TournamentType;
            format: import(".prisma/client").$Enums.TournamentFormat;
            modality: import(".prisma/client").$Enums.TournamentModality;
            bestOfSets: number;
        };
        matches: ({
            teamA: {
                name: string;
                id: string;
                avatarUrl: string | null;
            } | null;
            teamB: {
                name: string;
                id: string;
                avatarUrl: string | null;
            } | null;
            sets: {
                id: string;
                matchId: string;
                setNumber: number;
                scoreA: number;
                scoreB: number;
            }[];
            pointEvents: {
                id: string;
                matchId: string;
                setNumber: number;
                scoredBy: string;
                timestamp: Date;
            }[];
            winner: {
                name: string;
                id: string;
                avatarUrl: string | null;
            } | null;
        } & {
            id: string;
            position: number;
            round: number;
            bestOfSets: number | null;
            bracketId: string | null;
            friendlyId: string | null;
            status: import(".prisma/client").$Enums.MatchStatus;
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
            refereeCode: string | null;
            refereeCodeExpiresAt: Date | null;
        })[];
    } & {
        id: string;
        tournamentId: string;
        categoryId: string;
        type: import(".prisma/client").$Enums.BracketType;
    }) | null>;
    getBracket(tournamentId: string, categoryId?: string): Promise<{
        rounds: Record<number, any[]>;
        category: {
            id: string;
            type: import(".prisma/client").$Enums.TournamentType;
            format: import(".prisma/client").$Enums.TournamentFormat;
            modality: import(".prisma/client").$Enums.TournamentModality;
            bestOfSets: number;
        };
        matches: ({
            teamA: {
                name: string;
                id: string;
                avatarUrl: string | null;
            } | null;
            teamB: {
                name: string;
                id: string;
                avatarUrl: string | null;
            } | null;
            sets: {
                id: string;
                matchId: string;
                setNumber: number;
                scoreA: number;
                scoreB: number;
            }[];
            pointEvents: {
                id: string;
                matchId: string;
                setNumber: number;
                scoredBy: string;
                timestamp: Date;
            }[];
            winner: {
                name: string;
                id: string;
                avatarUrl: string | null;
            } | null;
        } & {
            id: string;
            position: number;
            round: number;
            bestOfSets: number | null;
            bracketId: string | null;
            friendlyId: string | null;
            status: import(".prisma/client").$Enums.MatchStatus;
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
            refereeCode: string | null;
            refereeCodeExpiresAt: Date | null;
        })[];
        id: string;
        tournamentId: string;
        categoryId: string;
        type: import(".prisma/client").$Enums.BracketType;
    }[]>;
}
