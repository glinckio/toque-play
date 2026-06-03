"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma.service");
const app_error_1 = require("../../common/errors/app-error");
const client_1 = require("@prisma/client");
const RANKING_POINTS = {
    1: 100,
    2: 75,
    3: 50,
    4: 25,
};
const DEFAULT_POINTS = 10;
const DEFAULT_CRITERIA = ['WINS', 'POINT_DIFF', 'POINTS_SCORED', 'HEAD_TO_HEAD'];
let RankingService = class RankingService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getRanking(tournamentId) {
        const tournament = await this.prisma.tournament.findUnique({
            where: { id: tournamentId },
            include: { stages: true },
        });
        if (!tournament) {
            throw app_error_1.AppError.tournamentNotFound();
        }
        const brackets = await this.prisma.bracket.findMany({
            where: { tournamentId },
            include: {
                category: { select: { id: true, type: true, format: true, modality: true, tiebreakerCriteria: true } },
                matches: {
                    where: {
                        status: { in: [client_1.MatchStatus.FINISHED, client_1.MatchStatus.WALKOVER] },
                        winnerId: { not: null },
                    },
                    include: {
                        winner: { select: { id: true, name: true, avatarUrl: true } },
                    },
                },
            },
        });
        const teamStats = new Map();
        for (const bracket of brackets) {
            const finalRoundMatches = bracket.matches.filter((m) => m.round === Math.max(...bracket.matches.map((m) => m.round)));
            if (finalRoundMatches.length === 0)
                continue;
            const finalMatch = finalRoundMatches[0];
            const finalistA = finalMatch.teamAId;
            const finalistB = finalMatch.teamBId;
            if (finalMatch.winnerId) {
                this.addPoints(teamStats, finalMatch.winner, 1);
            }
            const loserId = finalMatch.winnerId === finalistA ? finalistB : finalistA;
            const loserMatch = bracket.matches.find((m) => m.winnerId === loserId);
            if (loserId && loserMatch) {
                const loserTeam = {
                    id: loserId,
                    name: loserMatch.winner?.name || '',
                    avatarUrl: loserMatch.winner?.avatarUrl || null,
                };
                const teamWin = bracket.matches.find((m) => m.winnerId === loserId);
                if (teamWin?.winner) {
                    this.addPoints(teamStats, teamWin.winner, 2);
                }
            }
            const semiRound = Math.max(...bracket.matches.map((m) => m.round)) - 1;
            const semiMatches = bracket.matches.filter((m) => m.round === semiRound);
            for (const semi of semiMatches) {
                const semiLoserId = semi.winnerId === semi.teamAId ? semi.teamBId : semi.teamAId;
                if (semiLoserId) {
                    const teamWin = bracket.matches.find((m) => m.winnerId === semiLoserId && m.round < semiRound);
                    if (teamWin?.winner) {
                        this.addPoints(teamStats, teamWin.winner, 3);
                    }
                }
            }
            for (const match of bracket.matches) {
                if (match.teamAId)
                    this.ensureTeam(teamStats, match.teamAId);
                if (match.teamBId)
                    this.ensureTeam(teamStats, match.teamBId);
                if (match.status === client_1.MatchStatus.FINISHED) {
                    if (match.teamAId) {
                        const s = teamStats.get(match.teamAId);
                        s.pointsScored += match.scoreTeamA;
                        s.pointDiff += match.scoreTeamA - match.scoreTeamB;
                    }
                    if (match.teamBId) {
                        const s = teamStats.get(match.teamBId);
                        s.pointsScored += match.scoreTeamB;
                        s.pointDiff += match.scoreTeamB - match.scoreTeamA;
                    }
                    if (match.winnerId && match.teamAId && match.teamBId) {
                        const winnerSide = match.winnerId === match.teamAId ? 'A' : 'B';
                        const loserId = winnerSide === 'A' ? match.teamBId : match.teamAId;
                        const winnerStats = teamStats.get(match.winnerId);
                        winnerStats.headToHead.set(loserId, (winnerStats.headToHead.get(loserId) || 0) + 1);
                    }
                }
            }
        }
        const rawCriteria = brackets[0]?.category?.tiebreakerCriteria;
        const criteria = (rawCriteria?.length ? rawCriteria : DEFAULT_CRITERIA);
        const sorted = Array.from(teamStats.values()).sort((a, b) => {
            for (const c of criteria) {
                const cmp = this.compareByCriteria(a, b, c);
                if (cmp !== 0)
                    return cmp;
            }
            return 0;
        });
        return {
            tournamentId,
            criteria,
            ranking: sorted.map((entry, index) => ({
                position: index + 1,
                team: entry.team,
                points: entry.points,
                wins: entry.wins,
                pointDiff: entry.pointDiff,
                pointsScored: entry.pointsScored,
            })),
        };
    }
    compareByCriteria(a, b, criteria) {
        switch (criteria) {
            case 'WINS':
                return b.wins - a.wins;
            case 'POINT_DIFF':
                return b.pointDiff - a.pointDiff;
            case 'POINTS_SCORED':
                return b.pointsScored - a.pointsScored;
            case 'HEAD_TO_HEAD':
                return (b.headToHead.get(a.team.id) || 0) - (a.headToHead.get(b.team.id) || 0);
            default:
                return 0;
        }
    }
    ensureTeam(teamStats, teamId) {
        if (!teamStats.has(teamId)) {
            teamStats.set(teamId, {
                team: { id: teamId, name: '', avatarUrl: null },
                points: 0,
                wins: 0,
                pointDiff: 0,
                pointsScored: 0,
                headToHead: new Map(),
            });
        }
    }
    addPoints(teamStats, team, position) {
        if (!team?.id)
            return;
        const points = RANKING_POINTS[position] ?? DEFAULT_POINTS;
        const existing = teamStats.get(team.id);
        if (existing) {
            existing.points += points;
            existing.wins += 1;
            existing.team = { id: team.id, name: team.name, avatarUrl: team.avatarUrl };
        }
        else {
            teamStats.set(team.id, {
                team: { id: team.id, name: team.name, avatarUrl: team.avatarUrl },
                points,
                wins: 1,
                pointDiff: 0,
                pointsScored: 0,
                headToHead: new Map(),
            });
        }
    }
    async updateStatsAfterMatch(matchId) {
        const match = await this.prisma.match.findUnique({
            where: { id: matchId },
            include: {
                bracket: { select: { tournamentId: true } },
                sets: true,
                teamA: { include: { members: true } },
                teamB: { include: { members: true } },
            },
        });
        if (!match || !match.teamAId || !match.teamBId || !match.bracket)
            return;
        const tournamentId = match.bracket.tournamentId;
        let setsWonA = 0;
        let setsWonB = 0;
        for (const set of match.sets) {
            if (set.scoreA > set.scoreB)
                setsWonA++;
            else if (set.scoreB > set.scoreA)
                setsWonB++;
        }
        const isTeamAWinner = match.winnerId === match.teamAId;
        const isTeamBWinner = match.winnerId === match.teamBId;
        const upsertMembers = async (members, teamId, isWinner, setsWon, pointsScored) => {
            for (const member of members) {
                if (!member.userId)
                    continue;
                const existing = await this.prisma.athleteStats.findUnique({
                    where: {
                        userId_teamId_tournamentId: {
                            userId: member.userId,
                            teamId,
                            tournamentId,
                        },
                    },
                });
                if (existing) {
                    await this.prisma.athleteStats.update({
                        where: { id: existing.id },
                        data: {
                            matchesPlayed: { increment: 1 },
                            matchesWon: { increment: isWinner ? 1 : 0 },
                            setsWon: { increment: setsWon },
                            pointsScored: { increment: pointsScored },
                        },
                    });
                }
                else {
                    await this.prisma.athleteStats.create({
                        data: {
                            userId: member.userId,
                            teamId,
                            tournamentId,
                            matchesPlayed: 1,
                            matchesWon: isWinner ? 1 : 0,
                            setsWon,
                            pointsScored,
                        },
                    });
                }
            }
        };
        const pointsScoredA = match.sets.reduce((sum, s) => sum + s.scoreA, 0);
        const pointsScoredB = match.sets.reduce((sum, s) => sum + s.scoreB, 0);
        await upsertMembers(match.teamA.members, match.teamAId, isTeamAWinner, setsWonA, pointsScoredA);
        await upsertMembers(match.teamB.members, match.teamBId, isTeamBWinner, setsWonB, pointsScoredB);
    }
};
exports.RankingService = RankingService;
exports.RankingService = RankingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RankingService);
//# sourceMappingURL=ranking.service.js.map