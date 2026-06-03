import { PrismaClient, Role, BracketType, TournamentStatus, RegistrationStatus, MatchStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// ─── Athletes ─────────────────────────────────────────────

const SDT_ATHLETES = [
  { name: 'Paixão', email: 'paixao@toqueplay.com' },
  { name: 'Linck', email: 'linck@toqueplay.com' },
  { name: 'Vargas', email: 'vargas@toqueplay.com' },
  { name: 'Pietro', email: 'pietro@toqueplay.com' },
  { name: 'Vini', email: 'vini@toqueplay.com' },
  { name: 'Deiv', email: 'deiv@toqueplay.com' },
  { name: 'Prass', email: 'prass@toqueplay.com' },
  { name: 'Eduardo', email: 'eduardo@toqueplay.com' },
  { name: 'Nicolas', email: 'nicolas@toqueplay.com' },
];

function makeGenericAthletes(teamPrefix: string, count: number) {
  return Array.from({ length: count }, (_, i) => ({
    name: `Atleta ${i + 1} ${teamPrefix}`,
    email: `atleta${i + 1}.${teamPrefix.toLowerCase().replace(/\s/g, '')}@toqueplay.com`,
  }));
}

const VR_ATHLETES = makeGenericAthletes('VR', 8);
const US_ATHLETES = makeGenericAthletes('US', 8);
const SM_ATHLETES = makeGenericAthletes('SM', 8);

const ALL_ATHLETES = [...SDT_ATHLETES, ...VR_ATHLETES, ...US_ATHLETES, ...SM_ATHLETES];

const TEAMS = [
  { name: 'Só Dois Toques', athletes: SDT_ATHLETES, captainIdx: 0 },
  { name: 'Vôlei Raiz', athletes: VR_ATHLETES, captainIdx: 0 },
  { name: 'Ultra Seven', athletes: US_ATHLETES, captainIdx: 0 },
  { name: 'Sierra Madre', athletes: SM_ATHLETES, captainIdx: 0 },
];

async function main() {
  const passwordHash = await bcrypt.hash('123456', 10);

  // ─── 1. Create organizador ───────────────────────────────
  const organizador = await prisma.user.upsert({
    where: { email: 'organizador@toqueplay.com' },
    update: {},
    create: {
      email: 'organizador@toqueplay.com',
      name: 'Organizador Teste',
      password: passwordHash,
      role: Role.ORGANIZADOR,
      isEmailVerified: true,
      isFirstAccess: false,
    },
  });
  console.log('Organizador OK');

  // ─── 2. Create all athlete users ─────────────────────────
  const userIds: Record<string, string> = {};
  for (const a of ALL_ATHLETES) {
    const user = await prisma.user.upsert({
      where: { email: a.email },
      update: {},
      create: {
        email: a.email,
        name: a.name,
        password: passwordHash,
        role: Role.ATLETA,
        isEmailVerified: true,
        isFirstAccess: false,
      },
    });
    userIds[a.email] = user.id;
  }
  console.log(`${ALL_ATHLETES.length} atletas OK`);

  // ─── 3. Create teams with members ────────────────────────
  const teamIds: string[] = [];
  for (const t of TEAMS) {
    const captainEmail = t.athletes[t.captainIdx].email;
    const captainId = userIds[captainEmail];

    const existing = await prisma.team.findFirst({ where: { name: t.name, ownerId: captainId } });
    if (existing) {
      teamIds.push(existing.id);
      console.log(`  Time "${t.name}" já existe`);
      continue;
    }

    const team = await prisma.team.create({
      data: {
        name: t.name,
        ownerId: captainId,
        members: {
          create: t.athletes.map((a, idx) => ({
            userId: userIds[a.email],
            isCaptain: idx === t.captainIdx,
          })),
        },
      },
    });
    teamIds.push(team.id);
    console.log(`  Time "${t.name}" criado`);
  }

  // teamIds[0] = Só Dois Toques
  // teamIds[1] = Vôlei Raiz
  // teamIds[2] = Ultra Seven
  // teamIds[3] = Sierra Madre

  // ─── 4. Create tournament ────────────────────────────────
  const stageDate = new Date();
  stageDate.setDate(stageDate.getDate() + 10);
  stageDate.setHours(8, 0, 0, 0);

  const tournament = await prisma.tournament.create({
    data: {
      name: 'Copa ToquePlay Teste',
      description: 'Torneio de teste para validação do app',
      eventType: 'SINGLE',
      status: TournamentStatus.BRACKET_GENERATED,
      isPublished: true,
      ownerId: organizador.id,
      stages: {
        create: {
          date: stageDate,
          startTime: new Date(stageDate.getTime()),
          maxTeams: 4,
          city: 'Sapucaia do Sul',
          state: 'RS',
          street: 'R. Maj. de Souza Lima',
          number: '467',
          neighborhood: 'São José',
          cep: '93218-240',
          latitude: -29.813966,
          longitude: -51.1433373,
        },
      },
      categories: {
        create: {
          type: 'MALE',
          format: 'SEXTET',
          modality: 'COURT',
          minMembers: 6,
          maxMembers: 9,
        },
      },
    },
    include: { stages: true, categories: true },
  });

  const stage = tournament.stages[0];
  const category = tournament.categories[0];
  console.log(`Torneio "${tournament.name}" criado (${tournament.id})`);

  // ─── 5. Register teams ──────────────────────────────────
  for (let i = 0; i < TEAMS.length; i++) {
    const captainEmail = TEAMS[i].athletes[TEAMS[i].captainIdx].email;
    const captainUserId = userIds[captainEmail];

    // Get team members for registration members
    const teamMembers = await prisma.teamMember.findMany({
      where: { teamId: teamIds[i] },
    });

    await prisma.registration.create({
      data: {
        tournamentId: tournament.id,
        categoryId: category.id,
        teamId: teamIds[i],
        userId: captainUserId,
        status: RegistrationStatus.CONFIRMED,
        members: {
          create: teamMembers.map((tm) => ({
            teamMemberId: tm.id,
            isCaptain: tm.isCaptain,
          })),
        },
      },
    });
  }
  console.log('4 inscrições confirmadas');

  // ─── 6. Create bracket with matches ──────────────────────
  const bracket = await prisma.bracket.create({
    data: {
      tournamentId: tournament.id,
      categoryId: category.id,
      type: BracketType.ROUND_ROBIN,
    },
  });
  console.log(`Bracket criado (${bracket.id})`);

  // Matchups
  const SDT = teamIds[0]; // Só Dois Toques
  const VR = teamIds[1];  // Vôlei Raiz
  const US = teamIds[2];  // Ultra Seven
  const SM = teamIds[3];  // Sierra Madre

  // Round Robin rounds
  const roundRobinMatches = [
    // Rodada 1
    { round: 1, position: 0, teamA: SDT, teamB: SM },
    { round: 1, position: 1, teamA: VR, teamB: US },
    // Rodada 2
    { round: 2, position: 0, teamA: SDT, teamB: US },
    { round: 2, position: 1, teamA: VR, teamB: SM },
    // Rodada 3
    { round: 3, position: 0, teamA: SDT, teamB: VR },
    { round: 3, position: 1, teamA: US, teamB: SM },
  ];

  const matchIds: string[] = [];
  for (const m of roundRobinMatches) {
    const match = await prisma.match.create({
      data: {
        bracketId: bracket.id,
        round: m.round,
        position: m.position,
        status: MatchStatus.SCHEDULED,
        teamAId: m.teamA,
        teamBId: m.teamB,
      },
    });
    matchIds.push(match.id);
  }

  // Finais: 3º lugar (round 4, position 0) e Final (round 4, position 1)
  // Teams TBD — will be determined after round robin
  const thirdPlace = await prisma.match.create({
    data: {
      bracketId: bracket.id,
      round: 4,
      position: 0,
      status: MatchStatus.SCHEDULED,
      // teams TBD
    },
  });

  const finalMatch = await prisma.match.create({
    data: {
      bracketId: bracket.id,
      round: 4,
      position: 1,
      status: MatchStatus.SCHEDULED,
      // teams TBD
    },
  });

  console.log(`8 partidas criadas (6 round robin + 3º lugar + final)`);

  // ─── 7. Add referees (Linck e Paixão) ───────────────────
  const linckId = userIds['linck@toqueplay.com'];
  const paixaoId = userIds['paixao@toqueplay.com'];

  for (const refId of [linckId, paixaoId]) {
    await prisma.tournamentReferee.create({
      data: {
        tournamentId: tournament.id,
        userId: refId,
      },
    });
  }
  console.log('Árbitros (Linck, Paixão) adicionados');

  // ─── Done ────────────────────────────────────────────────
  console.log('\n✅ Seed completo!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Torneio: ${tournament.name}`);
  console.log(`Tournament ID: ${tournament.id}`);
  console.log(`Status: BRACKET_GENERATED`);
  console.log('Senha para todos: 123456');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Rodadas:');
  console.log('  1ª: Só Dois Toques x Sierra Madre | Vôlei Raiz x Ultra Seven');
  console.log('  2ª: Só Dois Toques x Ultra Seven  | Vôlei Raiz x Sierra Madre');
  console.log('  3ª: Só Dois Toques x Vôlei Raiz   | Ultra Seven x Sierra Madre');
  console.log('  + Disputa 3º lugar e Final');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Árbitros: linck@toqueplay.com, paixao@toqueplay.com');
  console.log('Organizador: organizador@toqueplay.com');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
