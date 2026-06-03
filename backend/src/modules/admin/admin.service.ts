import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { RedisService } from '../../common/redis/redis.service';
import { AppError } from '../../common/errors/app-error';
import { QueryUsersDto } from './dto/query-users.dto';
import { QueryAdminTournamentsDto } from './dto/query-admin-tournaments.dto';
import { QueryLogsDto } from './dto/query-logs.dto';
import { QueryMetricsDto } from './dto/query-metrics.dto';
import { UpdateSystemDto } from './dto/update-system.dto';

const DASHBOARD_CACHE_KEY = 'admin:dashboard';
const DASHBOARD_CACHE_TTL = 300; // 5 minutes
const MAINTENANCE_KEY = 'system:maintenance';
const GLOBAL_MESSAGE_KEY = 'system:globalMessage';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  // ─── Dashboard ───────────────────────────────────────────

  async getDashboard() {
    const cached = await this.redis.get(DASHBOARD_CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalUsers,
      activeUsers,
      tournamentsByStatus,
      totalMatches,
      totalTeams,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({
        where: { refreshTokens: { some: { createdAt: { gte: thirtyDaysAgo } } } },
      }),
      this.prisma.tournament.groupBy({ by: ['status'], _count: { status: true } }),
      this.prisma.match.count(),
      this.prisma.team.count(),
    ]);

    const tournamentsCount: Record<string, number> = {};
    for (const row of tournamentsByStatus) {
      tournamentsCount[row.status] = row._count.status;
    }

    const result = {
      totalUsers,
      activeUsersLast30d: activeUsers,
      tournamentsByStatus: tournamentsCount,
      totalMatches,
      totalTeams,
    };

    await this.redis.set(DASHBOARD_CACHE_KEY, JSON.stringify(result), DASHBOARD_CACHE_TTL);

    return result;
  }

  // ─── User Management ─────────────────────────────────────

  async listUsers(query: QueryUsersDto) {
    const { page = 1, limit = 20, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          avatarUrl: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return { data: users, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async blockUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw AppError.userNotFound();
    if (user.status === 'BLOCKED') throw AppError.userAlreadyBlocked();

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { status: 'BLOCKED' },
      }),
      this.prisma.refreshToken.deleteMany({ where: { userId } }),
    ]);

    return { id: userId, status: 'BLOCKED' };
  }

  async unblockUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw AppError.userNotFound();
    if (user.status === 'ACTIVE') throw AppError.userAlreadyActive();

    return this.prisma.user.update({
      where: { id: userId },
      data: { status: 'ACTIVE' },
      select: { id: true, name: true, email: true, status: true },
    });
  }

  // ─── Tournament Management ───────────────────────────────

  async listTournaments(query: QueryAdminTournamentsDto) {
    const { page = 1, limit = 20, status } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;

    const [tournaments, total] = await Promise.all([
      this.prisma.tournament.findMany({
        where,
        include: {
          owner: { select: { id: true, name: true, email: true } },
          _count: { select: { registrations: true, brackets: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.tournament.count({ where }),
    ]);

    return { data: tournaments, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async blockTournament(tournamentId: string) {
    const tournament = await this.prisma.tournament.findUnique({ where: { id: tournamentId } });
    if (!tournament) throw AppError.tournamentNotFound();
    if (tournament.status === 'CANCELLED') throw AppError.tournamentAlreadyDeleted();

    return this.prisma.tournament.update({
      where: { id: tournamentId },
      data: { status: 'CANCELLED', isPublished: false },
      select: { id: true, name: true, status: true },
    });
  }

  async deleteTournament(tournamentId: string) {
    const tournament = await this.prisma.tournament.findUnique({ where: { id: tournamentId } });
    if (!tournament) throw AppError.tournamentNotFound();
    if (tournament.status === 'CANCELLED') throw AppError.tournamentAlreadyDeleted();

    // Soft delete: set status to CANCELLED, mark unpublished
    return this.prisma.tournament.update({
      where: { id: tournamentId },
      data: { status: 'CANCELLED', isPublished: false },
      select: { id: true, name: true, status: true },
    });
  }

  // ─── Error Logs ──────────────────────────────────────────

  async getLogs(query: QueryLogsDto) {
    const { level, source, from, to } = query;

    const where: any = {};
    if (level) where.level = level;
    if (source) where.source = source;
    if (from || to) {
      where.createdAt = {
        ...(from && { gte: new Date(from) }),
        ...(to && { lte: new Date(to) }),
      };
    }

    return this.prisma.adminLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  // ─── Monitoring ──────────────────────────────────────────

  async getMonitoring() {
    const [activeMatches, onlineUsers] = await Promise.all([
      this.prisma.match.count({ where: { status: 'IN_PROGRESS' } }),
      this.prisma.refreshToken.findMany({
        where: { expiresAt: { gt: new Date() } },
        select: { userId: true },
        distinct: ['userId'],
      }),
    ]);

    // WebSocket connections tracked via Redis if available
    const wsConnections = await this.redis.get('monitoring:ws_connections');
    const wsCount = wsConnections ? parseInt(wsConnections, 10) : 0;

    return {
      activeMatches,
      onlineUsers: onlineUsers.length,
      webSocketConnections: wsCount,
    };
  }

  // ─── System Control ──────────────────────────────────────

  async getSystem() {
    const [maintenanceFlag, globalMessage] = await Promise.all([
      this.redis.get(MAINTENANCE_KEY),
      this.redis.get(GLOBAL_MESSAGE_KEY),
    ]);

    return {
      maintenanceMode: maintenanceFlag === 'true',
      globalMessage: globalMessage ?? null,
      version: process.env.npm_package_version ?? '1.0.0',
    };
  }

  async updateSystem(dto: UpdateSystemDto) {
    if (dto.maintenanceMode !== undefined) {
      if (dto.maintenanceMode) {
        await this.redis.set(MAINTENANCE_KEY, 'true');
      } else {
        await this.redis.del(MAINTENANCE_KEY);
      }
    }

    if (dto.globalMessage !== undefined) {
      if (dto.globalMessage) {
        await this.redis.set(GLOBAL_MESSAGE_KEY, dto.globalMessage);
      } else {
        await this.redis.del(GLOBAL_MESSAGE_KEY);
      }
    }

    return this.getSystem();
  }

  // ─── Metrics ─────────────────────────────────────────────

  async getMetrics(query: QueryMetricsDto) {
    const { from, to } = query;

    const dateFilter: any = {};
    if (from || to) {
      dateFilter.createdAt = {
        ...(from && { gte: new Date(from) }),
        ...(to && { lte: new Date(to) }),
      };
    }

    const [
      totalUsers,
      newUsers,
      totalTournaments,
      totalMatches,
      totalRegistrations,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: dateFilter }),
      this.prisma.tournament.count({ where: dateFilter }),
      this.prisma.match.count({ where: dateFilter.createdAt ? { scheduledAt: dateFilter.createdAt } : {} }),
      this.prisma.registration.count({ where: dateFilter }),
    ]);

    return {
      totalUsers,
      newUsersInPeriod: newUsers,
      totalTournaments,
      totalMatches,
      totalRegistrations,
      period: { from: from ?? null, to: to ?? null },
    };
  }
}
