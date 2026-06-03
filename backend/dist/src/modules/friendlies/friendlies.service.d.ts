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
                scoredBy: string;
                timestamp: Date;
            }[];
            winner: {
                id: string;
                name: string;
            } | null;
        } & {
            id: string;
            status: import(".prisma/client").$Enums.MatchStatus;
            teamAId: string | null;
            teamBId: string | null;
            scoreTeamA: number;
            scoreTeamB: number;
            refereeCode: string | null;
            refereeCodeExpiresAt: Date | null;
            bracketId: string | null;
            friendlyId: string | null;
            round: number;
            position: number;
            scheduledAt: Date | null;
            group: number | null;
            bestOfSets: number | null;
            label: string | null;
            nextMatchId: string | null;
            winnerId: string | null;
            refereeId: string | null;
            startedAt: Date | null;
            finishedAt: Date | null;
        }) | null;
        athletes: ({
            teamMember: {
                user: {
                    id: string;
                    name: string;
                    avatarUrl: string | null;
                } | null;
            } & {
                id: string;
                guestName: string | null;
                cpf: string | null;
                isGuest: boolean;
                isCaptain: boolean;
                userId: string | null;
                teamId: string;
            };
        } & {
            id: string;
            isCaptain: boolean;
            friendlyId: string;
            side: string;
            teamMemberId: string;
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
        requesterId: string;
        requesterTeamId: string | null;
        challengedId: string | null;
        challengedTeamId: string | null;
        date: Date;
        startTime: Date | null;
        address: string | null;
        addressNumber: string | null;
        city: string | null;
        state: string | null;
        regionRadius: number | null;
        scoreTeamA: number | null;
        scoreTeamB: number | null;
        modality: string | null;
        categoryFormat: string | null;
        matchId: string | null;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
    }) | null>;
    accept(friendlyId: string, userId: string, dto: {
        athleteIds: string[];
        captainId?: string;
    }): Promise<({
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
                scoredBy: string;
                timestamp: Date;
            }[];
            winner: {
                id: string;
                name: string;
            } | null;
        } & {
            id: string;
            status: import(".prisma/client").$Enums.MatchStatus;
            teamAId: string | null;
            teamBId: string | null;
            scoreTeamA: number;
            scoreTeamB: number;
            refereeCode: string | null;
            refereeCodeExpiresAt: Date | null;
            bracketId: string | null;
            friendlyId: string | null;
            round: number;
            position: number;
            scheduledAt: Date | null;
            group: number | null;
            bestOfSets: number | null;
            label: string | null;
            nextMatchId: string | null;
            winnerId: string | null;
            refereeId: string | null;
            startedAt: Date | null;
            finishedAt: Date | null;
        }) | null;
        athletes: ({
            teamMember: {
                user: {
                    id: string;
                    name: string;
                    avatarUrl: string | null;
                } | null;
            } & {
                id: string;
                guestName: string | null;
                cpf: string | null;
                isGuest: boolean;
                isCaptain: boolean;
                userId: string | null;
                teamId: string;
            };
        } & {
            id: string;
            isCaptain: boolean;
            friendlyId: string;
            side: string;
            teamMemberId: string;
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
        requesterId: string;
        requesterTeamId: string | null;
        challengedId: string | null;
        challengedTeamId: string | null;
        date: Date;
        startTime: Date | null;
        address: string | null;
        addressNumber: string | null;
        city: string | null;
        state: string | null;
        regionRadius: number | null;
        scoreTeamA: number | null;
        scoreTeamB: number | null;
        modality: string | null;
        categoryFormat: string | null;
        matchId: string | null;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
    }) | null>;
    reject(friendlyId: string, userId: string): Promise<{
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
                scoredBy: string;
                timestamp: Date;
            }[];
            winner: {
                id: string;
                name: string;
            } | null;
        } & {
            id: string;
            status: import(".prisma/client").$Enums.MatchStatus;
            teamAId: string | null;
            teamBId: string | null;
            scoreTeamA: number;
            scoreTeamB: number;
            refereeCode: string | null;
            refereeCodeExpiresAt: Date | null;
            bracketId: string | null;
            friendlyId: string | null;
            round: number;
            position: number;
            scheduledAt: Date | null;
            group: number | null;
            bestOfSets: number | null;
            label: string | null;
            nextMatchId: string | null;
            winnerId: string | null;
            refereeId: string | null;
            startedAt: Date | null;
            finishedAt: Date | null;
        }) | null;
        athletes: ({
            teamMember: {
                user: {
                    id: string;
                    name: string;
                    avatarUrl: string | null;
                } | null;
            } & {
                id: string;
                guestName: string | null;
                cpf: string | null;
                isGuest: boolean;
                isCaptain: boolean;
                userId: string | null;
                teamId: string;
            };
        } & {
            id: string;
            isCaptain: boolean;
            friendlyId: string;
            side: string;
            teamMemberId: string;
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
        requesterId: string;
        requesterTeamId: string | null;
        challengedId: string | null;
        challengedTeamId: string | null;
        date: Date;
        startTime: Date | null;
        address: string | null;
        addressNumber: string | null;
        city: string | null;
        state: string | null;
        regionRadius: number | null;
        scoreTeamA: number | null;
        scoreTeamB: number | null;
        modality: string | null;
        categoryFormat: string | null;
        matchId: string | null;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
    }>;
    cancel(friendlyId: string, userId: string): Promise<{
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
                scoredBy: string;
                timestamp: Date;
            }[];
            winner: {
                id: string;
                name: string;
            } | null;
        } & {
            id: string;
            status: import(".prisma/client").$Enums.MatchStatus;
            teamAId: string | null;
            teamBId: string | null;
            scoreTeamA: number;
            scoreTeamB: number;
            refereeCode: string | null;
            refereeCodeExpiresAt: Date | null;
            bracketId: string | null;
            friendlyId: string | null;
            round: number;
            position: number;
            scheduledAt: Date | null;
            group: number | null;
            bestOfSets: number | null;
            label: string | null;
            nextMatchId: string | null;
            winnerId: string | null;
            refereeId: string | null;
            startedAt: Date | null;
            finishedAt: Date | null;
        }) | null;
        athletes: ({
            teamMember: {
                user: {
                    id: string;
                    name: string;
                    avatarUrl: string | null;
                } | null;
            } & {
                id: string;
                guestName: string | null;
                cpf: string | null;
                isGuest: boolean;
                isCaptain: boolean;
                userId: string | null;
                teamId: string;
            };
        } & {
            id: string;
            isCaptain: boolean;
            friendlyId: string;
            side: string;
            teamMemberId: string;
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
        requesterId: string;
        requesterTeamId: string | null;
        challengedId: string | null;
        challengedTeamId: string | null;
        date: Date;
        startTime: Date | null;
        address: string | null;
        addressNumber: string | null;
        city: string | null;
        state: string | null;
        regionRadius: number | null;
        scoreTeamA: number | null;
        scoreTeamB: number | null;
        modality: string | null;
        categoryFormat: string | null;
        matchId: string | null;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
    }>;
    selectAthletes(friendlyId: string, userId: string, athleteIds: string[]): Promise<({
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
                scoredBy: string;
                timestamp: Date;
            }[];
            winner: {
                id: string;
                name: string;
            } | null;
        } & {
            id: string;
            status: import(".prisma/client").$Enums.MatchStatus;
            teamAId: string | null;
            teamBId: string | null;
            scoreTeamA: number;
            scoreTeamB: number;
            refereeCode: string | null;
            refereeCodeExpiresAt: Date | null;
            bracketId: string | null;
            friendlyId: string | null;
            round: number;
            position: number;
            scheduledAt: Date | null;
            group: number | null;
            bestOfSets: number | null;
            label: string | null;
            nextMatchId: string | null;
            winnerId: string | null;
            refereeId: string | null;
            startedAt: Date | null;
            finishedAt: Date | null;
        }) | null;
        athletes: ({
            teamMember: {
                user: {
                    id: string;
                    name: string;
                    avatarUrl: string | null;
                } | null;
            } & {
                id: string;
                guestName: string | null;
                cpf: string | null;
                isGuest: boolean;
                isCaptain: boolean;
                userId: string | null;
                teamId: string;
            };
        } & {
            id: string;
            isCaptain: boolean;
            friendlyId: string;
            side: string;
            teamMemberId: string;
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
        requesterId: string;
        requesterTeamId: string | null;
        challengedId: string | null;
        challengedTeamId: string | null;
        date: Date;
        startTime: Date | null;
        address: string | null;
        addressNumber: string | null;
        city: string | null;
        state: string | null;
        regionRadius: number | null;
        scoreTeamA: number | null;
        scoreTeamB: number | null;
        modality: string | null;
        categoryFormat: string | null;
        matchId: string | null;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
    }) | null>;
    generateRefereeCode(friendlyId: string, userId: string): Promise<{
        code: string;
    }>;
    enterRefereeCode(userId: string, code: string): Promise<{
        friendly: ({
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
                    scoredBy: string;
                    timestamp: Date;
                }[];
                winner: {
                    id: string;
                    name: string;
                } | null;
            } & {
                id: string;
                status: import(".prisma/client").$Enums.MatchStatus;
                teamAId: string | null;
                teamBId: string | null;
                scoreTeamA: number;
                scoreTeamB: number;
                refereeCode: string | null;
                refereeCodeExpiresAt: Date | null;
                bracketId: string | null;
                friendlyId: string | null;
                round: number;
                position: number;
                scheduledAt: Date | null;
                group: number | null;
                bestOfSets: number | null;
                label: string | null;
                nextMatchId: string | null;
                winnerId: string | null;
                refereeId: string | null;
                startedAt: Date | null;
                finishedAt: Date | null;
            }) | null;
            athletes: ({
                teamMember: {
                    user: {
                        id: string;
                        name: string;
                        avatarUrl: string | null;
                    } | null;
                } & {
                    id: string;
                    guestName: string | null;
                    cpf: string | null;
                    isGuest: boolean;
                    isCaptain: boolean;
                    userId: string | null;
                    teamId: string;
                };
            } & {
                id: string;
                isCaptain: boolean;
                friendlyId: string;
                side: string;
                teamMemberId: string;
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
            requesterId: string;
            requesterTeamId: string | null;
            challengedId: string | null;
            challengedTeamId: string | null;
            date: Date;
            startTime: Date | null;
            address: string | null;
            addressNumber: string | null;
            city: string | null;
            state: string | null;
            regionRadius: number | null;
            scoreTeamA: number | null;
            scoreTeamB: number | null;
            modality: string | null;
            categoryFormat: string | null;
            matchId: string | null;
            refereeCode: string | null;
            refereeCodeExpiresAt: Date | null;
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
            teamAId: string | null;
            teamBId: string | null;
            scoreTeamA: number;
            scoreTeamB: number;
            refereeCode: string | null;
            refereeCodeExpiresAt: Date | null;
            bracketId: string | null;
            friendlyId: string | null;
            round: number;
            position: number;
            scheduledAt: Date | null;
            group: number | null;
            bestOfSets: number | null;
            label: string | null;
            nextMatchId: string | null;
            winnerId: string | null;
            refereeId: string | null;
            startedAt: Date | null;
            finishedAt: Date | null;
        }) | null;
    }>;
    findMine(userId: string, query: QueryFriendlyDto): Promise<({
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
                scoredBy: string;
                timestamp: Date;
            }[];
            winner: {
                id: string;
                name: string;
            } | null;
        } & {
            id: string;
            status: import(".prisma/client").$Enums.MatchStatus;
            teamAId: string | null;
            teamBId: string | null;
            scoreTeamA: number;
            scoreTeamB: number;
            refereeCode: string | null;
            refereeCodeExpiresAt: Date | null;
            bracketId: string | null;
            friendlyId: string | null;
            round: number;
            position: number;
            scheduledAt: Date | null;
            group: number | null;
            bestOfSets: number | null;
            label: string | null;
            nextMatchId: string | null;
            winnerId: string | null;
            refereeId: string | null;
            startedAt: Date | null;
            finishedAt: Date | null;
        }) | null;
        athletes: ({
            teamMember: {
                user: {
                    id: string;
                    name: string;
                    avatarUrl: string | null;
                } | null;
            } & {
                id: string;
                guestName: string | null;
                cpf: string | null;
                isGuest: boolean;
                isCaptain: boolean;
                userId: string | null;
                teamId: string;
            };
        } & {
            id: string;
            isCaptain: boolean;
            friendlyId: string;
            side: string;
            teamMemberId: string;
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
        requesterId: string;
        requesterTeamId: string | null;
        challengedId: string | null;
        challengedTeamId: string | null;
        date: Date;
        startTime: Date | null;
        address: string | null;
        addressNumber: string | null;
        city: string | null;
        state: string | null;
        regionRadius: number | null;
        scoreTeamA: number | null;
        scoreTeamB: number | null;
        modality: string | null;
        categoryFormat: string | null;
        matchId: string | null;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
    })[]>;
    findNearby(query: NearbyQueryDto): Promise<({
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
                scoredBy: string;
                timestamp: Date;
            }[];
            winner: {
                id: string;
                name: string;
            } | null;
        } & {
            id: string;
            status: import(".prisma/client").$Enums.MatchStatus;
            teamAId: string | null;
            teamBId: string | null;
            scoreTeamA: number;
            scoreTeamB: number;
            refereeCode: string | null;
            refereeCodeExpiresAt: Date | null;
            bracketId: string | null;
            friendlyId: string | null;
            round: number;
            position: number;
            scheduledAt: Date | null;
            group: number | null;
            bestOfSets: number | null;
            label: string | null;
            nextMatchId: string | null;
            winnerId: string | null;
            refereeId: string | null;
            startedAt: Date | null;
            finishedAt: Date | null;
        }) | null;
        athletes: ({
            teamMember: {
                user: {
                    id: string;
                    name: string;
                    avatarUrl: string | null;
                } | null;
            } & {
                id: string;
                guestName: string | null;
                cpf: string | null;
                isGuest: boolean;
                isCaptain: boolean;
                userId: string | null;
                teamId: string;
            };
        } & {
            id: string;
            isCaptain: boolean;
            friendlyId: string;
            side: string;
            teamMemberId: string;
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
        requesterId: string;
        requesterTeamId: string | null;
        challengedId: string | null;
        challengedTeamId: string | null;
        date: Date;
        startTime: Date | null;
        address: string | null;
        addressNumber: string | null;
        city: string | null;
        state: string | null;
        regionRadius: number | null;
        scoreTeamA: number | null;
        scoreTeamB: number | null;
        modality: string | null;
        categoryFormat: string | null;
        matchId: string | null;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
    })[]>;
    findOne(friendlyId: string, userId: string): Promise<{
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
                scoredBy: string;
                timestamp: Date;
            }[];
            winner: {
                id: string;
                name: string;
            } | null;
        } & {
            id: string;
            status: import(".prisma/client").$Enums.MatchStatus;
            teamAId: string | null;
            teamBId: string | null;
            scoreTeamA: number;
            scoreTeamB: number;
            refereeCode: string | null;
            refereeCodeExpiresAt: Date | null;
            bracketId: string | null;
            friendlyId: string | null;
            round: number;
            position: number;
            scheduledAt: Date | null;
            group: number | null;
            bestOfSets: number | null;
            label: string | null;
            nextMatchId: string | null;
            winnerId: string | null;
            refereeId: string | null;
            startedAt: Date | null;
            finishedAt: Date | null;
        }) | null;
        athletes: ({
            teamMember: {
                user: {
                    id: string;
                    name: string;
                    avatarUrl: string | null;
                } | null;
            } & {
                id: string;
                guestName: string | null;
                cpf: string | null;
                isGuest: boolean;
                isCaptain: boolean;
                userId: string | null;
                teamId: string;
            };
        } & {
            id: string;
            isCaptain: boolean;
            friendlyId: string;
            side: string;
            teamMemberId: string;
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
        requesterId: string;
        requesterTeamId: string | null;
        challengedId: string | null;
        challengedTeamId: string | null;
        date: Date;
        startTime: Date | null;
        address: string | null;
        addressNumber: string | null;
        city: string | null;
        state: string | null;
        regionRadius: number | null;
        scoreTeamA: number | null;
        scoreTeamB: number | null;
        modality: string | null;
        categoryFormat: string | null;
        matchId: string | null;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
    }>;
    explore(query: NearbyQueryDto & {
        dateFrom?: string;
        dateTo?: string;
        city?: string;
    }): Promise<({
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
                scoredBy: string;
                timestamp: Date;
            }[];
            winner: {
                id: string;
                name: string;
            } | null;
        } & {
            id: string;
            status: import(".prisma/client").$Enums.MatchStatus;
            teamAId: string | null;
            teamBId: string | null;
            scoreTeamA: number;
            scoreTeamB: number;
            refereeCode: string | null;
            refereeCodeExpiresAt: Date | null;
            bracketId: string | null;
            friendlyId: string | null;
            round: number;
            position: number;
            scheduledAt: Date | null;
            group: number | null;
            bestOfSets: number | null;
            label: string | null;
            nextMatchId: string | null;
            winnerId: string | null;
            refereeId: string | null;
            startedAt: Date | null;
            finishedAt: Date | null;
        }) | null;
        athletes: ({
            teamMember: {
                user: {
                    id: string;
                    name: string;
                    avatarUrl: string | null;
                } | null;
            } & {
                id: string;
                guestName: string | null;
                cpf: string | null;
                isGuest: boolean;
                isCaptain: boolean;
                userId: string | null;
                teamId: string;
            };
        } & {
            id: string;
            isCaptain: boolean;
            friendlyId: string;
            side: string;
            teamMemberId: string;
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
        requesterId: string;
        requesterTeamId: string | null;
        challengedId: string | null;
        challengedTeamId: string | null;
        date: Date;
        startTime: Date | null;
        address: string | null;
        addressNumber: string | null;
        city: string | null;
        state: string | null;
        regionRadius: number | null;
        scoreTeamA: number | null;
        scoreTeamB: number | null;
        modality: string | null;
        categoryFormat: string | null;
        matchId: string | null;
        refereeCode: string | null;
        refereeCodeExpiresAt: Date | null;
    })[]>;
    private findFriendlyOrThrow;
    private isTeamOwner;
}
