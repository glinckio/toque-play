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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma.service");
const app_error_1 = require("../../common/errors/app-error");
const matches_gateway_1 = require("./matches.gateway");
const ranking_service_1 = require("../ranking/ranking.service");
const brackets_service_1 = require("../brackets/brackets.service");
const client_1 = require("@prisma/client");
let MatchesService = class MatchesService {
    prisma;
    matchesGateway;
    rankingService;
    bracketsService;
    constructor(prisma, matchesGateway, rankingService, bracketsService) {
        this.prisma = prisma;
        this.matchesGateway = matchesGateway;
        this.rankingService = rankingService;
        this.bracketsService = bracketsService;
    }
    emitMatchEvent(match, event, data) {
        console.log(`[WS] Emitting ${event} for match:${match.id}`, JSON.stringify(data));
        this.matchesGateway.emitToMatch(match.id, event, data);
        if (match.friendlyId) {
            this.matchesGateway.emitToFriendly(match.friendlyId, event, data);
        }
        else if (match.bracket?.tournamentId) {
            this.matchesGateway.emitToTournament(match.bracket.tournamentId, event, data);
        }
    }
    async startMatch(matchId, userId) {
        const match = await this.findMatchWithReferee(matchId, userId);
        if (match.status !== client_1.MatchStatus.SCHEDULED) {
            throw app_error_1.AppError.matchNotScheduled();
        }
        if (!match.teamAId || !match.teamBId) {
            throw app_error_1.AppError.missingOpponent();
        }
        const now = new Date();
        if (match.friendlyId && match.friendly) {
            const friendlyDate = new Date(match.friendly.date);
            const todayStart = new Date(friendlyDate.getFullYear(), friendlyDate.getMonth(), friendlyDate.getDate());
            const todayEnd = new Date(todayStart);
            todayEnd.setHours(23, 59, 59, 999);
            if (now < todayStart || now > todayEnd) {
                throw app_error_1.AppError.cannotStartMatchOutsideDay();
            }
            if (match.friendly.startTime) {
                const scheduledTime = new Date(match.friendly.startTime);
                const earliestStart = new Date(todayStart);
                earliestStart.setHours(scheduledTime.getHours(), scheduledTime.getMinutes(), 0, 0);
                if (now < earliestStart) {
                    throw app_error_1.AppError.cannotStartMatchBeforeTime();
                }
            }
        }
        const updated = await this.prisma.$transaction(async (tx) => {
            await tx.matchSet.create({
                data: { matchId, setNumber: 1 },
            });
            const updateData = {
                status: client_1.MatchStatus.IN_PROGRESS,
                startedAt: now,
            };
            if (!match.bestOfSets && match.bracketId) {
                const category = await tx.tournamentCategory.findFirst({
                    where: { brackets: { some: { id: match.bracketId } } },
                });
                if (category) {
                    updateData.bestOfSets = category.bestOfSets;
                    if (!match.tiebreakScore && category.tiebreakScore) {
                        updateData.tiebreakScore = category.tiebreakScore;
                    }
                }
            }
            const m = await tx.match.update({
                where: { id: matchId },
                data: updateData,
                include: {
                    teamA: { select: { id: true, name: true, avatarUrl: true } },
                    teamB: { select: { id: true, name: true, avatarUrl: true } },
                },
            });
            await tx.matchEvent.create({
                data: {
                    matchId,
                    type: client_1.MatchEventType.MATCH_START,
                    setNumber: 1,
                    createdBy: userId,
                },
            });
            return m;
        });
        this.emitMatchEvent(match, 'match:start', {
            matchId,
            teamAId: updated.teamAId,
            teamBId: updated.teamBId,
        });
        return updated;
    }
    async registerPoint(matchId, userId, dto) {
        const match = await this.findMatchWithReferee(matchId, userId);
        if (match.status !== client_1.MatchStatus.IN_PROGRESS) {
            throw app_error_1.AppError.matchNotInProgress();
        }
        const isTeamA = dto.team === 'A';
        const currentSet = await this.prisma.matchSet.findFirst({
            where: { matchId },
            orderBy: { setNumber: 'desc' },
        });
        if (!currentSet) {
            throw app_error_1.AppError.setNotFound();
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.matchSet.update({
                where: { id: currentSet.id },
                data: isTeamA ? { scoreA: { increment: 1 } } : { scoreB: { increment: 1 } },
            });
            await tx.pointEvent.create({
                data: {
                    matchId,
                    setNumber: currentSet.setNumber,
                    scoredBy: dto.team,
                },
            });
        });
        const updatedMatch = await this.prisma.match.findUnique({
            where: { id: matchId },
            include: {
                teamA: { select: { id: true, name: true, avatarUrl: true } },
                teamB: { select: { id: true, name: true, avatarUrl: true } },
                sets: { orderBy: { setNumber: 'asc' } },
            },
        });
        const modality = this.getMatchModality(match);
        const newSetScoreA = isTeamA ? currentSet.scoreA + 1 : currentSet.scoreA;
        const newSetScoreB = isTeamA ? currentSet.scoreB : currentSet.scoreB + 1;
        const isBeach = modality === client_1.TournamentModality.BEACH;
        const prevSetScoreA = currentSet.scoreA;
        const prevSetScoreB = currentSet.scoreB;
        const firstToReach11 = (prevSetScoreA < 11 && newSetScoreA >= 11) || (prevSetScoreB < 11 && newSetScoreB >= 11);
        const alreadySwitched = isBeach && firstToReach11
            ? !!(await this.prisma.matchEvent.findFirst({
                where: { matchId, type: client_1.MatchEventType.SIDE_SWITCH, setNumber: currentSet.setNumber },
            }))
            : false;
        const sideSwitch = isBeach && firstToReach11 && !alreadySwitched;
        this.emitMatchEvent(match, 'match:point', {
            matchId,
            team: dto.team,
            scoreA: updatedMatch.scoreTeamA,
            scoreB: updatedMatch.scoreTeamB,
            setNumber: currentSet.setNumber,
            sideSwitch,
            sets: updatedMatch.sets,
        });
        if (sideSwitch) {
            await this.prisma.matchEvent.create({
                data: {
                    matchId,
                    type: client_1.MatchEventType.SIDE_SWITCH,
                    setNumber: currentSet.setNumber,
                    team: dto.team,
                    scoreA: newSetScoreA,
                    scoreB: newSetScoreB,
                    createdBy: userId,
                },
            });
        }
        const isFriendly = !!match.friendlyId;
        const setReachedWinningScore = this.isWinningScore(newSetScoreA, newSetScoreB, modality, currentSet.setNumber, match.bestOfSets, match.tiebreakScore);
        const setFinished = isFriendly && setReachedWinningScore;
        if (!isFriendly && setReachedWinningScore && match.bestOfSets) {
            await this.finishSet(matchId, userId, { setNumber: currentSet.setNumber });
            const { a: setsWonA, b: setsWonB } = await this.countSetsWon(matchId);
            await this.prisma.match.update({
                where: { id: matchId },
                data: { scoreTeamA: setsWonA, scoreTeamB: setsWonB },
            });
            const setsNeeded = this.getSetsNeededToWin(match.bestOfSets);
            if (setsWonA >= setsNeeded || setsWonB >= setsNeeded) {
                await this.finishMatch(matchId, userId);
                return this.prisma.match.findUnique({
                    where: { id: matchId },
                    include: {
                        teamA: { select: { id: true, name: true, avatarUrl: true } },
                        teamB: { select: { id: true, name: true, avatarUrl: true } },
                        sets: { orderBy: { setNumber: 'asc' } },
                        winner: { select: { id: true, name: true } },
                    },
                });
            }
            const refreshed = await this.prisma.match.findUnique({
                where: { id: matchId },
                include: {
                    teamA: { select: { id: true, name: true, avatarUrl: true } },
                    teamB: { select: { id: true, name: true, avatarUrl: true } },
                    sets: { orderBy: { setNumber: 'asc' } },
                },
            });
            return { ...refreshed, setFinished: true, currentSetNumber: currentSet.setNumber + 1 };
        }
        if (!isFriendly && !match.bestOfSets && this.isWinningScore(updatedMatch.scoreTeamA, updatedMatch.scoreTeamB, modality)) {
            await this.finishMatch(matchId, userId);
            return this.prisma.match.findUnique({
                where: { id: matchId },
                include: {
                    teamA: { select: { id: true, name: true, avatarUrl: true } },
                    teamB: { select: { id: true, name: true, avatarUrl: true } },
                    sets: { orderBy: { setNumber: 'asc' } },
                    winner: { select: { id: true, name: true } },
                },
            });
        }
        return { ...updatedMatch, setFinished, currentSetNumber: currentSet?.setNumber };
    }
    async removePoint(matchId, userId, dto) {
        const match = await this.findMatchWithReferee(matchId, userId);
        if (match.status !== client_1.MatchStatus.IN_PROGRESS) {
            throw app_error_1.AppError.matchNotInProgress();
        }
        const isTeamA = dto.team === 'A';
        const currentSet = await this.prisma.matchSet.findFirst({
            where: { matchId },
            orderBy: { setNumber: 'desc' },
        });
        if (!currentSet) {
            throw app_error_1.AppError.setNotFound();
        }
        if (isTeamA && currentSet.scoreA <= 0)
            return this.prisma.match.findUnique({ where: { id: matchId } });
        if (!isTeamA && currentSet.scoreB <= 0)
            return this.prisma.match.findUnique({ where: { id: matchId } });
        await this.prisma.$transaction(async (tx) => {
            await tx.matchSet.update({
                where: { id: currentSet.id },
                data: isTeamA ? { scoreA: { decrement: 1 } } : { scoreB: { decrement: 1 } },
            });
            const lastPoint = await tx.pointEvent.findFirst({
                where: { matchId, setNumber: currentSet.setNumber, scoredBy: dto.team },
                orderBy: { timestamp: 'desc' },
            });
            if (lastPoint) {
                await tx.pointEvent.delete({ where: { id: lastPoint.id } });
            }
            if (match.bestOfSets) {
                const allSets = await tx.matchSet.findMany({ where: { matchId } });
                let setsWonA = 0, setsWonB = 0;
                for (const s of allSets) {
                    if (s.scoreA > s.scoreB)
                        setsWonA++;
                    else if (s.scoreB > s.scoreA)
                        setsWonB++;
                }
                await tx.match.update({
                    where: { id: matchId },
                    data: { scoreTeamA: setsWonA, scoreTeamB: setsWonB },
                });
            }
            else {
                const updateData = {};
                if (isTeamA)
                    updateData.scoreTeamA = { decrement: 1 };
                else
                    updateData.scoreTeamB = { decrement: 1 };
                await tx.match.update({ where: { id: matchId }, data: updateData });
            }
        });
        const updatedMatch = await this.prisma.match.findUnique({
            where: { id: matchId },
            include: {
                teamA: { select: { id: true, name: true, avatarUrl: true } },
                teamB: { select: { id: true, name: true, avatarUrl: true } },
                sets: { orderBy: { setNumber: 'asc' } },
            },
        });
        this.emitMatchEvent(match, 'match:point', {
            matchId,
            team: dto.team,
            scoreA: updatedMatch.scoreTeamA,
            scoreB: updatedMatch.scoreTeamB,
            setNumber: currentSet.setNumber,
            sets: updatedMatch.sets,
        });
        return updatedMatch;
    }
    async finishSet(matchId, userId, dto) {
        const match = await this.findMatchWithReferee(matchId, userId);
        if (match.status !== client_1.MatchStatus.IN_PROGRESS) {
            throw app_error_1.AppError.matchNotInProgress();
        }
        const setToFinish = await this.prisma.matchSet.findUnique({
            where: { matchId_setNumber: { matchId, setNumber: dto.setNumber } },
        });
        if (!setToFinish) {
            throw app_error_1.AppError.setNotFound();
        }
        if (setToFinish.scoreA === setToFinish.scoreB) {
            throw app_error_1.AppError.scoreNotWinning();
        }
        await this.prisma.matchEvent.create({
            data: {
                matchId,
                type: client_1.MatchEventType.SET_FINISH,
                setNumber: dto.setNumber,
                scoreA: setToFinish.scoreA,
                scoreB: setToFinish.scoreB,
                createdBy: userId,
            },
        });
        const { a: setsWonA, b: setsWonB } = await this.countSetsWon(matchId);
        await this.prisma.match.update({
            where: { id: matchId },
            data: { scoreTeamA: setsWonA, scoreTeamB: setsWonB },
        });
        const bestOfSets = match.bestOfSets ?? 0;
        if (bestOfSets > 0) {
            const setsNeeded = this.getSetsNeededToWin(bestOfSets);
            if (setsWonA < setsNeeded && setsWonB < setsNeeded) {
                const nextSetNumber = dto.setNumber + 1;
                const existingNext = await this.prisma.matchSet.findUnique({
                    where: { matchId_setNumber: { matchId, setNumber: nextSetNumber } },
                });
                if (!existingNext) {
                    await this.prisma.matchSet.create({
                        data: { matchId, setNumber: nextSetNumber },
                    });
                }
            }
        }
        else {
            const nextSetNumber = dto.setNumber + 1;
            const existingNext = await this.prisma.matchSet.findUnique({
                where: { matchId_setNumber: { matchId, setNumber: nextSetNumber } },
            });
            if (!existingNext) {
                await this.prisma.matchSet.create({
                    data: { matchId, setNumber: nextSetNumber },
                });
            }
        }
        const updatedSets = await this.prisma.matchSet.findMany({
            where: { matchId },
            orderBy: { setNumber: 'asc' },
        });
        this.emitMatchEvent(match, 'match:set-finish', {
            matchId,
            setNumber: dto.setNumber,
            scoreA: setToFinish.scoreA,
            scoreB: setToFinish.scoreB,
            sets: updatedSets,
        });
        return this.prisma.match.findUnique({
            where: { id: matchId },
            include: {
                sets: { orderBy: { setNumber: 'asc' } },
                teamA: { select: { id: true, name: true, avatarUrl: true } },
                teamB: { select: { id: true, name: true, avatarUrl: true } },
            },
        });
    }
    async finishMatch(matchId, userId) {
        const match = await this.findMatchWithReferee(matchId, userId);
        if (match.status !== client_1.MatchStatus.IN_PROGRESS) {
            throw app_error_1.AppError.matchNotInProgress();
        }
        const isFriendly = !!match.friendlyId;
        if (!isFriendly) {
            if (match.bestOfSets) {
                const setsNeeded = this.getSetsNeededToWin(match.bestOfSets);
                if (match.scoreTeamA < setsNeeded && match.scoreTeamB < setsNeeded) {
                    throw app_error_1.AppError.scoreNotWinning();
                }
            }
            else {
                const modality = this.getMatchModality(match);
                if (!this.isWinningScore(match.scoreTeamA, match.scoreTeamB, modality)) {
                    throw app_error_1.AppError.scoreNotWinning();
                }
            }
        }
        let winnerId = null;
        if (match.scoreTeamA > match.scoreTeamB) {
            winnerId = match.teamAId;
        }
        else if (match.scoreTeamB > match.scoreTeamA) {
            winnerId = match.teamBId;
        }
        const now = new Date();
        const updated = await this.prisma.$transaction(async (tx) => {
            const finished = await tx.match.update({
                where: { id: matchId },
                data: {
                    status: client_1.MatchStatus.FINISHED,
                    finishedAt: now,
                    winnerId,
                },
                include: {
                    teamA: { select: { id: true, name: true, avatarUrl: true } },
                    teamB: { select: { id: true, name: true, avatarUrl: true } },
                    winner: { select: { id: true, name: true } },
                },
            });
            if (winnerId && match.nextMatchId && match.bracketId) {
                await this.advanceWinner(tx, match.nextMatchId, winnerId);
            }
            if (finished.friendlyId) {
                await tx.friendly.update({
                    where: { id: finished.friendlyId },
                    data: {
                        status: 'COMPLETED',
                        scoreTeamA: finished.scoreTeamA,
                        scoreTeamB: finished.scoreTeamB,
                    },
                });
            }
            return finished;
        });
        await this.prisma.matchEvent.create({
            data: {
                matchId,
                type: client_1.MatchEventType.MATCH_FINISH,
                scoreA: match.scoreTeamA,
                scoreB: match.scoreTeamB,
                team: winnerId === match.teamAId ? 'A' : winnerId === match.teamBId ? 'B' : null,
                createdBy: userId,
            },
        });
        this.emitMatchEvent(match, 'match:finish', {
            matchId,
            winnerId,
            scoreA: match.scoreTeamA,
            scoreB: match.scoreTeamB,
        });
        await this.rankingService.updateStatsAfterMatch(matchId);
        await this.bracketsService.checkAndAdvanceGroupTeams(matchId).catch(() => { });
        await this.bracketsService.checkAndAdvanceRoundRobinTeams(matchId).catch(() => { });
        return updated;
    }
    async declareWalkover(matchId, userId, dto) {
        const match = await this.findMatchWithReferee(matchId, userId);
        if (match.status !== client_1.MatchStatus.SCHEDULED) {
            throw app_error_1.AppError.matchNotScheduled();
        }
        const winnerId = dto.winnerTeam === 'A' ? match.teamAId : match.teamBId;
        if (!winnerId) {
            throw app_error_1.AppError.walkoverTeamRequired();
        }
        const now = new Date();
        const updated = await this.prisma.$transaction(async (tx) => {
            const finished = await tx.match.update({
                where: { id: matchId },
                data: {
                    status: client_1.MatchStatus.WALKOVER,
                    finishedAt: now,
                    winnerId,
                },
                include: {
                    teamA: { select: { id: true, name: true, avatarUrl: true } },
                    teamB: { select: { id: true, name: true, avatarUrl: true } },
                    winner: { select: { id: true, name: true } },
                },
            });
            if (match.nextMatchId && match.bracketId) {
                await this.advanceWinner(tx, match.nextMatchId, winnerId);
            }
            return finished;
        });
        await this.prisma.matchEvent.create({
            data: {
                matchId,
                type: client_1.MatchEventType.WALKOVER,
                scoreA: match.scoreTeamA,
                scoreB: match.scoreTeamB,
                team: dto.winnerTeam,
                createdBy: userId,
            },
        });
        this.emitMatchEvent(match, 'match:finish', {
            matchId,
            winnerId,
            scoreA: match.scoreTeamA,
            scoreTeamB: match.scoreTeamB,
            walkover: true,
        });
        await this.rankingService.updateStatsAfterMatch(matchId);
        await this.bracketsService.checkAndAdvanceGroupTeams(matchId).catch(() => { });
        await this.bracketsService.checkAndAdvanceRoundRobinTeams(matchId).catch(() => { });
        return updated;
    }
    async registerTimeout(matchId, userId, dto) {
        const match = await this.findMatchWithReferee(matchId, userId);
        if (match.status !== client_1.MatchStatus.IN_PROGRESS) {
            throw app_error_1.AppError.matchNotInProgress();
        }
        const currentSet = await this.prisma.matchSet.findFirst({
            where: { matchId },
            orderBy: { setNumber: 'desc' },
        });
        const teamId = dto.team === 'A' ? match.teamAId : dto.team === 'B' ? match.teamBId : null;
        const event = await this.prisma.matchEvent.create({
            data: {
                matchId,
                type: client_1.MatchEventType.TIMEOUT,
                setNumber: currentSet?.setNumber ?? null,
                teamId,
                createdBy: userId,
            },
        });
        this.emitMatchEvent(match, 'match:update', {
            matchId,
            event: {
                id: event.id,
                type: 'TIMEOUT',
                team: dto.team ?? null,
                teamId,
                setNumber: currentSet?.setNumber ?? null,
                scoreA: match.scoreTeamA,
                scoreB: match.scoreTeamB,
                createdAt: event.createdAt,
            },
        });
        return event;
    }
    async registerSubstitution(matchId, userId, dto) {
        const match = await this.findMatchWithReferee(matchId, userId);
        if (match.status !== client_1.MatchStatus.IN_PROGRESS) {
            throw app_error_1.AppError.matchNotInProgress();
        }
        if (dto.playerOutId === dto.playerInId) {
            throw app_error_1.AppError.samePlayerSubstitution();
        }
        const isTeamA = match.teamAId === dto.teamId;
        const isTeamB = match.teamBId === dto.teamId;
        if (!isTeamA && !isTeamB) {
            throw app_error_1.AppError.playerNotInTeam();
        }
        const members = await this.prisma.teamMember.findMany({
            where: {
                teamId: dto.teamId,
                userId: { in: [dto.playerOutId, dto.playerInId] },
            },
            select: { userId: true },
        });
        const memberIds = new Set(members.map((m) => m.userId));
        if (!memberIds.has(dto.playerOutId) || !memberIds.has(dto.playerInId)) {
            throw app_error_1.AppError.playerNotInTeam();
        }
        const currentSet = await this.prisma.matchSet.findFirst({
            where: { matchId },
            orderBy: { setNumber: 'desc' },
        });
        const event = await this.prisma.matchEvent.create({
            data: {
                matchId,
                type: client_1.MatchEventType.SUBSTITUTION,
                setNumber: currentSet?.setNumber ?? null,
                teamId: dto.teamId,
                playerOutId: dto.playerOutId,
                playerInId: dto.playerInId,
                createdBy: userId,
            },
        });
        const teamSide = isTeamA ? 'A' : 'B';
        this.emitMatchEvent(match, 'match:update', {
            matchId,
            event: {
                id: event.id,
                type: 'SUBSTITUTION',
                team: teamSide,
                teamId: dto.teamId,
                playerOutId: dto.playerOutId,
                playerInId: dto.playerInId,
                setNumber: currentSet?.setNumber ?? null,
                scoreA: match.scoreTeamA,
                scoreB: match.scoreTeamB,
                createdAt: event.createdAt,
            },
        });
        return event;
    }
    async findOne(matchId, _userId) {
        const match = await this.prisma.match.findUnique({
            where: { id: matchId },
            include: {
                sets: { orderBy: { setNumber: 'asc' } },
                pointEvents: { orderBy: { timestamp: 'asc' } },
                matchEvents: { orderBy: { createdAt: 'asc' } },
                teamA: { select: { id: true, name: true, avatarUrl: true } },
                teamB: { select: { id: true, name: true, avatarUrl: true } },
                winner: { select: { id: true, name: true } },
                bracket: { select: { tournamentId: true } },
                friendly: { select: { id: true, modality: true, categoryFormat: true } },
            },
        });
        if (!match) {
            throw new common_1.NotFoundException('Match not found');
        }
        return match;
    }
    async generateRefereeCode(matchId, userId) {
        const match = await this.prisma.match.findUnique({
            where: { id: matchId },
            include: { bracket: { include: { tournament: true } } },
        });
        if (!match)
            throw app_error_1.AppError.matchNotFound();
        if (!match.bracket?.tournament)
            throw app_error_1.AppError.matchNotFound();
        if (match.bracket.tournament.ownerId !== userId) {
            throw app_error_1.AppError.tournamentNotFound();
        }
        if (match.refereeCode && match.refereeCodeExpiresAt && match.refereeCodeExpiresAt > new Date()) {
            return { code: match.refereeCode, matchId };
        }
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await this.prisma.match.update({
            where: { id: matchId },
            data: { refereeCode: code, refereeCodeExpiresAt: expiresAt },
        });
        return { code, matchId };
    }
    async enterRefereeCode(userId, code) {
        const match = await this.prisma.match.findFirst({
            where: {
                refereeCode: code,
                refereeCodeExpiresAt: { gt: new Date() },
            },
            include: {
                teamA: { select: { id: true, name: true, avatarUrl: true } },
                teamB: { select: { id: true, name: true, avatarUrl: true } },
                winner: { select: { id: true, name: true, avatarUrl: true } },
                sets: { orderBy: { setNumber: 'asc' } },
                bracket: {
                    select: {
                        id: true,
                        tournamentId: true,
                        tournament: { select: { id: true, name: true, ownerId: true } },
                    },
                },
            },
        });
        if (!match) {
            throw app_error_1.AppError.invalidRefereeCode();
        }
        await this.prisma.match.update({
            where: { id: match.id },
            data: { refereeId: userId },
        });
        return { ...match, refereeId: userId };
    }
    async getTimeline(matchId) {
        const [pointEvents, matchEvents] = await Promise.all([
            this.prisma.pointEvent.findMany({
                where: { matchId },
                orderBy: { timestamp: 'asc' },
            }),
            this.prisma.matchEvent.findMany({
                where: { matchId },
                orderBy: { createdAt: 'asc' },
            }),
        ]);
        const timeline = [];
        for (const pe of pointEvents) {
            timeline.push({
                type: 'POINT',
                team: pe.scoredBy,
                setNumber: pe.setNumber,
                timestamp: pe.timestamp,
            });
        }
        for (const me of matchEvents) {
            timeline.push({
                type: me.type,
                team: me.team ?? null,
                setNumber: me.setNumber ?? null,
                scoreA: me.scoreA ?? null,
                scoreB: me.scoreB ?? null,
                timestamp: me.createdAt,
            });
        }
        timeline.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        return timeline;
    }
    async findNearby(query) {
        const { latitude, longitude, radius = 10 } = query;
        if (!latitude || !longitude) {
            return [];
        }
        const kmPerDegreeLat = 111;
        const kmPerDegreeLng = 111 * Math.cos((latitude * Math.PI) / 180);
        const latDelta = radius / kmPerDegreeLat;
        const lngDelta = radius / kmPerDegreeLng;
        const stages = await this.prisma.tournamentStage.findMany({
            where: {
                latitude: {
                    not: null,
                    gte: latitude - latDelta,
                    lte: latitude + latDelta,
                },
                longitude: {
                    not: null,
                    gte: longitude - lngDelta,
                    lte: longitude + lngDelta,
                },
            },
            select: {
                id: true,
                tournamentId: true,
                latitude: true,
                longitude: true,
                city: true,
                address: true,
            },
        });
        if (stages.length === 0)
            return [];
        const tournamentIds = [...new Set(stages.map((s) => s.tournamentId))];
        const matches = await this.prisma.match.findMany({
            where: {
                status: client_1.MatchStatus.IN_PROGRESS,
                bracket: {
                    tournamentId: { in: tournamentIds },
                },
            },
            include: {
                teamA: { select: { id: true, name: true, avatarUrl: true } },
                teamB: { select: { id: true, name: true, avatarUrl: true } },
                sets: { orderBy: { setNumber: 'asc' } },
                bracket: {
                    select: {
                        tournamentId: true,
                        tournament: {
                            select: {
                                id: true,
                                name: true,
                                stages: {
                                    where: {
                                        latitude: { not: null },
                                        longitude: { not: null },
                                    },
                                    select: {
                                        id: true,
                                        latitude: true,
                                        longitude: true,
                                        city: true,
                                        address: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        return matches.filter((match) => match.bracket !== null).map((match) => {
            const tournamentStages = match.bracket.tournament.stages;
            let minDistance = Infinity;
            let nearestStage = tournamentStages[0];
            for (const stage of tournamentStages) {
                if (stage.latitude && stage.longitude) {
                    const dist = this.haversineKm(latitude, longitude, stage.latitude, stage.longitude);
                    if (dist < minDistance) {
                        minDistance = dist;
                        nearestStage = stage;
                    }
                }
            }
            return {
                id: match.id,
                scoreTeamA: match.scoreTeamA,
                scoreTeamB: match.scoreTeamB,
                status: match.status,
                startedAt: match.startedAt,
                teamA: match.teamA,
                teamB: match.teamB,
                sets: match.sets,
                tournamentId: match.bracket.tournamentId,
                tournament: {
                    id: match.bracket.tournament.id,
                    name: match.bracket.tournament.name,
                },
                nearestStage: nearestStage
                    ? { city: nearestStage.city, address: nearestStage.address }
                    : null,
                distanceKm: Math.round(minDistance * 10) / 10,
            };
        }).filter((m) => m.distanceKm <= radius)
            .sort((a, b) => a.distanceKm - b.distanceKm);
    }
    haversineKm(lat1, lng1, lat2, lng2) {
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLng = ((lng2 - lng1) * Math.PI) / 180;
        const a = Math.sin(dLat / 2) ** 2 +
            Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLng / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
    getMatchModality(match) {
        if (match.bracket?.category?.modality) {
            return match.bracket.category.modality;
        }
        if (match.friendlyId && match.friendly?.modality) {
            return match.friendly.modality;
        }
        return undefined;
    }
    async findMatchWithReferee(matchId, userId) {
        const match = await this.prisma.match.findUnique({
            where: { id: matchId },
            include: {
                bracket: {
                    select: {
                        id: true,
                        tournamentId: true,
                        category: { select: { id: true, type: true, format: true, modality: true } },
                    },
                },
                friendly: {
                    select: {
                        id: true,
                        requesterId: true,
                        requesterTeamId: true,
                        challengedId: true,
                        challengedTeamId: true,
                        modality: true,
                        date: true,
                        startTime: true,
                    },
                },
            },
        });
        if (!match) {
            throw app_error_1.AppError.matchNotFound();
        }
        if (match.refereeId) {
            if (match.refereeId !== userId) {
                throw app_error_1.AppError.notMatchReferee();
            }
            return match;
        }
        if (!match.bracketId && match.friendlyId && match.friendly) {
            const friendly = match.friendly;
            const isRequester = friendly.requesterId === userId;
            let isRequesterTeamOwner = false;
            let isChallenged = friendly.challengedId === userId;
            let isChallengedTeamOwner = false;
            if (!isRequester && friendly.requesterTeamId) {
                isRequesterTeamOwner = await this.isTeamOwner(friendly.requesterTeamId, userId);
            }
            if (!isChallenged && friendly.challengedTeamId) {
                isChallengedTeamOwner = await this.isTeamOwner(friendly.challengedTeamId, userId);
            }
            if (isRequester || isRequesterTeamOwner || isChallenged || isChallengedTeamOwner) {
                return match;
            }
            throw app_error_1.AppError.notMatchReferee();
        }
        const tournamentId = match.bracket.tournamentId;
        const isTournamentReferee = await this.prisma.tournamentReferee.findUnique({
            where: { tournamentId_userId: { tournamentId, userId } },
        });
        if (isTournamentReferee?.codeConfirmed) {
            return match;
        }
        const tournament = await this.prisma.tournament.findUnique({
            where: { id: tournamentId },
        });
        if (!tournament || tournament.ownerId !== userId) {
            throw app_error_1.AppError.notTournamentOwner();
        }
        return match;
    }
    async findMatchWithOwnership(matchId, userId) {
        const match = await this.prisma.match.findUnique({
            where: { id: matchId },
            include: {
                bracket: {
                    select: {
                        id: true,
                        tournamentId: true,
                        category: { select: { id: true, type: true, format: true, modality: true } },
                    },
                },
                friendly: {
                    select: {
                        id: true,
                        requesterId: true,
                        requesterTeamId: true,
                        challengedId: true,
                        challengedTeamId: true,
                        modality: true,
                        date: true,
                        startTime: true,
                    },
                },
            },
        });
        if (!match) {
            throw app_error_1.AppError.matchNotFound();
        }
        if (!match.bracketId && match.friendlyId && match.friendly) {
            const friendly = match.friendly;
            const isRequester = friendly.requesterId === userId;
            let isRequesterTeamOwner = false;
            let isChallenged = friendly.challengedId === userId;
            let isChallengedTeamOwner = false;
            if (!isRequester && friendly.requesterTeamId) {
                isRequesterTeamOwner = await this.isTeamOwner(friendly.requesterTeamId, userId);
            }
            if (!isChallenged && friendly.challengedTeamId) {
                isChallengedTeamOwner = await this.isTeamOwner(friendly.challengedTeamId, userId);
            }
            if (isRequester || isRequesterTeamOwner || isChallenged || isChallengedTeamOwner) {
                return match;
            }
            throw app_error_1.AppError.notTournamentOwner();
        }
        if (!match.bracket) {
            throw app_error_1.AppError.matchNotFound();
        }
        const tournament = await this.prisma.tournament.findUnique({
            where: { id: match.bracket.tournamentId },
        });
        if (!tournament || tournament.ownerId !== userId) {
            throw app_error_1.AppError.notTournamentOwner();
        }
        return match;
    }
    async isTeamOwner(teamId, userId) {
        const team = await this.prisma.team.findUnique({ where: { id: teamId } });
        return team?.ownerId === userId;
    }
    async advanceWinner(tx, nextMatchId, winnerId) {
        const nextMatch = await tx.match.findUnique({ where: { id: nextMatchId } });
        if (!nextMatch)
            return;
        const updateData = {};
        if (!nextMatch.teamAId) {
            updateData.teamAId = winnerId;
        }
        else if (!nextMatch.teamBId) {
            updateData.teamBId = winnerId;
        }
        if (Object.keys(updateData).length > 0) {
            await tx.match.update({ where: { id: nextMatchId }, data: updateData });
        }
    }
    getWinningThreshold(modality) {
        return modality === client_1.TournamentModality.BEACH ? 21 : 25;
    }
    isWinningScore(scoreA, scoreB, modality, setNumber, bestOfSets, tiebreakScore) {
        const isTiebreakSet = bestOfSets && bestOfSets > 1 && setNumber === bestOfSets;
        const defaultThreshold = this.getWinningThreshold(modality);
        const threshold = isTiebreakSet ? (tiebreakScore ?? 15) : defaultThreshold;
        const diff = Math.abs(scoreA - scoreB);
        return (scoreA >= threshold || scoreB >= threshold) && diff >= 2;
    }
    getSetsNeededToWin(bestOfSets) {
        return Math.ceil(bestOfSets / 2);
    }
    async countSetsWon(matchId) {
        const sets = await this.prisma.matchSet.findMany({ where: { matchId } });
        let a = 0, b = 0;
        for (const s of sets) {
            if (s.scoreA > s.scoreB)
                a++;
            else if (s.scoreB > s.scoreA)
                b++;
        }
        return { a, b };
    }
};
exports.MatchesService = MatchesService;
exports.MatchesService = MatchesService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => brackets_service_1.BracketsService))),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        matches_gateway_1.MatchesGateway,
        ranking_service_1.RankingService,
        brackets_service_1.BracketsService])
], MatchesService);
//# sourceMappingURL=matches.service.js.map