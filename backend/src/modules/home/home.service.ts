import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { TournamentStatus, RegistrationStatus, FriendlyStatus } from '@prisma/client';

@Injectable()
export class HomeService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(userId: string) {
    const [
      upcomingTournaments,
      friendliesRaw,
      acceptedFriendlies,
      unreadNotifications,
    ] = await Promise.all([
      this.getUpcomingTournaments(userId),
      this.getPendingFriendlies(userId),
      this.getAcceptedFriendlies(userId),
      this.getUnreadCount(userId),
    ]);

    const pendingFriendlies = friendliesRaw.map((f) => ({
      id: f.id,
      title: f.title,
      teamAName: f.requesterTeam?.name ?? f.requester?.name ?? '',
      teamBName: f.challengedTeam?.name ?? f.challenged?.name ?? '',
      date: f.date.toISOString(),
      status: f.status,
    }));

    return {
      upcomingTournaments,
      pendingFriendlies,
      acceptedFriendlies,
      unreadNotifications,
    };
  }

  private async getUpcomingTournaments(userId: string) {
    const activeStatus = { in: [TournamentStatus.PUBLISHED, TournamentStatus.REGISTRATION_OPEN, TournamentStatus.REGISTRATION_CLOSED, TournamentStatus.BRACKET_GENERATED, TournamentStatus.IN_PROGRESS] };
    const discoverableStatus = { in: [TournamentStatus.PUBLISHED, TournamentStatus.REGISTRATION_OPEN, TournamentStatus.REGISTRATION_CLOSED] };

    const select = {
      id: true,
      name: true,
      stages: { select: { date: true, street: true, number: true, neighborhood: true, city: true, state: true }, orderBy: { date: 'asc' as const } },
      categories: { select: { modality: true }, take: 1 },
      _count: { select: { registrations: true } },
    };

    const [registrations, created] = await Promise.all([
      this.prisma.registration.findMany({
        where: {
          userId,
          status: { in: [RegistrationStatus.CONFIRMED, RegistrationStatus.PENDING_CONFIRMATION] },
          tournament: { status: activeStatus },
        },
        select: { tournament: { select } },
        take: 20,
      }),
      this.prisma.tournament.findMany({
        where: { ownerId: userId, status: activeStatus },
        select,
        take: 20,
      }),
    ]);

    // Dedupe registered (via registration) + created (owned) into a single set
    const registeredMap = new Map<string, any>();
    for (const r of registrations) {
      const t = r.tournament;
      if (!registeredMap.has(t.id)) registeredMap.set(t.id, t);
    }
    for (const t of created) {
      if (!registeredMap.has(t.id)) registeredMap.set(t.id, t);
    }
    const registered = Array.from(registeredMap.values());

    // Non-registered, non-owned, discoverable tournaments
    const others = await this.prisma.tournament.findMany({
      where: {
        status: discoverableStatus,
        id: { notIn: registered.map((t) => t.id) },
        ownerId: { not: userId },
      },
      select,
      take: 20,
    });

    const byDateAsc = (a: any, b: any) => {
      const da = a.stages?.[0]?.date ? new Date(a.stages[0].date).getTime() : Infinity;
      const db = b.stages?.[0]?.date ? new Date(b.stages[0].date).getTime() : Infinity;
      return da - db;
    };

    registered.sort(byDateAsc);
    others.sort(byDateAsc);

    const mapTournament = (t: any, isRegistered: boolean) => {
      const s = t.stages?.[0];
      const addressParts = [s?.street, s?.number].filter(Boolean).join(', ');
      const location = [addressParts, s?.neighborhood, s?.city, s?.state].filter(Boolean).join(s?.neighborhood || addressParts ? ' — ' : '').replace(/ — /, s?.neighborhood && addressParts ? ', ' : ' — ');
      const fullLocation = [s?.street, s?.number].filter(Boolean).join(', ')
        + (s?.neighborhood ? `, ${s.neighborhood}` : '')
        + (s?.city ? ` — ${s.city}` : '')
        + (s?.state ? `/${s.state}` : '');
      return {
        id: t.id,
        name: t.name,
        startDate: s?.date?.toISOString() ?? '',
        city: s?.city ?? '',
        street: s?.street ?? '',
        number: s?.number ?? '',
        neighborhood: s?.neighborhood ?? '',
        state: s?.state ?? '',
        location: fullLocation,
        modality: t.categories?.[0]?.modality ?? '',
        registrationCount: t._count?.registrations ?? 0,
        isRegistered,
      };
    };

    return [
      ...registered.map((t) => mapTournament(t, true)),
      ...others.map((t) => mapTournament(t, false)),
    ].slice(0, 5);
  }

  private async getPendingFriendlies(userId: string) {
    const userMemberIds = await this.prisma.teamMember.findMany({
      where: { userId },
      select: { id: true },
    });
    const memberIds = userMemberIds.map((m) => m.id);

    const athleteFriendlies = await this.prisma.friendlyAthlete.findMany({
      where: { teamMemberId: { in: memberIds } },
      select: { friendlyId: true },
    });
    const friendlyIds = [...new Set(athleteFriendlies.map((a) => a.friendlyId))];

    return this.prisma.friendly.findMany({
      where: {
        status: FriendlyStatus.PENDING,
        OR: [
          { challengedId: userId },
          { id: { in: friendlyIds } },
        ],
      },
      select: {
        id: true,
        title: true,
        date: true,
        status: true,
        requester: { select: { name: true } },
        requesterTeam: { select: { name: true } },
        challenged: { select: { name: true } },
        challengedTeam: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
  }

  private async getAcceptedFriendlies(userId: string) {
    const userMemberIds = await this.prisma.teamMember.findMany({
      where: { userId },
      select: { id: true },
    });
    const memberIds = userMemberIds.map((m) => m.id);

    const athleteFriendlies = await this.prisma.friendlyAthlete.findMany({
      where: { teamMemberId: { in: memberIds } },
      select: { friendlyId: true },
    });
    const friendlyIds = [...new Set(athleteFriendlies.map((a) => a.friendlyId))];

    return this.prisma.friendly.findMany({
      where: {
        status: FriendlyStatus.ACCEPTED,
        OR: [
          { requesterId: userId },
          { challengedId: userId },
          { id: { in: friendlyIds } },
        ],
      },
      include: {
        requester: { select: { id: true, name: true, avatarUrl: true } },
        requesterTeam: { select: { id: true, name: true, avatarUrl: true } },
        challenged: { select: { id: true, name: true, avatarUrl: true } },
        challengedTeam: { select: { id: true, name: true, avatarUrl: true } },
        match: {
          select: {
            id: true,
            status: true,
            scoreTeamA: true,
            scoreTeamB: true,
            teamA: { select: { id: true, name: true } },
            teamB: { select: { id: true, name: true } },
            sets: { orderBy: { setNumber: 'asc' as const } },
          },
        },
      },
      orderBy: { date: 'asc' },
      take: 5,
    });
  }

  private async getUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: { userId, read: false },
    });
  }

  async getFeed(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { latitude: true, longitude: true },
    });

    const [newTournaments, finishedResults, confirmedFriendlies] = await Promise.all([
      this.getNewTournamentsNearby(user),
      this.getFinishedResults(userId),
      this.getConfirmedFriendlies(userId),
    ]);

    return [...newTournaments, ...finishedResults, ...confirmedFriendlies]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20);
  }

  private async getNewTournamentsNearby(user: { latitude: number | null; longitude: number | null } | null) {
    if (!user?.latitude || !user?.longitude) return [];

    const kmPerDegreeLat = 111;
    const kmPerDegreeLng = 111 * Math.cos((user.latitude * Math.PI) / 180);
    const radius = 100;
    const latDelta = radius / kmPerDegreeLat;
    const lngDelta = radius / kmPerDegreeLng;

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const tournaments = await this.prisma.tournament.findMany({
      where: {
        createdAt: { gte: weekAgo },
        status: { not: TournamentStatus.CANCELLED },
        stages: {
          some: {
            latitude: {
              gte: user.latitude - latDelta,
              lte: user.latitude + latDelta,
            },
            longitude: {
              gte: user.longitude - lngDelta,
              lte: user.longitude + lngDelta,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        stages: { select: { street: true, number: true, neighborhood: true, city: true, state: true }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return tournaments.map((t) => ({
      type: 'NEW_TOURNAMENT' as const,
      referenceId: t.id,
      title: `Novo torneio: ${t.name}`,
      subtitle: t.stages[0]?.city ? `${t.stages[0].city}, ${t.stages[0].state}` : undefined,
      timestamp: t.createdAt,
    }));
  }

  private async getFinishedResults(userId: string) {
    const registrations = await this.prisma.registration.findMany({
      where: {
        userId,
        status: RegistrationStatus.CONFIRMED,
        tournament: { status: TournamentStatus.FINISHED },
      },
      include: {
        tournament: {
          select: {
            id: true,
            name: true,
            updatedAt: true,
            brackets: {
              include: {
                matches: {
                  where: { winnerId: { not: null } },
                  include: { winner: { select: { id: true, name: true } } },
                  take: 1,
                  orderBy: { round: 'desc' },
                },
              },
              take: 1,
            },
          },
        },
      },
      take: 5,
    });

    return registrations.map((r) => ({
      type: 'TOURNAMENT_RESULT' as const,
      referenceId: r.tournament.id,
      title: `Resultado: ${r.tournament.name}`,
      subtitle: r.tournament.brackets[0]?.matches[0]?.winner?.name
        ? `Campeão: ${r.tournament.brackets[0].matches[0].winner.name}`
        : undefined,
      timestamp: r.tournament.updatedAt,
    }));
  }

  private async getConfirmedFriendlies(userId: string) {
    const friendlies = await this.prisma.friendly.findMany({
      where: {
        status: FriendlyStatus.ACCEPTED,
        OR: [{ requesterId: userId }, { challengedId: userId }],
      },
      select: {
        id: true,
        date: true,
        city: true,
        requester: { select: { name: true } },
        challenged: { select: { name: true } },
      },
      orderBy: { date: 'asc' },
      take: 5,
    });

    return friendlies.map((f) => ({
      type: 'FRIENDLY_CONFIRMED' as const,
      referenceId: f.id,
      title: `Amistoso confirmado`,
      subtitle: `${f.requester.name} vs ${f.challenged?.name || 'Time adversário'}${f.city ? ` — ${f.city}` : ''}`,
      timestamp: f.date,
    }));
  }
}
