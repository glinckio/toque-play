import { PrismaService } from '../../common/prisma.service';
import { NotificationService } from '../../common/services/notification.service';
import { CreateFriendlyDto } from './dto/create-friendly.dto';
import { QueryFriendlyDto, NearbyQueryDto } from './dto/query-friendly.dto';
export declare class FriendliesService {
    private prisma;
    private notificationService;
    private chatService;
    constructor(prisma: PrismaService, notificationService: NotificationService);
    setChatService(chatService: any): void;
    create(userId: string, dto: CreateFriendlyDto): Promise<({
        match: ({
            teamA: {
                id: string;
                name: string;
            } | null;
            teamB: {
                id: string;
                name: string;
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
            winner: {
                id: string;
                name: string;
            } | null;
        } & {
            id: string;
            status: import(".prisma/client").$Enums.MatchStatus;
            scheduledAt: Date | null;
            refereeCode: string | null;
            refereeCodeExpiresAt: Date | null;
            position: number;
            bestOfSets: number | null;
            tiebreakScore: number | null;
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
        }) | null;
        requester: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
        requesterTeam: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
        challenged: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
        challengedTeam: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
        athletes: ({
            teamMember: {
                user: {
                    id: string;
                    name: string;
                    avatarUrl: string | null;
                } | null;
            } & {
                id: string;
                userId: string | null;
                teamId: string;
                guestName: string | null;
                cpf: string | null;
                isGuest: boolean;
                isCaptain: boolean;
                position: string | null;
            };
        } & {
            id: string;
            isCaptain: boolean;
            teamMemberId: string;
            friendlyId: string;
            side: string;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.FriendlyStatus;
        latitude: number | null;
        longitude: number | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string | null;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
        date: Date;
        startTime: Date | null;
        address: string | null;
        city: string | null;
        state: string | null;
        regionRadius: number | null;
        modality: string | null;
        categoryFormat: string | null;
        scoreTeamA: number | null;
        scoreTeamB: number | null;
        matchId: string | null;
        requesterId: string;
        requesterTeamId: string | null;
        challengedId: string | null;
        challengedTeamId: string | null;
        addressNumber: string | null;
    }) | null>;
    accept(friendlyId: string, userId: string, dto: {
        athleteIds: string[];
        captainId?: string;
    }): Promise<({
        match: ({
            teamA: {
                id: string;
                name: string;
            } | null;
            teamB: {
                id: string;
                name: string;
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
            winner: {
                id: string;
                name: string;
            } | null;
        } & {
            id: string;
            status: import(".prisma/client").$Enums.MatchStatus;
            scheduledAt: Date | null;
            refereeCode: string | null;
            refereeCodeExpiresAt: Date | null;
            position: number;
            bestOfSets: number | null;
            tiebreakScore: number | null;
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
        }) | null;
        requester: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
        requesterTeam: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
        challenged: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
        challengedTeam: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
        athletes: ({
            teamMember: {
                user: {
                    id: string;
                    name: string;
                    avatarUrl: string | null;
                } | null;
            } & {
                id: string;
                userId: string | null;
                teamId: string;
                guestName: string | null;
                cpf: string | null;
                isGuest: boolean;
                isCaptain: boolean;
                position: string | null;
            };
        } & {
            id: string;
            isCaptain: boolean;
            teamMemberId: string;
            friendlyId: string;
            side: string;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.FriendlyStatus;
        latitude: number | null;
        longitude: number | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string | null;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
        date: Date;
        startTime: Date | null;
        address: string | null;
        city: string | null;
        state: string | null;
        regionRadius: number | null;
        modality: string | null;
        categoryFormat: string | null;
        scoreTeamA: number | null;
        scoreTeamB: number | null;
        matchId: string | null;
        requesterId: string;
        requesterTeamId: string | null;
        challengedId: string | null;
        challengedTeamId: string | null;
        addressNumber: string | null;
    }) | null>;
    reject(friendlyId: string, userId: string): Promise<{
        match: ({
            teamA: {
                id: string;
                name: string;
            } | null;
            teamB: {
                id: string;
                name: string;
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
            winner: {
                id: string;
                name: string;
            } | null;
        } & {
            id: string;
            status: import(".prisma/client").$Enums.MatchStatus;
            scheduledAt: Date | null;
            refereeCode: string | null;
            refereeCodeExpiresAt: Date | null;
            position: number;
            bestOfSets: number | null;
            tiebreakScore: number | null;
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
        }) | null;
        requester: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
        requesterTeam: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
        challenged: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
        challengedTeam: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
        athletes: ({
            teamMember: {
                user: {
                    id: string;
                    name: string;
                    avatarUrl: string | null;
                } | null;
            } & {
                id: string;
                userId: string | null;
                teamId: string;
                guestName: string | null;
                cpf: string | null;
                isGuest: boolean;
                isCaptain: boolean;
                position: string | null;
            };
        } & {
            id: string;
            isCaptain: boolean;
            teamMemberId: string;
            friendlyId: string;
            side: string;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.FriendlyStatus;
        latitude: number | null;
        longitude: number | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string | null;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
        date: Date;
        startTime: Date | null;
        address: string | null;
        city: string | null;
        state: string | null;
        regionRadius: number | null;
        modality: string | null;
        categoryFormat: string | null;
        scoreTeamA: number | null;
        scoreTeamB: number | null;
        matchId: string | null;
        requesterId: string;
        requesterTeamId: string | null;
        challengedId: string | null;
        challengedTeamId: string | null;
        addressNumber: string | null;
    }>;
    cancel(friendlyId: string, userId: string): Promise<{
        match: ({
            teamA: {
                id: string;
                name: string;
            } | null;
            teamB: {
                id: string;
                name: string;
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
            winner: {
                id: string;
                name: string;
            } | null;
        } & {
            id: string;
            status: import(".prisma/client").$Enums.MatchStatus;
            scheduledAt: Date | null;
            refereeCode: string | null;
            refereeCodeExpiresAt: Date | null;
            position: number;
            bestOfSets: number | null;
            tiebreakScore: number | null;
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
        }) | null;
        requester: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
        requesterTeam: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
        challenged: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
        challengedTeam: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
        athletes: ({
            teamMember: {
                user: {
                    id: string;
                    name: string;
                    avatarUrl: string | null;
                } | null;
            } & {
                id: string;
                userId: string | null;
                teamId: string;
                guestName: string | null;
                cpf: string | null;
                isGuest: boolean;
                isCaptain: boolean;
                position: string | null;
            };
        } & {
            id: string;
            isCaptain: boolean;
            teamMemberId: string;
            friendlyId: string;
            side: string;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.FriendlyStatus;
        latitude: number | null;
        longitude: number | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string | null;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
        date: Date;
        startTime: Date | null;
        address: string | null;
        city: string | null;
        state: string | null;
        regionRadius: number | null;
        modality: string | null;
        categoryFormat: string | null;
        scoreTeamA: number | null;
        scoreTeamB: number | null;
        matchId: string | null;
        requesterId: string;
        requesterTeamId: string | null;
        challengedId: string | null;
        challengedTeamId: string | null;
        addressNumber: string | null;
    }>;
    selectAthletes(friendlyId: string, userId: string, athleteIds: string[]): Promise<({
        match: ({
            teamA: {
                id: string;
                name: string;
            } | null;
            teamB: {
                id: string;
                name: string;
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
            winner: {
                id: string;
                name: string;
            } | null;
        } & {
            id: string;
            status: import(".prisma/client").$Enums.MatchStatus;
            scheduledAt: Date | null;
            refereeCode: string | null;
            refereeCodeExpiresAt: Date | null;
            position: number;
            bestOfSets: number | null;
            tiebreakScore: number | null;
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
        }) | null;
        requester: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
        requesterTeam: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
        challenged: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
        challengedTeam: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
        athletes: ({
            teamMember: {
                user: {
                    id: string;
                    name: string;
                    avatarUrl: string | null;
                } | null;
            } & {
                id: string;
                userId: string | null;
                teamId: string;
                guestName: string | null;
                cpf: string | null;
                isGuest: boolean;
                isCaptain: boolean;
                position: string | null;
            };
        } & {
            id: string;
            isCaptain: boolean;
            teamMemberId: string;
            friendlyId: string;
            side: string;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.FriendlyStatus;
        latitude: number | null;
        longitude: number | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string | null;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
        date: Date;
        startTime: Date | null;
        address: string | null;
        city: string | null;
        state: string | null;
        regionRadius: number | null;
        modality: string | null;
        categoryFormat: string | null;
        scoreTeamA: number | null;
        scoreTeamB: number | null;
        matchId: string | null;
        requesterId: string;
        requesterTeamId: string | null;
        challengedId: string | null;
        challengedTeamId: string | null;
        addressNumber: string | null;
    }) | null>;
    generateRefereeCode(friendlyId: string, userId: string): Promise<{
        code: string;
    }>;
    enterRefereeCode(userId: string, code: string): Promise<{
        friendly: ({
            match: ({
                teamA: {
                    id: string;
                    name: string;
                } | null;
                teamB: {
                    id: string;
                    name: string;
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
                winner: {
                    id: string;
                    name: string;
                } | null;
            } & {
                id: string;
                status: import(".prisma/client").$Enums.MatchStatus;
                scheduledAt: Date | null;
                refereeCode: string | null;
                refereeCodeExpiresAt: Date | null;
                position: number;
                bestOfSets: number | null;
                tiebreakScore: number | null;
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
            }) | null;
            requester: {
                id: string;
                name: string;
                avatarUrl: string | null;
            };
            requesterTeam: {
                id: string;
                name: string;
                avatarUrl: string | null;
            } | null;
            challenged: {
                id: string;
                name: string;
                avatarUrl: string | null;
            } | null;
            challengedTeam: {
                id: string;
                name: string;
                avatarUrl: string | null;
            } | null;
            athletes: ({
                teamMember: {
                    user: {
                        id: string;
                        name: string;
                        avatarUrl: string | null;
                    } | null;
                } & {
                    id: string;
                    userId: string | null;
                    teamId: string;
                    guestName: string | null;
                    cpf: string | null;
                    isGuest: boolean;
                    isCaptain: boolean;
                    position: string | null;
                };
            } & {
                id: string;
                isCaptain: boolean;
                teamMemberId: string;
                friendlyId: string;
                side: string;
            })[];
        } & {
            id: string;
            status: import(".prisma/client").$Enums.FriendlyStatus;
            latitude: number | null;
            longitude: number | null;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            title: string | null;
            refereeCode: string | null;
            refereeCodeExpiresAt: Date | null;
            date: Date;
            startTime: Date | null;
            address: string | null;
            city: string | null;
            state: string | null;
            regionRadius: number | null;
            modality: string | null;
            categoryFormat: string | null;
            scoreTeamA: number | null;
            scoreTeamB: number | null;
            matchId: string | null;
            requesterId: string;
            requesterTeamId: string | null;
            challengedId: string | null;
            challengedTeamId: string | null;
            addressNumber: string | null;
        }) | null;
        match: ({
            teamA: {
                id: string;
                name: string;
            } | null;
            teamB: {
                id: string;
                name: string;
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
            scheduledAt: Date | null;
            refereeCode: string | null;
            refereeCodeExpiresAt: Date | null;
            position: number;
            bestOfSets: number | null;
            tiebreakScore: number | null;
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
        }) | null;
    }>;
    findMine(userId: string, query: QueryFriendlyDto): Promise<({
        match: ({
            teamA: {
                id: string;
                name: string;
            } | null;
            teamB: {
                id: string;
                name: string;
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
            winner: {
                id: string;
                name: string;
            } | null;
        } & {
            id: string;
            status: import(".prisma/client").$Enums.MatchStatus;
            scheduledAt: Date | null;
            refereeCode: string | null;
            refereeCodeExpiresAt: Date | null;
            position: number;
            bestOfSets: number | null;
            tiebreakScore: number | null;
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
        }) | null;
        requester: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
        requesterTeam: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
        challenged: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
        challengedTeam: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
        athletes: ({
            teamMember: {
                user: {
                    id: string;
                    name: string;
                    avatarUrl: string | null;
                } | null;
            } & {
                id: string;
                userId: string | null;
                teamId: string;
                guestName: string | null;
                cpf: string | null;
                isGuest: boolean;
                isCaptain: boolean;
                position: string | null;
            };
        } & {
            id: string;
            isCaptain: boolean;
            teamMemberId: string;
            friendlyId: string;
            side: string;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.FriendlyStatus;
        latitude: number | null;
        longitude: number | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string | null;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
        date: Date;
        startTime: Date | null;
        address: string | null;
        city: string | null;
        state: string | null;
        regionRadius: number | null;
        modality: string | null;
        categoryFormat: string | null;
        scoreTeamA: number | null;
        scoreTeamB: number | null;
        matchId: string | null;
        requesterId: string;
        requesterTeamId: string | null;
        challengedId: string | null;
        challengedTeamId: string | null;
        addressNumber: string | null;
    })[]>;
    findNearby(query: NearbyQueryDto): Promise<({
        match: ({
            teamA: {
                id: string;
                name: string;
            } | null;
            teamB: {
                id: string;
                name: string;
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
            winner: {
                id: string;
                name: string;
            } | null;
        } & {
            id: string;
            status: import(".prisma/client").$Enums.MatchStatus;
            scheduledAt: Date | null;
            refereeCode: string | null;
            refereeCodeExpiresAt: Date | null;
            position: number;
            bestOfSets: number | null;
            tiebreakScore: number | null;
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
        }) | null;
        requester: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
        requesterTeam: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
        challenged: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
        challengedTeam: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
        athletes: ({
            teamMember: {
                user: {
                    id: string;
                    name: string;
                    avatarUrl: string | null;
                } | null;
            } & {
                id: string;
                userId: string | null;
                teamId: string;
                guestName: string | null;
                cpf: string | null;
                isGuest: boolean;
                isCaptain: boolean;
                position: string | null;
            };
        } & {
            id: string;
            isCaptain: boolean;
            teamMemberId: string;
            friendlyId: string;
            side: string;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.FriendlyStatus;
        latitude: number | null;
        longitude: number | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string | null;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
        date: Date;
        startTime: Date | null;
        address: string | null;
        city: string | null;
        state: string | null;
        regionRadius: number | null;
        modality: string | null;
        categoryFormat: string | null;
        scoreTeamA: number | null;
        scoreTeamB: number | null;
        matchId: string | null;
        requesterId: string;
        requesterTeamId: string | null;
        challengedId: string | null;
        challengedTeamId: string | null;
        addressNumber: string | null;
    })[]>;
    findOne(friendlyId: string, userId: string): Promise<{
        match: ({
            teamA: {
                id: string;
                name: string;
            } | null;
            teamB: {
                id: string;
                name: string;
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
            winner: {
                id: string;
                name: string;
            } | null;
        } & {
            id: string;
            status: import(".prisma/client").$Enums.MatchStatus;
            scheduledAt: Date | null;
            refereeCode: string | null;
            refereeCodeExpiresAt: Date | null;
            position: number;
            bestOfSets: number | null;
            tiebreakScore: number | null;
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
        }) | null;
        requester: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
        requesterTeam: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
        challenged: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
        challengedTeam: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
        athletes: ({
            teamMember: {
                user: {
                    id: string;
                    name: string;
                    avatarUrl: string | null;
                } | null;
            } & {
                id: string;
                userId: string | null;
                teamId: string;
                guestName: string | null;
                cpf: string | null;
                isGuest: boolean;
                isCaptain: boolean;
                position: string | null;
            };
        } & {
            id: string;
            isCaptain: boolean;
            teamMemberId: string;
            friendlyId: string;
            side: string;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.FriendlyStatus;
        latitude: number | null;
        longitude: number | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string | null;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
        date: Date;
        startTime: Date | null;
        address: string | null;
        city: string | null;
        state: string | null;
        regionRadius: number | null;
        modality: string | null;
        categoryFormat: string | null;
        scoreTeamA: number | null;
        scoreTeamB: number | null;
        matchId: string | null;
        requesterId: string;
        requesterTeamId: string | null;
        challengedId: string | null;
        challengedTeamId: string | null;
        addressNumber: string | null;
    }>;
    explore(query: NearbyQueryDto & {
        dateFrom?: string;
        dateTo?: string;
        city?: string;
    }): Promise<({
        match: ({
            teamA: {
                id: string;
                name: string;
            } | null;
            teamB: {
                id: string;
                name: string;
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
            winner: {
                id: string;
                name: string;
            } | null;
        } & {
            id: string;
            status: import(".prisma/client").$Enums.MatchStatus;
            scheduledAt: Date | null;
            refereeCode: string | null;
            refereeCodeExpiresAt: Date | null;
            position: number;
            bestOfSets: number | null;
            tiebreakScore: number | null;
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
        }) | null;
        requester: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
        requesterTeam: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
        challenged: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
        challengedTeam: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
        athletes: ({
            teamMember: {
                user: {
                    id: string;
                    name: string;
                    avatarUrl: string | null;
                } | null;
            } & {
                id: string;
                userId: string | null;
                teamId: string;
                guestName: string | null;
                cpf: string | null;
                isGuest: boolean;
                isCaptain: boolean;
                position: string | null;
            };
        } & {
            id: string;
            isCaptain: boolean;
            teamMemberId: string;
            friendlyId: string;
            side: string;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.FriendlyStatus;
        latitude: number | null;
        longitude: number | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string | null;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
        date: Date;
        startTime: Date | null;
        address: string | null;
        city: string | null;
        state: string | null;
        regionRadius: number | null;
        modality: string | null;
        categoryFormat: string | null;
        scoreTeamA: number | null;
        scoreTeamB: number | null;
        matchId: string | null;
        requesterId: string;
        requesterTeamId: string | null;
        challengedId: string | null;
        challengedTeamId: string | null;
        addressNumber: string | null;
    })[]>;
    private findFriendlyOrThrow;
    private isTeamOwner;
}
