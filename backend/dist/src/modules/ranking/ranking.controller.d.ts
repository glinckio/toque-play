import { RankingService } from './ranking.service';
export declare class RankingController {
    private readonly rankingService;
    constructor(rankingService: RankingService);
    getRanking(tournamentId: string): Promise<{
        tournamentId: string;
        criteria: ("WINS" | "POINT_DIFF" | "POINTS_SCORED" | "HEAD_TO_HEAD")[];
        ranking: {
            position: number;
            team: any;
            points: number;
            wins: number;
            pointDiff: number;
            pointsScored: number;
        }[];
    }>;
}
