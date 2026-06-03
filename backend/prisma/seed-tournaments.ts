import {
  PrismaClient,
  Role,
  TournamentStatus,
  TournamentType,
  TournamentFormat,
  TournamentModality,
  TournamentEventType,
  MatchStatus,
  MatchEventType,
  RegistrationStatus,
  BracketType,
  ChatType,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SEED_DOMAIN = '@seed.toqueplay.com';
const PASSWORD = '123456';

// ── Helpers ──────────────────────────────────────────────────────────────────

function mail(local: string) {
  return `${local}${SEED_DOMAIN}`;
}

async function cleanup() {
  const seedTournaments = await prisma.tournament.findMany({
    where: { name: { startsWith: '[Seed T]' } },
    select: { id: true },
  });
  const tIds = seedTournaments.map((t) => t.id);

  if (tIds.length > 0) {
    await prisma.pointEvent.deleteMany({ where: { match: { bracket: { tournamentId: { in: tIds } } } } });
    await prisma.matchEvent.deleteMany({ where: { match: { bracket: { tournamentId: { in: tIds } } } } });
    await prisma.matchSet.deleteMany({ where: { match: { bracket: { tournamentId: { in: tIds } } } } });
    await prisma.match.deleteMany({ where: { bracket: { tournamentId: { in: tIds } } } });
    await prisma.bracket.deleteMany({ where: { tournamentId: { in: tIds } } });
    await prisma.tournamentReferee.deleteMany({ where: { tournamentId: { in: tIds } } });
    await prisma.registrationMember.deleteMany({ where: { registration: { tournamentId: { in: tIds } } } });
    await prisma.registration.deleteMany({ where: { tournamentId: { in: tIds } } });
    await prisma.sponsor.deleteMany({ where: { tournamentId: { in: tIds } } });
    await prisma.athleteStats.deleteMany({ where: { tournamentId: { in: tIds } } });
    await prisma.stageFacility.deleteMany({ where: { stage: { tournamentId: { in: tIds } } } });
    await prisma.tournamentStage.deleteMany({ where: { tournamentId: { in: tIds } } });
    await prisma.tournamentCategory.deleteMany({ where: { tournamentId: { in: tIds } } });
    await prisma.tournament.deleteMany({ where: { id: { in: tIds } } });
  }

  await prisma.match.deleteMany({
    where: { friendly: { requesterTeam: { name: { startsWith: '[Seed T]' } } } },
  });
  await prisma.friendly.deleteMany({
    where: {
      OR: [
        { requesterTeam: { name: { startsWith: '[Seed T]' } } },
        { challengedTeam: { name: { startsWith: '[Seed T]' } } },
      ],
    },
  });

  const seedUsers = await prisma.user.findMany({
    where: { email: { endsWith: SEED_DOMAIN } },
    select: { id: true },
  });
  if (seedUsers.length > 0) {
    const uIds = seedUsers.map((u) => u.id);
    const seedTeamRows = await prisma.team.findMany({
      where: { name: { startsWith: '[Seed T]' } },
      select: { id: true },
    });
    const seedTeamIds = seedTeamRows.map((t) => t.id);

    const regFilter = {
      OR: [
        ...(seedTeamIds.length > 0 ? [{ teamId: { in: seedTeamIds } }] : []),
        { userId: { in: uIds } },
      ],
    };
    await prisma.registrationMember.deleteMany({ where: { registration: regFilter } });
    await prisma.registration.deleteMany({ where: regFilter });
    await prisma.chat.deleteMany({ where: { teamId: { in: seedTeamIds } } });
    await prisma.teamMember.deleteMany({ where: { teamId: { in: seedTeamIds } } });
    await prisma.team.deleteMany({ where: { id: { in: seedTeamIds } } });
    await prisma.user.deleteMany({ where: { id: { in: uIds } } });
  }
}

async function upsertUser(name: string, emailLocal: string, role: Role, hash: string) {
  return prisma.user.upsert({
    where: { email: mail(emailLocal) },
    update: { name, password: hash, role, isEmailVerified: true, isFirstAccess: false, status: 'ACTIVE' },
    create: { email: mail(emailLocal), name, password: hash, role, isEmailVerified: true, isFirstAccess: false },
  });
}

async function createTeam(name: string, ownerId: string, memberIds: string[]) {
  return prisma.team.create({
    data: {
      name,
      description: 'Time gerado pelo seed',
      sport: 'VOLEI',
      ownerId,
      members: {
        create: memberIds.map((uid, i) => ({
          userId: uid,
          isCaptain: i === 0,
          isGuest: false,
        })),
      },
    },
  });
}

async function registerTeam(
  categoryId: string,
  tournamentId: string,
  team: { id: string },
  captainUser: { id: string },
) {
  const reg = await prisma.registration.create({
    data: {
      tournamentId,
      categoryId,
      teamId: team.id,
      userId: captainUser.id,
      status: RegistrationStatus.CONFIRMED,
      paymentStatus: 'PAID',
      paymentMethod: 'SEED',
      paidAt: new Date(),
    },
  });

  const members = await prisma.teamMember.findMany({
    where: { teamId: team.id },
    select: { id: true, isCaptain: true },
  });

  await prisma.registrationMember.createMany({
    data: members.map((m) => ({
      registrationId: reg.id,
      teamMemberId: m.id,
      isCaptain: m.isCaptain,
    })),
  });

  return reg;
}

/** Helper: create a full tournament with stages + category + registrations + bracket + matches */
async function createBracketTournament(opts: {
  name: string;
  description: string;
  bracketType: BracketType;
  teams: { id: string; captainId: string }[];
  groupsCount?: number;
  teamsPerGroup?: number;
  teamsAdvancing?: number;
  organizerId: string;
  today: Date;
  latitude?: number;
  longitude?: number;
  address?: string;
  city?: string;
}) {
  const { name, description, bracketType, teams, organizerId, today } = opts;

  // Stage date = today (so bracket generation is allowed)
  const stageDate = today;

  const tournament = await prisma.tournament.create({
    data: {
      name: `[Seed T] ${name}`,
      description,
      eventType: TournamentEventType.SINGLE,
      status: TournamentStatus.BRACKET_GENERATED,
      isPublished: true,
      ownerId: organizerId,
      categories: {
        create: {
          type: TournamentType.MALE,
          format: TournamentFormat.PAIR,
          modality: TournamentModality.BEACH,
          minMembers: 2,
          maxMembers: 2,
          registrationPrice: 0,
          bracketType,
          groupsCount: opts.groupsCount ?? null,
          teamsPerGroup: opts.teamsPerGroup ?? null,
          teamsAdvancing: opts.teamsAdvancing ?? null,
        },
      },
      stages: {
        create: {
          name: 'Arena Seed',
          date: stageDate,
          startTime: new Date(stageDate.getTime() + 8 * 3600000),
          city: opts.city ?? 'Seed City',
          state: 'RS',
          address: opts.address ?? 'Rua do Seed',
          latitude: opts.latitude ?? null,
          longitude: opts.longitude ?? null,
          maxTeams: teams.length + 10,
        },
      },
    },
    include: { categories: true },
  });

  const cat = tournament.categories[0];

  // Register all teams
  for (const t of teams) {
    await registerTeam(cat.id, tournament.id, t, { id: t.captainId });
  }

  // Create bracket
  const bracket = await prisma.bracket.create({
    data: {
      tournamentId: tournament.id,
      categoryId: cat.id,
      type: bracketType,
    },
  });

  return { tournament, category: cat, bracket };
}

/** Generate single elimination matches */
async function seedSingleElimination(
  bracketId: string,
  teamIds: string[],
) {
  const shuffled = [...teamIds].sort(() => Math.random() - 0.5);
  const numTeams = shuffled.length;
  const numRounds = Math.ceil(Math.log2(numTeams));

  const matchMap = new Map<string, string>();

  // Create matches from final (highest round) to first round (round 1)
  // Round numRounds = final (1 match), Round 1 = first round (most matches)
  for (let round = numRounds; round >= 1; round--) {
    const matchesInRound = Math.pow(2, numRounds - round);

    for (let pos = 0; pos < matchesInRound; pos++) {
      const nextRoundKey = round < numRounds ? `${round + 1}-${Math.floor(pos / 2)}` : null;

      const matchData: any = {
        bracketId,
        round,
        position: pos,
        status: MatchStatus.SCHEDULED,
      };

      if (nextRoundKey && matchMap.has(nextRoundKey)) {
        matchData.nextMatchId = matchMap.get(nextRoundKey);
      }

      if (round === 1) {
        const teamAIndex = pos * 2;
        const teamBIndex = pos * 2 + 1;
        if (teamAIndex < shuffled.length) matchData.teamAId = shuffled[teamAIndex];
        if (teamBIndex < shuffled.length) matchData.teamBId = shuffled[teamBIndex];
      }

      const match = await prisma.match.create({ data: matchData });
      matchMap.set(`${round}-${pos}`, match.id);

      // Walkover if only one team
      if (round === 1 && matchData.teamAId && !matchData.teamBId && matchData.nextMatchId) {
        const nextId = matchMap.get(`${round + 1}-${Math.floor(pos / 2)}`) || matchData.nextMatchId;
        const nextMatch = await prisma.match.findUnique({ where: { id: nextId } });
        if (nextMatch) {
          const upd: any = {};
          if (!nextMatch.teamAId) upd.teamAId = matchData.teamAId;
          else if (!nextMatch.teamBId) upd.teamBId = matchData.teamAId;
          if (Object.keys(upd).length > 0) await prisma.match.update({ where: { id: nextId }, data: upd });
        }
        await prisma.match.update({
          where: { id: match.id },
          data: { status: MatchStatus.WALKOVER, winnerId: matchData.teamAId },
        });
      }
    }
  }
}

/** Generate round-robin matches */
async function seedRoundRobin(
  bracketId: string,
  teamIds: string[],
) {
  const numTeams = teamIds.length;
  let round = 1;
  let position = 0;
  const matchesPerRound = Math.floor(numTeams / 2);

  for (let i = 0; i < teamIds.length; i++) {
    for (let j = i + 1; j < teamIds.length; j++) {
      if (matchesPerRound > 0 && position >= matchesPerRound) {
        round++;
        position = 0;
      }
      await prisma.match.create({
        data: {
          bracketId,
          round,
          position,
          status: MatchStatus.SCHEDULED,
          teamAId: teamIds[i],
          teamBId: teamIds[j],
        },
      });
      position++;
    }
  }
}

/** Generate groups + elimination matches */
async function seedGroupsThenElimination(
  bracketId: string,
  teamIds: string[],
  config: { groupsCount?: number; teamsPerGroup?: number; teamsAdvancing?: number },
) {
  const numTeams = teamIds.length;
  const shuffled = [...teamIds].sort(() => Math.random() - 0.5);

  // Defaults: max 5 per group, top 3 advance
  let teamsPerGroup = config.teamsPerGroup ?? 5;
  if (config.groupsCount) {
    teamsPerGroup = Math.ceil(numTeams / config.groupsCount);
  }
  const groupsCount = Math.max(2, Math.ceil(numTeams / teamsPerGroup));
  const actualTeamsPerGroup = Math.ceil(numTeams / groupsCount);

  let teamsAdvancing = config.teamsAdvancing ?? 3;
  if (actualTeamsPerGroup <= 3) teamsAdvancing = actualTeamsPerGroup;

  const needsElimination = teamsAdvancing < actualTeamsPerGroup;

  // Distribute teams
  const groups: string[][] = Array.from({ length: groupsCount }, () => []);
  for (let i = 0; i < shuffled.length; i++) {
    groups[i % groupsCount].push(shuffled[i]);
  }

  // Group phase: round-robin per group
  for (let groupIdx = 0; groupIdx < groups.length; groupIdx++) {
    const gTeams = groups[groupIdx];
    let round = 1;
    let position = 0;
    const mpr = Math.floor(gTeams.length / 2);

    for (let i = 0; i < gTeams.length; i++) {
      for (let j = i + 1; j < gTeams.length; j++) {
        if (mpr > 0 && position >= mpr) { round++; position = 0; }
        await prisma.match.create({
          data: {
            bracketId, round, position,
            status: MatchStatus.SCHEDULED,
            teamAId: gTeams[i],
            teamBId: gTeams[j],
            group: groupIdx,
          },
        });
        position++;
      }
    }
  }

  // Elimination phase
  if (needsElimination) {
    const totalAdvancing = groupsCount * teamsAdvancing;
    const numRounds = Math.ceil(Math.log2(totalAdvancing));
    const matchMap = new Map<string, string>();
    const offset = 100;

    for (let round = numRounds; round >= 1; round--) {
      const matchesInRound = Math.pow(2, round - 1);
      for (let pos = 0; pos < matchesInRound; pos++) {
        const nextRoundKey = round < numRounds ? `${round + 1}-${Math.floor(pos / 2)}` : null;
        const matchData: any = {
          bracketId,
          round: round + offset,
          position: pos,
          status: MatchStatus.SCHEDULED,
          group: null,
        };
        if (nextRoundKey && matchMap.has(nextRoundKey)) {
          matchData.nextMatchId = matchMap.get(nextRoundKey);
        }
        const m = await prisma.match.create({ data: matchData });
        matchMap.set(`${round}-${pos}`, m.id);
      }
    }
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Seeding tournaments...\n');

  const hash = await bcrypt.hash(PASSWORD, 10);
  await cleanup();

  const organizer = await upsertUser('Carlos Organizador', 'tournament.organizer', Role.ORGANIZADOR, hash);

  // 80 athletes for all bracket scenarios
  const athletes: any[] = [];
  for (let i = 1; i <= 80; i++) {
    athletes.push(
      await upsertUser(`Atleta Seed ${String(i).padStart(2, '0')}`, `tournament.a${i}`, Role.ATLETA, hash),
    );
  }

  // Helper: create dupla teams from athlete pairs
  async function makeTeams(prefix: string, count: number, startAthlete: number) {
    const teams: { id: string; captainId: string }[] = [];
    for (let i = 0; i < count; i++) {
      const a1 = athletes[startAthlete + i * 2 - 1]; // -1 because athletes array is 0-indexed, athletes start at a1
      const a2 = athletes[startAthlete + i * 2];
      const team = await createTeam(
        `[Seed T] ${prefix} ${String(i + 1).padStart(2, '0')}`,
        a1.id,
        [a1.id, a2.id],
      );
      teams.push({ id: team.id, captainId: a1.id });
    }
    return teams;
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // ═══════════════════════════════════════════════════════════════════════════
  // T1: REGISTRATION_OPEN — Beach Dupla Masc + Misto (multi-category)
  // ═══════════════════════════════════════════════════════════════════════════
  const t1teams = await makeTeams('Dupla', 2, 1);
  const t1 = await prisma.tournament.create({
    data: {
      name: '[Seed T] Arena Beach Volley Open',
      description: 'Inscrições abertas. Dupla Masc e Misto!',
      imageUrl: 'https://images.unsplash.com/photo-1614294149010-950b698f72c0?w=600',
      eventType: TournamentEventType.SINGLE,
      status: TournamentStatus.REGISTRATION_OPEN,
      isPublished: true,
      ownerId: organizer.id,
      categories: {
        create: [
          {
            type: TournamentType.MALE, format: TournamentFormat.PAIR, modality: TournamentModality.BEACH,
            minMembers: 2, maxMembers: 2, registrationPrice: 150.00,
            registrationDeadline: new Date(today.getTime() + 1 * 86400000),
          },
          {
            type: TournamentType.MIX, format: TournamentFormat.PAIR, modality: TournamentModality.BEACH,
            minMembers: 2, maxMembers: 2, registrationPrice: 120.00,
            registrationDeadline: new Date(today.getTime() + 1 * 86400000),
          },
        ],
      },
      stages: {
        create: {
          name: 'Etapa Única',
          date: today,
          startTime: new Date(today.getTime() + 8 * 3600000),
          city: 'Florianópolis', state: 'SC', address: 'Praia da Barra da Lagoa',
          latitude: -27.5736, longitude: -48.4247, maxTeams: 16,
        },
      },
    },
    include: { categories: true },
  });
  await registerTeam(t1.categories[0].id, t1.id, t1teams[0], { id: t1teams[0].captainId });
  await registerTeam(t1.categories[1].id, t1.id, t1teams[1], { id: t1teams[1].captainId });
  console.log('T1: REGISTRATION_OPEN (multi-cat)');

  // ═══════════════════════════════════════════════════════════════════════════
  // T2: IN_PROGRESS — Beach Dupla (LIVE MATCH)
  // ═══════════════════════════════════════════════════════════════════════════
  const t2teams = await makeTeams('Live', 3, 5);
  const t2 = await prisma.tournament.create({
    data: {
      name: '[Seed T] Beach Arena Live',
      description: 'Torneio em andamento com partida ao vivo!',
      eventType: TournamentEventType.SINGLE,
      status: TournamentStatus.IN_PROGRESS,
      isPublished: true,
      ownerId: organizer.id,
      categories: {
        create: {
          type: TournamentType.MALE, format: TournamentFormat.PAIR, modality: TournamentModality.BEACH,
          minMembers: 2, maxMembers: 2, registrationPrice: 200.00,
        },
      },
      stages: {
        create: {
          name: 'Arena Principal', date: today,
          startTime: new Date(today.getTime() + 8 * 3600000),
          city: 'Sapucaia do Sul', state: 'RS', address: 'Arena Centro', maxTeams: 8,
        },
      },
    },
    include: { categories: true },
  });
  for (const t of t2teams) await registerTeam(t2.categories[0].id, t2.id, t, { id: t.captainId });

  const bracket2 = await prisma.bracket.create({
    data: { tournamentId: t2.id, categoryId: t2.categories[0].id, type: BracketType.SINGLE_ELIMINATION },
  });
  // LIVE match
  await prisma.match.create({
    data: {
      bracketId: bracket2.id, round: 1, position: 0,
      status: MatchStatus.IN_PROGRESS,
      teamAId: t2teams[0].id, teamBId: t2teams[1].id,
      scoreTeamA: 1, scoreTeamB: 0,
      startedAt: new Date(now.getTime() - 25 * 60000),
      sets: { create: [{ setNumber: 1, scoreA: 21, scoreB: 18 }] },
    },
  });
  // Scheduled match
  await prisma.match.create({
    data: {
      bracketId: bracket2.id, round: 1, position: 1,
      status: MatchStatus.SCHEDULED, teamAId: t2teams[2].id,
    },
  });
  // Final
  await prisma.match.create({
    data: { bracketId: bracket2.id, round: 2, position: 0, status: MatchStatus.SCHEDULED },
  });
  console.log('T2: IN_PROGRESS (LIVE MATCH)');

  // ═══════════════════════════════════════════════════════════════════════════
  // T3: BRACKET_GENERATED — 4 times, SINGLE_ELIMINATION
  // Test: small tournament, semis + final
  // ═══════════════════════════════════════════════════════════════════════════
  const t3teams = await makeTeams('SE4', 4, 11);
  const t3 = await createBracketTournament({
    name: 'Mata-mata 4 Times',
    description: '4 times, eliminação direta. Semifinal → Final.',
    bracketType: BracketType.SINGLE_ELIMINATION,
    teams: t3teams,
    organizerId: organizer.id,
    today,
  });
  await seedSingleElimination(t3.bracket.id, t3teams.map(t => t.id));
  console.log('T3: BRACKET_GENERATED — 4 times SINGLE_ELIMINATION');

  // ═══════════════════════════════════════════════════════════════════════════
  // T4: BRACKET_GENERATED — 4 times, ROUND_ROBIN
  // Test: pontos corridos puro, todos contra todos
  // ═══════════════════════════════════════════════════════════════════════════
  const t4teams = await makeTeams('RR4', 4, 19);
  const t4 = await createBracketTournament({
    name: 'Pontos Corridos 4 Times',
    description: '4 times, todos contra todos. Classificação define campeão.',
    bracketType: BracketType.ROUND_ROBIN,
    teams: t4teams,
    organizerId: organizer.id,
    today,
  });
  await seedRoundRobin(t4.bracket.id, t4teams.map(t => t.id));
  console.log('T4: BRACKET_GENERATED — 4 times ROUND_ROBIN');

  // ═══════════════════════════════════════════════════════════════════════════
  // T5: IN_PROGRESS — 8 times, SINGLE_ELIMINATION (1 live match on home)
  // ═══════════════════════════════════════════════════════════════════════════
  const t5teams = await makeTeams('SE8', 8, 27);
  const t5 = await createBracketTournament({
    name: 'Mata-mata 8 Times',
    description: '8 times, eliminação direta. Quartas → Semi → Final.',
    bracketType: BracketType.SINGLE_ELIMINATION,
    teams: t5teams,
    organizerId: organizer.id,
    today,
    latitude: -29.8293105,
    longitude: -51.1485954,
    address: 'R. Laurentino Juliano, 204 - Paraíso, Sapucaia do Sul - RS',
    city: 'Sapucaia do Sul',
  });
  await seedSingleElimination(t5.bracket.id, t5teams.map(t => t.id));

  // Start tournament + first match live with points
  await prisma.tournament.update({ where: { id: t5.tournament.id }, data: { status: TournamentStatus.IN_PROGRESS } });
  const t5matches = await prisma.match.findMany({
    where: { bracketId: t5.bracket.id, round: 1 },
    orderBy: { position: 'asc' },
  });
  const t5live = t5matches[0];
  if (t5live) {
    await prisma.match.update({
      where: { id: t5live.id },
      data: { status: MatchStatus.IN_PROGRESS, startedAt: new Date() },
    });
    await prisma.matchSet.create({ data: { matchId: t5live.id, setNumber: 1, scoreA: 8, scoreB: 5 } });
    // Point events for the timeline
    for (let i = 0; i < 8; i++) {
      await prisma.pointEvent.create({ data: { matchId: t5live.id, setNumber: 1, scoredBy: 'A' } });
    }
    for (let i = 0; i < 5; i++) {
      await prisma.pointEvent.create({ data: { matchId: t5live.id, setNumber: 1, scoredBy: 'B' } });
    }
    await prisma.match.update({
      where: { id: t5live.id },
      data: { scoreTeamA: 8, scoreTeamB: 5 },
    });
    await prisma.matchEvent.create({
      data: { matchId: t5live.id, type: MatchEventType.MATCH_START, setNumber: 1, createdBy: organizer.id },
    });
  }
  console.log('T5: IN_PROGRESS — 8 times, 1 live match (8x5)');

  // ═══════════════════════════════════════════════════════════════════════════
  // T6: BRACKET_GENERATED — 5 times, SINGLE_ELIMINATION
  // Test: ímpar → byes automáticos (5 times, 1 bye no round 1)
  // ═══════════════════════════════════════════════════════════════════════════
  const t6teams = await makeTeams('SE5', 5, 43);
  const t6 = await createBracketTournament({
    name: 'Mata-mata 5 Times (Ímpar)',
    description: '5 times, mata-mata. 1 time com bye no round 1.',
    bracketType: BracketType.SINGLE_ELIMINATION,
    teams: t6teams,
    organizerId: organizer.id,
    today,
  });
  await seedSingleElimination(t6.bracket.id, t6teams.map(t => t.id));
  console.log('T6: BRACKET_GENERATED — 5 times SINGLE_ELIMINATION (ímpar)');

  // ═══════════════════════════════════════════════════════════════════════════
  // T7: BRACKET_GENERATED — 6 times, ROUND_ROBIN
  // Test: 6 times pontos corridos (15 jogos)
  // ═══════════════════════════════════════════════════════════════════════════
  // Reuse athletes 1-12 for remaining tournaments (they can register in multiple)
  const t7teams = await makeTeams('RR6', 6, 49);
  // Need more athletes — we only have 60, used up to athlete 52
  // Let's reuse athletes from earlier — each athlete can be in multiple teams for different tournaments
  const t7 = await createBracketTournament({
    name: 'Pontos Corridos 6 Times',
    description: '6 times, todos contra todos. 15 jogos.',
    bracketType: BracketType.ROUND_ROBIN,
    teams: t7teams,
    organizerId: organizer.id,
    today,
  });
  await seedRoundRobin(t7.bracket.id, t7teams.map(t => t.id));
  console.log('T7: BRACKET_GENERATED — 6 times ROUND_ROBIN');

  // ═══════════════════════════════════════════════════════════════════════════
  // T8: BRACKET_GENERATED — 12 times, GROUPS_THEN_ELIMINATION (defaults)
  // Test: 3 grupos de 4, top 3 avançam → 9 no mata-mata
  // ═══════════════════════════════════════════════════════════════════════════
  const t8teams = await makeTeams('GE12', 12, 1); // reuse athletes 1-24 (new teams)
  const t8 = await createBracketTournament({
    name: 'Grupos 12 Times (Default)',
    description: '12 times, fase de grupos + mata-mata. Default: 3 grupos de 4, top 3 avançam.',
    bracketType: BracketType.GROUPS_THEN_ELIMINATION,
    teams: t8teams,
    teamsPerGroup: 4,
    teamsAdvancing: 3,
    organizerId: organizer.id,
    today,
  });
  await seedGroupsThenElimination(t8.bracket.id, t8teams.map(t => t.id), {
    teamsPerGroup: 4,
    teamsAdvancing: 3,
  });
  console.log('T8: BRACKET_GENERATED — 12 times GROUPS_THEN_ELIMINATION (3x4, top 3)');

  // ═══════════════════════════════════════════════════════════════════════════
  // T9: BRACKET_GENERATED — 13 times, GROUPS_THEN_ELIMINATION (2 groups)
  // Test: 13 times → 2 grupos (7+6), top 3 avançam → 6 no mata-mata
  // ═══════════════════════════════════════════════════════════════════════════
  const t9teams = await makeTeams('GE13', 13, 25);
  const t9 = await createBracketTournament({
    name: 'Grupos 13 Times (Desigual)',
    description: '13 times, 2 grupos (7+6), top 3 avançam → 6 no mata-mata.',
    bracketType: BracketType.GROUPS_THEN_ELIMINATION,
    teams: t9teams,
    groupsCount: 2,
    teamsAdvancing: 3,
    organizerId: organizer.id,
    today,
  });
  await seedGroupsThenElimination(t9.bracket.id, t9teams.map(t => t.id), {
    groupsCount: 2,
    teamsAdvancing: 3,
  });
  console.log('T9: BRACKET_GENERATED — 13 times GROUPS_THEN_ELIMINATION (2 grupos 7+6)');

  // ═══════════════════════════════════════════════════════════════════════════
  // T10: BRACKET_GENERATED — 6 times, GROUPS_THEN_ELIMINATION (3 per group)
  // Test: 2 grupos de 3 → todos avançam (sem eliminação)
  // ═══════════════════════════════════════════════════════════════════════════
  const t10teams = await makeTeams('GE6', 6, 51);
  const t10 = await createBracketTournament({
    name: 'Grupos 6 Times (Todos Avançam)',
    description: '6 times, 2 grupos de 3. Todos avançam (só fase de grupos).',
    bracketType: BracketType.GROUPS_THEN_ELIMINATION,
    teams: t10teams,
    teamsPerGroup: 3,
    organizerId: organizer.id,
    today,
  });
  await seedGroupsThenElimination(t10.bracket.id, t10teams.map(t => t.id), {
    teamsPerGroup: 3,
  });
  console.log('T10: BRACKET_GENERATED — 6 times GROUPS_THEN_ELIMINATION (3/grupo, todos avançam)');

  // ═══════════════════════════════════════════════════════════════════════════
  // T11: BRACKET_GENERATED — 16 times, GROUPS_THEN_ELIMINATION (defaults)
  // Test: 16 times, 4 grupos de 4, top 3 avançam → 12 no mata-mata
  // ═══════════════════════════════════════════════════════════════════════════
  const t11teams = await makeTeams('GE16', 16, 29);
  const t11 = await createBracketTournament({
    name: 'Grupos 16 Times (Grande)',
    description: '16 times, 4 grupos de 4, top 3 avançam → 12 no mata-mata.',
    bracketType: BracketType.GROUPS_THEN_ELIMINATION,
    teams: t11teams,
    teamsPerGroup: 4,
    teamsAdvancing: 3,
    organizerId: organizer.id,
    today,
  });
  await seedGroupsThenElimination(t11.bracket.id, t11teams.map(t => t.id), {
    teamsPerGroup: 4,
    teamsAdvancing: 3,
  });
  console.log('T11: BRACKET_GENERATED — 16 times GROUPS_THEN_ELIMINATION (4x4, top 3)');

  // ═══════════════════════════════════════════════════════════════════════════
  // REFEREES — 3 arbitros usando atletas livres (a63-a65)
  // ═══════════════════════════════════════════════════════════════════════════
  const referee1 = athletes[62]; // a63
  const referee2 = athletes[63]; // a64
  const referee3 = athletes[64]; // a65

  // Arbitro 1 → T2 (live), T3, T5
  await prisma.tournamentReferee.createMany({
    data: [
      { tournamentId: t2.id, userId: referee1.id, codeConfirmed: false },
      { tournamentId: t3.tournament.id, userId: referee1.id, codeConfirmed: false },
      { tournamentId: t5.tournament.id, userId: referee1.id, codeConfirmed: false },
    ],
    skipDuplicates: true,
  });

  // Arbitro 2 → T4, T6, T7
  await prisma.tournamentReferee.createMany({
    data: [
      { tournamentId: t4.tournament.id, userId: referee2.id, codeConfirmed: false },
      { tournamentId: t6.tournament.id, userId: referee2.id, codeConfirmed: false },
      { tournamentId: t7.tournament.id, userId: referee2.id, codeConfirmed: false },
    ],
    skipDuplicates: true,
  });

  // Arbitro 3 → T8, T9, T10, T11 (grandes)
  await prisma.tournamentReferee.createMany({
    data: [
      { tournamentId: t8.tournament.id, userId: referee3.id, codeConfirmed: false },
      { tournamentId: t9.tournament.id, userId: referee3.id, codeConfirmed: false },
      { tournamentId: t10.tournament.id, userId: referee3.id, codeConfirmed: false },
      { tournamentId: t11.tournament.id, userId: referee3.id, codeConfirmed: false },
    ],
    skipDuplicates: true,
  });

  console.log('Arbitros: 3 arbitros vinculados aos torneios');

  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n✅ Seed concluído!\n');
  console.log('═══ LOGINS ═══');
  console.log(`Organizador: ${mail('tournament.organizer')} / ${PASSWORD}`);
  console.log(`Atleta 01: ${mail('tournament.a1')} / ${PASSWORD}`);
  console.log(`Atleta 10: ${mail('tournament.a10')} / ${PASSWORD}`);
  console.log(`Arbitro 1: ${mail('tournament.a63')} / ${PASSWORD} → T2, T3, T5`);
  console.log(`Arbitro 2: ${mail('tournament.a64')} / ${PASSWORD} → T4, T6, T7`);
  console.log(`Arbitro 3: ${mail('tournament.a65')} / ${PASSWORD} → T8, T9, T10, T11`);
  console.log('');
  console.log('═══ TORNEIOS ═══');
  console.log('T1:  REGISTRATION_OPEN      — Beach Dupla Masc + Misto');
  console.log('T2:  IN_PROGRESS            — Beach Dupla (LIVE MATCH)');
  console.log('T3:  BRACKET_GENERATED      — 4 times, MATA-MATA (semis + final)');
  console.log('T4:  BRACKET_GENERATED      — 4 times, PONTOS CORRIDOS');
  console.log('T5:  BRACKET_GENERATED      — 8 times, MATA-MATA (quartas → semi → final)');
  console.log('T6:  BRACKET_GENERATED      — 5 times, MATA-MATA (ímpar, bye)');
  console.log('T7:  BRACKET_GENERATED      — 6 times, PONTOS CORRIDOS (15 jogos)');
  console.log('T8:  BRACKET_GENERATED      — 12 times, GRUPOS 3x4, top 3 → 9 no mata-mata');
  console.log('T9:  BRACKET_GENERATED      — 13 times, GRUPOS 2 (7+6), top 3 → 6 no mata-mata');
  console.log('T10: BRACKET_GENERATED      — 6 times, GRUPOS 2x3, todos avançam (só grupos)');
  console.log('T11: BRACKET_GENERATED      — 16 times, GRUPOS 4x4, top 3 → 12 no mata-mata');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
