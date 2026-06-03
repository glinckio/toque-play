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
exports.BracketsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma.service");
const app_error_1 = require("../../common/errors/app-error");
const notification_service_1 = require("../../common/services/notification.service");
const tournaments_service_1 = require("../tournaments/tournaments.service");
const client_1 = require("@prisma/client");
const BRACKET_INCLUDE = {
    category: { select: { id: true, type: true, format: true, modality: true, bestOfSets: true } },
    matches: {
        include: {
            teamA: { select: { id: true, name: true, avatarUrl: true } },
            teamB: { select: { id: true, name: true, avatarUrl: true } },
            winner: { select: { id: true, name: true, avatarUrl: true } },
            sets: { orderBy: { setNumber: 'asc' } },
            pointEvents: { orderBy: { timestamp: 'asc' } },
        },
        orderBy: [{ round: 'asc' }, { position: 'asc' }],
    },
};
let BracketsService = class BracketsService {
    prisma;
    tournamentsService;
    notificationService;
    constructor(prisma, tournamentsService, notificationService) {
        this.prisma = prisma;
        this.tournamentsService = tournamentsService;
        this.notificationService = notificationService;
    }
    async generateBracket(tournamentId, userId, dto) {
        const tournament = await this.tournamentsService.verifyOwnership(tournamentId, userId);
        if (tournament.status !== client_1.TournamentStatus.REGISTRATION_CLOSED &&
            tournament.status !== client_1.TournamentStatus.REGISTRATION_OPEN &&
            tournament.status !== client_1.TournamentStatus.PUBLISHED) {
            throw app_error_1.AppError.tournamentNotReady();
        }
        const stages = await this.prisma.tournamentStage.findMany({
            where: { tournamentId },
            orderBy: { date: 'asc' },
        });
        if (stages.length > 0) {
            const nearestStage = stages[0];
            const twoDaysBefore = new Date(nearestStage.date);
            twoDaysBefore.setDate(twoDaysBefore.getDate() - 2);
            twoDaysBefore.setHours(0, 0, 0, 0);
            if (new Date() < twoDaysBefore) {
                throw app_error_1.AppError.bracketTooEarly();
            }
        }
        const existing = await this.prisma.bracket.findUnique({
            where: { tournamentId_categoryId: { tournamentId, categoryId: dto.categoryId } },
        });
        if (existing) {
            throw app_error_1.AppError.bracketAlreadyGenerated();
        }
        const registrations = await this.prisma.registration.findMany({
            where: {
                tournamentId,
                categoryId: dto.categoryId,
                status: client_1.RegistrationStatus.CONFIRMED,
            },
            include: { team: { select: { id: true, name: true } } },
        });
        if (registrations.length < 2) {
            throw app_error_1.AppError.noConfirmedTeams();
        }
        const teamIds = registrations.map((r) => r.teamId);
        const category = await this.prisma.tournamentCategory.findUnique({ where: { id: dto.categoryId } });
        const bestOfSets = category?.bestOfSets ?? 1;
        const semifinalBestOfSets = category?.semifinalBestOfSets ?? bestOfSets;
        const finalBestOfSets = category?.finalBestOfSets ?? bestOfSets;
        const result = await this.prisma.$transaction(async (tx) => {
            const bracket = await tx.bracket.create({
                data: {
                    tournamentId,
                    categoryId: dto.categoryId,
                    type: dto.type,
                },
            });
            if (dto.type === client_1.BracketType.SINGLE_ELIMINATION) {
                await this.generateSingleElimination(tx, bracket.id, teamIds, bestOfSets, semifinalBestOfSets, finalBestOfSets);
            }
            else if (dto.type === client_1.BracketType.ROUND_ROBIN) {
                await this.generateRoundRobin(tx, bracket.id, teamIds, bestOfSets);
            }
            else if (dto.type === client_1.BracketType.GROUPS_THEN_ELIMINATION) {
                await this.generateGroupsThenElimination(tx, bracket.id, teamIds, category, bestOfSets, semifinalBestOfSets, finalBestOfSets);
            }
            else {
                throw app_error_1.AppError.invalidBracketType();
            }
            await tx.tournament.update({
                where: { id: tournamentId },
                data: { status: client_1.TournamentStatus.BRACKET_GENERATED },
            });
            return tx.bracket.findUnique({
                where: { id: bracket.id },
                include: BRACKET_INCLUDE,
            });
        });
        const tournamentData = await this.prisma.tournament.findUnique({
            where: { id: tournamentId },
        });
        if (tournamentData) {
            const userIds = registrations.map((r) => r.userId);
            await this.notificationService.sendToUsers(userIds, {
                title: 'Chaveamento Gerado!',
                body: `O chaveamento do torneio "${tournamentData.name}" foi gerado. Confira!`,
                type: 'BRACKET_GENERATED',
                referenceId: tournamentId,
            });
        }
        return result;
    }
    async generateSingleElimination(tx, bracketId, teamIds, bestOfSets, semifinalBestOfSets, finalBestOfSets) {
        const numTeams = teamIds.length;
        const numRounds = Math.ceil(Math.log2(numTeams));
        const totalSlots = Math.pow(2, numRounds);
        const shuffled = [...teamIds].sort(() => Math.random() - 0.5);
        const matchMap = new Map();
        for (let round = numRounds; round >= 1; round--) {
            const matchesInRound = Math.pow(2, numRounds - round);
            for (let pos = 0; pos < matchesInRound; pos++) {
                const nextRoundKey = round < numRounds ? `${round + 1}-${Math.floor(pos / 2)}` : null;
                const matchData = {
                    bracketId,
                    round,
                    position: pos,
                    status: client_1.MatchStatus.SCHEDULED,
                    bestOfSets,
                };
                if (round === numRounds) {
                    matchData.label = 'FINAL';
                    matchData.bestOfSets = finalBestOfSets;
                }
                else if (round === numRounds - 1) {
                    matchData.label = 'SEMIFINAL';
                    matchData.bestOfSets = semifinalBestOfSets;
                }
                if (nextRoundKey && matchMap.has(nextRoundKey)) {
                    matchData.nextMatchId = matchMap.get(nextRoundKey);
                }
                if (round === 1) {
                    const teamAIndex = pos * 2;
                    const teamBIndex = pos * 2 + 1;
                    if (teamAIndex < shuffled.length) {
                        matchData.teamAId = shuffled[teamAIndex];
                    }
                    if (teamBIndex < shuffled.length) {
                        matchData.teamBId = shuffled[teamBIndex];
                    }
                }
                const match = await tx.match.create({ data: matchData });
                matchMap.set(`${round}-${pos}`, match.id);
                if (round === 1 && matchData.teamAId && !matchData.teamBId && matchData.nextMatchId) {
                    await this.advanceTeamToNextMatch(tx, matchData.nextMatchId, matchData.teamAId, 'A');
                    await tx.match.update({
                        where: { id: match.id },
                        data: { status: client_1.MatchStatus.WALKOVER, winnerId: matchData.teamAId },
                    });
                }
                else if (round === 1 && !matchData.teamAId && matchData.teamBId && matchData.nextMatchId) {
                    await this.advanceTeamToNextMatch(tx, matchData.nextMatchId, matchData.teamBId, 'B');
                    await tx.match.update({
                        where: { id: match.id },
                        data: { status: client_1.MatchStatus.WALKOVER, winnerId: matchData.teamBId },
                    });
                }
            }
        }
    }
    async advanceTeamToNextMatch(tx, nextMatchId, teamId, slot) {
        const nextMatch = await tx.match.findUnique({ where: { id: nextMatchId } });
        if (!nextMatch)
            return;
        const updateData = {};
        if (!nextMatch.teamAId) {
            updateData.teamAId = teamId;
        }
        else if (!nextMatch.teamBId) {
            updateData.teamBId = teamId;
        }
        if (Object.keys(updateData).length > 0) {
            await tx.match.update({ where: { id: nextMatchId }, data: updateData });
        }
    }
    async generateRoundRobin(tx, bracketId, teamIds, bestOfSets) {
        const numTeams = teamIds.length;
        let round = 1;
        let position = 0;
        const matchesPerRound = Math.floor(numTeams / 2);
        for (let i = 0; i < teamIds.length; i++) {
            for (let j = i + 1; j < teamIds.length; j++) {
                if (position >= matchesPerRound) {
                    round++;
                    position = 0;
                }
                await tx.match.create({
                    data: {
                        bracketId,
                        round,
                        position,
                        status: client_1.MatchStatus.SCHEDULED,
                        teamAId: teamIds[i],
                        teamBId: teamIds[j],
                        bestOfSets,
                    },
                });
                position++;
            }
        }
    }
    async generateGroupsThenElimination(tx, bracketId, teamIds, category, bestOfSets, semifinalBestOfSets, finalBestOfSets) {
        const numTeams = teamIds.length;
        const shuffled = [...teamIds].sort(() => Math.random() - 0.5);
        const DEFAULT_TEAMS_PER_GROUP = 5;
        let teamsPerGroup;
        if (category.teamsPerGroup) {
            teamsPerGroup = category.teamsPerGroup;
        }
        else if (category.groupsCount) {
            teamsPerGroup = Math.ceil(numTeams / category.groupsCount);
        }
        else {
            teamsPerGroup = DEFAULT_TEAMS_PER_GROUP;
        }
        const groupsCount = Math.max(2, Math.ceil(numTeams / teamsPerGroup));
        const actualTeamsPerGroup = Math.ceil(numTeams / groupsCount);
        let teamsAdvancing;
        if (category.teamsAdvancing) {
            teamsAdvancing = category.teamsAdvancing;
        }
        else if (actualTeamsPerGroup <= 3) {
            teamsAdvancing = actualTeamsPerGroup;
        }
        else {
            teamsAdvancing = 3;
        }
        const needsElimination = teamsAdvancing < actualTeamsPerGroup;
        const groups = Array.from({ length: groupsCount }, () => []);
        for (let i = 0; i < shuffled.length; i++) {
            groups[i % groupsCount].push(shuffled[i]);
        }
        for (let groupIdx = 0; groupIdx < groups.length; groupIdx++) {
            const groupTeams = groups[groupIdx];
            let round = 1;
            let position = 0;
            const matchesPerRound = Math.floor(groupTeams.length / 2);
            for (let i = 0; i < groupTeams.length; i++) {
                for (let j = i + 1; j < groupTeams.length; j++) {
                    if (matchesPerRound > 0 && position >= matchesPerRound) {
                        round++;
                        position = 0;
                    }
                    await tx.match.create({
                        data: {
                            bracketId,
                            round,
                            position,
                            status: client_1.MatchStatus.SCHEDULED,
                            teamAId: groupTeams[i],
                            teamBId: groupTeams[j],
                            group: groupIdx,
                            bestOfSets,
                        },
                    });
                    position++;
                }
            }
        }
        if (needsElimination) {
            const totalAdvancing = groupsCount * teamsAdvancing;
            const numRounds = Math.ceil(Math.log2(totalAdvancing));
            const totalSlots = Math.pow(2, numRounds);
            const matchMap = new Map();
            const eliminationRoundOffset = 100;
            for (let round = numRounds; round >= 1; round--) {
                const matchesInRound = Math.pow(2, numRounds - round);
                for (let pos = 0; pos < matchesInRound; pos++) {
                    const nextRoundKey = round < numRounds ? `${round + 1}-${Math.floor(pos / 2)}` : null;
                    const matchData = {
                        bracketId,
                        round: round + eliminationRoundOffset,
                        position: pos,
                        status: client_1.MatchStatus.SCHEDULED,
                        group: null,
                        bestOfSets,
                    };
                    if (round === numRounds) {
                        matchData.label = 'FINAL';
                        matchData.bestOfSets = finalBestOfSets;
                    }
                    else if (round === numRounds - 1) {
                        matchData.label = 'SEMIFINAL';
                        matchData.bestOfSets = semifinalBestOfSets;
                    }
                    if (nextRoundKey && matchMap.has(nextRoundKey)) {
                        matchData.nextMatchId = matchMap.get(nextRoundKey);
                    }
                    const match = await tx.match.create({ data: matchData });
                    matchMap.set(`${round}-${pos}`, match.id);
                }
            }
        }
    }
    async checkAndAdvanceGroupTeams(matchId) {
        const match = await this.prisma.match.findUnique({
            where: { id: matchId },
            include: { bracket: true },
        });
        if (!match || !match.bracket || match.group === null)
            return;
        if (match.bracket.type !== client_1.BracketType.GROUPS_THEN_ELIMINATION)
            return;
        const bracketId = match.bracketId;
        const groupMatches = await this.prisma.match.findMany({
            where: { bracketId, group: { not: null } },
            include: { sets: true },
        });
        const allFinished = groupMatches.every((m) => m.status === client_1.MatchStatus.FINISHED || m.status === client_1.MatchStatus.WALKOVER);
        if (!allFinished)
            return;
        const category = await this.prisma.tournamentCategory.findUnique({
            where: { id: match.bracket.categoryId },
        });
        if (!category || !category.teamsAdvancing)
            return;
        const groups = new Map();
        for (const m of groupMatches) {
            const g = m.group;
            if (!groups.has(g))
                groups.set(g, new Map());
            const gMap = groups.get(g);
            const teamAId = m.teamAId;
            const teamBId = m.teamBId;
            if (!gMap.has(teamAId))
                gMap.set(teamAId, { wins: 0, pointsFor: 0, pointsAgainst: 0 });
            if (!gMap.has(teamBId))
                gMap.set(teamBId, { wins: 0, pointsFor: 0, pointsAgainst: 0 });
            const a = gMap.get(teamAId);
            const b = gMap.get(teamBId);
            const ptsA = m.sets.reduce((sum, s) => sum + s.scoreA, 0);
            const ptsB = m.sets.reduce((sum, s) => sum + s.scoreB, 0);
            a.pointsFor += ptsA;
            a.pointsAgainst += ptsB;
            b.pointsFor += ptsB;
            b.pointsAgainst += ptsA;
            if (m.scoreTeamA > m.scoreTeamB)
                a.wins++;
            else if (m.scoreTeamB > m.scoreTeamA)
                b.wins++;
        }
        const advancingTeams = [];
        const sortedGroupIndexes = [...groups.keys()].sort((a, b) => a - b);
        for (const gIdx of sortedGroupIndexes) {
            const gMap = groups.get(gIdx);
            const sorted = [...gMap.entries()].sort((a, b) => {
                if (b[1].wins !== a[1].wins)
                    return b[1].wins - a[1].wins;
                const saldoA = a[1].pointsFor - a[1].pointsAgainst;
                const saldoB = b[1].pointsFor - b[1].pointsAgainst;
                if (saldoB !== saldoA)
                    return saldoB - saldoA;
                return b[1].pointsFor - a[1].pointsFor;
            });
            const topN = sorted.slice(0, category.teamsAdvancing).map(([id]) => id);
            advancingTeams.push(...topN);
        }
        const reordered = [];
        const maxAdvance = category.teamsAdvancing;
        for (let pos = 0; pos < maxAdvance; pos++) {
            for (const gIdx of sortedGroupIndexes) {
                const gMap = groups.get(gIdx);
                const sorted = [...gMap.entries()].sort((a, b) => {
                    if (b[1].wins !== a[1].wins)
                        return b[1].wins - a[1].wins;
                    const saldoA = a[1].pointsFor - a[1].pointsAgainst;
                    const saldoB = b[1].pointsFor - b[1].pointsAgainst;
                    if (saldoB !== saldoA)
                        return saldoB - saldoA;
                    return b[1].pointsFor - a[1].pointsFor;
                });
                if (sorted[pos])
                    reordered.push(sorted[pos][0]);
            }
        }
        const eliminationMatches = await this.prisma.match.findMany({
            where: { bracketId, group: null },
            orderBy: [{ round: 'asc' }, { position: 'asc' }],
        });
        const minRound = Math.min(...eliminationMatches.map((m) => m.round));
        const firstRoundMatches = eliminationMatches.filter((m) => m.round === minRound);
        let teamIdx = 0;
        for (const elimMatch of firstRoundMatches) {
            const updateData = {};
            if (!elimMatch.teamAId && teamIdx < reordered.length) {
                updateData.teamAId = reordered[teamIdx++];
            }
            if (!elimMatch.teamBId && teamIdx < reordered.length) {
                updateData.teamBId = reordered[teamIdx++];
            }
            if (Object.keys(updateData).length > 0) {
                await this.prisma.match.update({ where: { id: elimMatch.id }, data: updateData });
                const updated = await this.prisma.match.findUnique({ where: { id: elimMatch.id } });
                if (updated?.teamAId && !updated?.teamBId) {
                    if (updated.nextMatchId) {
                        await this.fillNextMatchSlot(updated.nextMatchId, updated.teamAId);
                    }
                    await this.prisma.match.update({
                        where: { id: updated.id },
                        data: { status: client_1.MatchStatus.WALKOVER, winnerId: updated.teamAId },
                    });
                }
                else if (!updated?.teamAId && updated?.teamBId) {
                    if (updated.nextMatchId) {
                        await this.fillNextMatchSlot(updated.nextMatchId, updated.teamBId);
                    }
                    await this.prisma.match.update({
                        where: { id: updated.id },
                        data: { status: client_1.MatchStatus.WALKOVER, winnerId: updated.teamBId },
                    });
                }
            }
        }
    }
    async fillNextMatchSlot(nextMatchId, teamId) {
        const nextMatch = await this.prisma.match.findUnique({ where: { id: nextMatchId } });
        if (!nextMatch)
            return;
        const updateData = {};
        if (!nextMatch.teamAId) {
            updateData.teamAId = teamId;
        }
        else if (!nextMatch.teamBId) {
            updateData.teamBId = teamId;
        }
        if (Object.keys(updateData).length > 0) {
            await this.prisma.match.update({ where: { id: nextMatchId }, data: updateData });
        }
    }
    async checkAndAdvanceRoundRobinTeams(matchId) {
        const match = await this.prisma.match.findUnique({
            where: { id: matchId },
            include: { bracket: true },
        });
        if (!match || !match.bracket)
            return;
        if (match.bracket.type !== client_1.BracketType.ROUND_ROBIN)
            return;
        if (match.group !== null)
            return;
        const bracketId = match.bracketId;
        const allMatches = await this.prisma.match.findMany({
            where: { bracketId },
            include: { sets: true },
            orderBy: [{ round: 'asc' }, { position: 'asc' }],
        });
        const rrMatches = allMatches.filter((m) => m.teamAId !== null && m.teamBId !== null && m.group === null);
        if (rrMatches.length === 0)
            return;
        const allFinished = rrMatches.every((m) => m.status === client_1.MatchStatus.FINISHED || m.status === client_1.MatchStatus.WALKOVER);
        if (!allFinished)
            return;
        const playoffMatches = allMatches.filter((m) => (m.teamAId === null || m.teamBId === null) && m.group === null);
        if (playoffMatches.length === 0)
            return;
        const alreadyAdvanced = playoffMatches.some((m) => m.teamAId !== null || m.teamBId !== null);
        if (alreadyAdvanced)
            return;
        const standings = new Map();
        for (const m of rrMatches) {
            const teamAId = m.teamAId;
            const teamBId = m.teamBId;
            if (!standings.has(teamAId))
                standings.set(teamAId, { wins: 0, pointsFor: 0, pointsAgainst: 0 });
            if (!standings.has(teamBId))
                standings.set(teamBId, { wins: 0, pointsFor: 0, pointsAgainst: 0 });
            const a = standings.get(teamAId);
            const b = standings.get(teamBId);
            const ptsA = m.sets?.reduce((sum, s) => sum + s.scoreA, 0) ?? m.scoreTeamA ?? 0;
            const ptsB = m.sets?.reduce((sum, s) => sum + s.scoreB, 0) ?? m.scoreTeamB ?? 0;
            a.pointsFor += ptsA;
            a.pointsAgainst += ptsB;
            b.pointsFor += ptsB;
            b.pointsAgainst += ptsA;
            if (m.scoreTeamA > m.scoreTeamB)
                a.wins++;
            else if (m.scoreTeamB > m.scoreTeamA)
                b.wins++;
            else if (m.winnerId === teamAId)
                a.wins++;
            else if (m.winnerId === teamBId)
                b.wins++;
        }
        const sorted = [...standings.entries()].sort((a, b) => {
            if (b[1].wins !== a[1].wins)
                return b[1].wins - a[1].wins;
            const saldoA = a[1].pointsFor - a[1].pointsAgainst;
            const saldoB = b[1].pointsFor - b[1].pointsAgainst;
            if (saldoB !== saldoA)
                return saldoB - saldoA;
            return b[1].pointsFor - a[1].pointsFor;
        });
        const rankedTeamIds = sorted.map(([id]) => id);
        const sortedPlayoffs = [...playoffMatches].sort((a, b) => a.position - b.position);
        for (let i = sortedPlayoffs.length - 1; i >= 0; i--) {
            const playoff = sortedPlayoffs[i];
            const teamIndex = (sortedPlayoffs.length - 1 - i) * 2;
            const updateData = {};
            if (rankedTeamIds[teamIndex]) {
                updateData.teamAId = rankedTeamIds[teamIndex];
            }
            if (rankedTeamIds[teamIndex + 1]) {
                updateData.teamBId = rankedTeamIds[teamIndex + 1];
            }
            if (i === sortedPlayoffs.length - 1) {
                updateData.label = 'FINAL';
            }
            else if (i === sortedPlayoffs.length - 2) {
                updateData.label = 'TERCEIRO_LUGAR';
            }
            if (Object.keys(updateData).length > 0) {
                await this.prisma.match.update({
                    where: { id: playoff.id },
                    data: updateData,
                });
            }
        }
    }
    async getBracket(tournamentId, categoryId) {
        const where = { tournamentId };
        if (categoryId)
            where.categoryId = categoryId;
        const brackets = await this.prisma.bracket.findMany({
            where,
            include: BRACKET_INCLUDE,
        });
        if (categoryId && brackets.length === 0) {
            throw app_error_1.AppError.bracketNotFound();
        }
        return brackets.map((bracket) => ({
            ...bracket,
            rounds: this.groupByRound(bracket.matches),
        }));
    }
    groupByRound(matches) {
        const rounds = {};
        for (const match of matches) {
            if (!rounds[match.round])
                rounds[match.round] = [];
            rounds[match.round].push(match);
        }
        return rounds;
    }
};
exports.BracketsService = BracketsService;
exports.BracketsService = BracketsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tournaments_service_1.TournamentsService,
        notification_service_1.NotificationService])
], BracketsService);
//# sourceMappingURL=brackets.service.js.map