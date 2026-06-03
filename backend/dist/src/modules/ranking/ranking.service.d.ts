import { PrismaService } from '../../common/prisma.service';
type TiebreakerCriteria = 'WINS' | 'POINT_DIFF' | 'POINTS_SCORED' | 'HEAD_TO_HEAD';
export declare class RankingService {
    private prisma;
    constructor(prisma: PrismaService);
    getRanking(tournamentId: string): Promise<{
        tournamentId: string;
        criteria: TiebreakerCriteria[];
        ranking: {
            position: number;
            team: any;
            points: number;
            wins: number;
            pointDiff: number;
            pointsScored: number;
        }[];
    }>;
    private compareByCriteria;
    private ensureTeam;
    private addPoints;
    updateStatsAfterMatch(matchId: string): Promise<void>;
}
export {};
