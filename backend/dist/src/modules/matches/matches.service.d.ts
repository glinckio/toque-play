import { PrismaService } from '../../common/prisma.service';
import { MatchesGateway } from './matches.gateway';
import { RankingService } from '../ranking/ranking.service';
import { BracketsService } from '../brackets/brackets.service';
import { PointDto } from './dto/point.dto';
import { SetFinishDto } from './dto/set-finish.dto';
import { WalkoverDto } from './dto/walkover.dto';
import { TimeoutDto } from './dto/timeout.dto';
import { SubstitutionDto } from './dto/substitution.dto';
import { NearbyQueryDto } from './dto/nearby-query.dto';
export declare class MatchesService {
    private prisma;
    private matchesGateway;
    private rankingService;
    private bracketsService;
    constructor(prisma: PrismaService, matchesGateway: MatchesGateway, rankingService: RankingService, bracketsService: BracketsService);
    private emitMatchEvent;
    startMatch(matchId: string, userId: string): Promise<{
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
    }>;
    registerPoint(matchId: string, userId: string, dto: PointDto): Promise<({
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
        sets: {
            id: string;
            matchId: string;
            setNumber: number;
            scoreA: number;
            scoreB: number;
        }[];
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
    }) | {
        setFinished: boolean;
        currentSetNumber: number;
        teamA?: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null | undefined;
        teamB?: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null | undefined;
        sets?: {
            id: string;
            matchId: string;
            setNumber: number;
            scoreA: number;
            scoreB: number;
        }[] | undefined;
        id?: string | undefined;
        status?: import(".prisma/client").$Enums.MatchStatus | undefined;
        refereeCode?: string | null | undefined;
        refereeCodeExpiresAt?: Date | null | undefined;
        bestOfSets?: number | null | undefined;
        tiebreakScore?: number | null | undefined;
        position?: number | undefined;
        round?: number | undefined;
        bracketId?: string | null | undefined;
        friendlyId?: string | null | undefined;
        scheduledAt?: Date | null | undefined;
        group?: number | null | undefined;
        label?: string | null | undefined;
        teamAId?: string | null | undefined;
        teamBId?: string | null | undefined;
        scoreTeamA?: number | undefined;
        scoreTeamB?: number | undefined;
        nextMatchId?: string | null | undefined;
        winnerId?: string | null | undefined;
        refereeId?: string | null | undefined;
        startedAt?: Date | null | undefined;
        finishedAt?: Date | null | undefined;
    } | null>;
    removePoint(matchId: string, userId: string, dto: PointDto): Promise<{
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
    } | null>;
    finishSet(matchId: string, userId: string, dto: SetFinishDto): Promise<({
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
        sets: {
            id: string;
            matchId: string;
            setNumber: number;
            scoreA: number;
            scoreB: number;
        }[];
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
    }) | null>;
    finishMatch(matchId: string, userId: string): Promise<{
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
    }>;
    declareWalkover(matchId: string, userId: string, dto: WalkoverDto): Promise<{
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
    }>;
    registerTimeout(matchId: string, userId: string, dto: TimeoutDto): Promise<{
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.MatchEventType;
        team: string | null;
        teamId: string | null;
        matchId: string;
        setNumber: number | null;
        scoreA: number | null;
        scoreB: number | null;
        playerOutId: string | null;
        playerInId: string | null;
        createdBy: string;
    }>;
    registerSubstitution(matchId: string, userId: string, dto: SubstitutionDto): Promise<{
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.MatchEventType;
        team: string | null;
        teamId: string | null;
        matchId: string;
        setNumber: number | null;
        scoreA: number | null;
        scoreB: number | null;
        playerOutId: string | null;
        playerInId: string | null;
        createdBy: string;
    }>;
    findOne(matchId: string, _userId: string): Promise<{
        bracket: {
            tournamentId: string;
        } | null;
        friendly: {
            id: string;
            modality: string | null;
            categoryFormat: string | null;
        } | null;
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
            timestamp: Date;
            scoredBy: string;
        }[];
        matchEvents: {
            id: string;
            createdAt: Date;
            type: import(".prisma/client").$Enums.MatchEventType;
            team: string | null;
            teamId: string | null;
            matchId: string;
            setNumber: number | null;
            scoreA: number | null;
            scoreB: number | null;
            playerOutId: string | null;
            playerInId: string | null;
            createdBy: string;
        }[];
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
    }>;
    generateRefereeCode(matchId: string, userId: string): Promise<{
        code: string;
        matchId: string;
    }>;
    enterRefereeCode(userId: string, code: string): Promise<{
        refereeId: string;
        bracket: {
            id: string;
            tournament: {
                id: string;
                name: string;
                ownerId: string;
            };
            tournamentId: string;
        } | null;
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
        sets: {
            id: string;
            matchId: string;
            setNumber: number;
            scoreA: number;
            scoreB: number;
        }[];
        winner: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
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
        startedAt: Date | null;
        finishedAt: Date | null;
    }>;
    getTimeline(matchId: string): Promise<any[]>;
    findNearby(query: NearbyQueryDto): Promise<{
        id: string;
        scoreTeamA: number;
        scoreTeamB: number;
        status: import(".prisma/client").$Enums.MatchStatus;
        startedAt: Date | null;
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
        sets: {
            id: string;
            matchId: string;
            setNumber: number;
            scoreA: number;
            scoreB: number;
        }[];
        tournamentId: string;
        tournament: {
            id: string;
            name: string;
        };
        nearestStage: {
            city: string | null;
            address: string | null;
        } | null;
        distanceKm: number;
    }[]>;
    private haversineKm;
    private getMatchModality;
    private findMatchWithReferee;
    private findMatchWithOwnership;
    private isTeamOwner;
    private advanceWinner;
    private getWinningThreshold;
    private isWinningScore;
    private getSetsNeededToWin;
    private countSetsWon;
}
