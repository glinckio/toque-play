import { MatchesService } from './matches.service';
import { PointDto } from './dto/point.dto';
import { SetFinishDto } from './dto/set-finish.dto';
import { WalkoverDto } from './dto/walkover.dto';
import { TimeoutDto } from './dto/timeout.dto';
import { SubstitutionDto } from './dto/substitution.dto';
import { NearbyQueryDto } from './dto/nearby-query.dto';
export declare class MatchesController {
    private readonly matchesService;
    constructor(matchesService: MatchesService);
    findNearby(query: NearbyQueryDto): Promise<{
        id: string;
        scoreTeamA: number;
        scoreTeamB: number;
        status: import(".prisma/client").$Enums.MatchStatus;
        startedAt: Date | null;
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
    enterRefereeCode(userId: string, body: {
        code: string;
    }): Promise<{
        refereeId: string;
        bracket: {
            tournament: {
                name: string;
                id: string;
                ownerId: string;
            };
            id: string;
            tournamentId: string;
        } | null;
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
        winner: {
            name: string;
            id: string;
            avatarUrl: string | null;
        } | null;
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
        startedAt: Date | null;
        finishedAt: Date | null;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
    }>;
    findOne(matchId: string, userId: string): Promise<{
        bracket: {
            tournamentId: string;
        } | null;
        friendly: {
            id: string;
            modality: string | null;
            categoryFormat: string | null;
        } | null;
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
        matchEvents: {
            team: string | null;
            id: string;
            type: import(".prisma/client").$Enums.MatchEventType;
            createdAt: Date;
            matchId: string;
            setNumber: number | null;
            scoreA: number | null;
            scoreB: number | null;
            teamId: string | null;
            playerOutId: string | null;
            playerInId: string | null;
            createdBy: string;
        }[];
        winner: {
            name: string;
            id: string;
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
    }>;
    getTimeline(matchId: string): Promise<any[]>;
    generateRefereeCode(matchId: string, userId: string): Promise<{
        code: string;
        matchId: string;
    }>;
    startMatch(matchId: string, userId: string): Promise<{
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
    }>;
    registerPoint(matchId: string, userId: string, dto: PointDto): Promise<({
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
        winner: {
            name: string;
            id: string;
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
    }) | {
        setFinished: boolean;
        currentSetNumber: number;
        teamA?: {
            name: string;
            id: string;
            avatarUrl: string | null;
        } | null | undefined;
        teamB?: {
            name: string;
            id: string;
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
        position?: number | undefined;
        round?: number | undefined;
        bestOfSets?: number | null | undefined;
        bracketId?: string | null | undefined;
        friendlyId?: string | null | undefined;
        status?: import(".prisma/client").$Enums.MatchStatus | undefined;
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
        refereeCode?: string | null | undefined;
        refereeCodeExpiresAt?: Date | null | undefined;
    } | null>;
    removePoint(matchId: string, userId: string, dto: PointDto): Promise<{
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
    } | null>;
    finishSet(matchId: string, userId: string, dto: SetFinishDto): Promise<({
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
    }) | null>;
    finishMatch(matchId: string, userId: string): Promise<{
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
        winner: {
            name: string;
            id: string;
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
    }>;
    declareWalkover(matchId: string, userId: string, dto: WalkoverDto): Promise<{
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
        winner: {
            name: string;
            id: string;
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
    }>;
    registerTimeout(matchId: string, userId: string, dto: TimeoutDto): Promise<{
        team: string | null;
        id: string;
        type: import(".prisma/client").$Enums.MatchEventType;
        createdAt: Date;
        matchId: string;
        setNumber: number | null;
        scoreA: number | null;
        scoreB: number | null;
        teamId: string | null;
        playerOutId: string | null;
        playerInId: string | null;
        createdBy: string;
    }>;
    registerSubstitution(matchId: string, userId: string, dto: SubstitutionDto): Promise<{
        team: string | null;
        id: string;
        type: import(".prisma/client").$Enums.MatchEventType;
        createdAt: Date;
        matchId: string;
        setNumber: number | null;
        scoreA: number | null;
        scoreB: number | null;
        teamId: string | null;
        playerOutId: string | null;
        playerInId: string | null;
        createdBy: string;
    }>;
}
