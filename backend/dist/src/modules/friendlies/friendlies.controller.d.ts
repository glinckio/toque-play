import { FriendliesService } from './friendlies.service';
import { CreateFriendlyDto } from './dto/create-friendly.dto';
import { AcceptFriendlyDto } from './dto/accept-friendly.dto';
import { QueryFriendlyDto, NearbyQueryDto } from './dto/query-friendly.dto';
export declare class FriendliesController {
    private readonly friendliesService;
    constructor(friendliesService: FriendliesService);
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
    accept(friendlyId: string, userId: string, dto: AcceptFriendlyDto): Promise<({
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
}
