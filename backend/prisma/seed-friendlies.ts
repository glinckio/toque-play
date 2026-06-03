import {
  PrismaClient,
  Role,
  FriendlyStatus,
  MatchStatus,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const PASSWORD = '123456';
const SEED_DOMAIN = '@seed-f.toqueplay.com';

function mail(local: string) {
  return `${local}${SEED_DOMAIN}`;
}

async function cleanup() {
  const seedFriendlies = await prisma.friendly.findMany({
    where: { title: { startsWith: '[Seed F]' } },
    select: { id: true },
  });
  const fIds = seedFriendlies.map((f) => f.id);

  if (fIds.length > 0) {
    await prisma.pointEvent.deleteMany({ where: { match: { friendlyId: { in: fIds } } } });
    await prisma.matchEvent.deleteMany({ where: { match: { friendlyId: { in: fIds } } } });
    await prisma.matchSet.deleteMany({ where: { match: { friendlyId: { in: fIds } } } });
    await prisma.match.deleteMany({ where: { friendlyId: { in: fIds } } });
    await prisma.friendlyAthlete.deleteMany({ where: { friendlyId: { in: fIds } } });
    await prisma.friendly.deleteMany({ where: { id: { in: fIds } } });
  }

  const seedUsers = await prisma.user.findMany({
    where: { email: { endsWith: SEED_DOMAIN } },
    select: { id: true },
  });
  const uIds = seedUsers.map((u) => u.id);

  if (uIds.length > 0) {
    const seedTeams = await prisma.team.findMany({
      where: { name: { startsWith: '[Seed F]' } },
      select: { id: true },
    });
    const tIds = seedTeams.map((t) => t.id);

    if (tIds.length > 0) {
      await prisma.registrationMember.deleteMany({ where: { registration: { teamId: { in: tIds } } } });
      await prisma.registration.deleteMany({ where: { teamId: { in: tIds } } });
      await prisma.teamMember.deleteMany({ where: { teamId: { in: tIds } } });
      await prisma.team.deleteMany({ where: { id: { in: tIds } } });
    }
  }

  if (uIds.length > 0) {
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
      description: 'Time gerado pelo seed de amistosos',
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

async function main() {
  console.log('Seeding friendlies...\n');
  const hash = await bcrypt.hash(PASSWORD, 10);
  await cleanup();

  // ── Users ──────────────────────────────────────────────────────────
  const a1 = await upsertUser('Lucas Silva', 'friendly.a1', Role.ATLETA, hash);
  const a2 = await upsertUser('Pedro Santos', 'friendly.a2', Role.ATLETA, hash);
  const a3 = await upsertUser('Rafael Lima', 'friendly.a3', Role.ATLETA, hash);
  const a4 = await upsertUser('João Oliveira', 'friendly.a4', Role.ATLETA, hash);
  const a5 = await upsertUser('Gabriel Costa', 'friendly.a5', Role.ATLETA, hash);
  const a6 = await upsertUser('Matheus Souza', 'friendly.a6', Role.ATLETA, hash);
  const ref1 = await upsertUser('Carlos Arbitro', 'friendly.ref', Role.ATLETA, hash);

  // ── Teams ──────────────────────────────────────────────────────────
  const team1 = await createTeam('[Seed F] Tubarões da Areia', a1.id, [a1.id, a2.id]);
  const team2 = await createTeam('[Seed F] Trovão Vôlei', a3.id, [a3.id, a4.id]);
  const team3 = await createTeam('[Seed F] Furacão Beach', a5.id, [a5.id, a6.id]);

  const tm1 = await prisma.teamMember.findMany({ where: { teamId: team1.id } });
  const tm2 = await prisma.teamMember.findMany({ where: { teamId: team2.id } });
  const tm3 = await prisma.teamMember.findMany({ where: { teamId: team3.id } });

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // ══════════════════════════════════════════════════════════════════
  // F1: PENDING — Team1 challenged Team2
  // ══════════════════════════════════════════════════════════════════
  await prisma.friendly.create({
    data: {
      title: '[Seed F] Desafio Areia',
      requesterId: a1.id,
      requesterTeamId: team1.id,
      challengedId: a3.id,
      challengedTeamId: team2.id,
      status: FriendlyStatus.PENDING,
      date: new Date(today.getTime() + 2 * 86400000),
      address: 'Praia de Jurerê',
      city: 'Florianópolis',
      state: 'SC',
      modality: 'BEACH',
      categoryFormat: 'PAIR',
      athletes: {
        create: [
          { teamMemberId: tm1[0].id, side: 'REQUESTER', isCaptain: true },
          { teamMemberId: tm1[1].id, side: 'REQUESTER', isCaptain: false },
        ],
      },
    },
  });
  console.log('F1: PENDING — Tubarões → Trovão');

  // ══════════════════════════════════════════════════════════════════
  // F2: ACCEPTED — Trovão vs Furacão (SCHEDULED, ready to start)
  // ══════════════════════════════════════════════════════════════════
  const f2 = await prisma.friendly.create({
    data: {
      title: '[Seed F] Amistoso Confirmado',
      requesterId: a3.id,
      requesterTeamId: team2.id,
      challengedId: a5.id,
      challengedTeamId: team3.id,
      status: FriendlyStatus.ACCEPTED,
      date: today,
      startTime: new Date(today.getTime() + 10 * 3600000),
      address: 'Arena Centro, R. do Vôlei, 100',
      city: 'Sapucaia do Sul',
      state: 'RS',
      latitude: -29.8293105,
      longitude: -51.1485954,
      modality: 'BEACH',
      categoryFormat: 'PAIR',
      athletes: {
        create: [
          { teamMemberId: tm2[0].id, side: 'REQUESTER', isCaptain: true },
          { teamMemberId: tm2[1].id, side: 'REQUESTER', isCaptain: false },
          { teamMemberId: tm3[0].id, side: 'CHALLENGED', isCaptain: true },
          { teamMemberId: tm3[1].id, side: 'CHALLENGED', isCaptain: false },
        ],
      },
    },
  });
  const f2match = await prisma.match.create({
    data: {
      friendlyId: f2.id,
      round: 0,
      position: 0,
      status: MatchStatus.SCHEDULED,
      teamAId: team2.id,
      teamBId: team3.id,
    },
  });
  await prisma.friendly.update({ where: { id: f2.id }, data: { matchId: f2match.id } });
  console.log('F2: ACCEPTED — Trovão vs Furacão (SCHEDULED)');

  // ══════════════════════════════════════════════════════════════════
  // F3: ACCEPTED + IN_PROGRESS — Tubarões vs Furacão (8x5, set 1)
  // ══════════════════════════════════════════════════════════════════
  const f3 = await prisma.friendly.create({
    data: {
      title: '[Seed F] Partida Ao Vivo',
      requesterId: a1.id,
      requesterTeamId: team1.id,
      challengedId: a5.id,
      challengedTeamId: team3.id,
      status: FriendlyStatus.ACCEPTED,
      date: today,
      address: 'Arena Centro, R. do Vôlei, 100',
      city: 'Sapucaia do Sul',
      state: 'RS',
      latitude: -29.8293105,
      longitude: -51.1485954,
      modality: 'BEACH',
      categoryFormat: 'PAIR',
      athletes: {
        create: [
          { teamMemberId: tm1[0].id, side: 'REQUESTER', isCaptain: true },
          { teamMemberId: tm1[1].id, side: 'REQUESTER', isCaptain: false },
          { teamMemberId: tm3[0].id, side: 'CHALLENGED', isCaptain: true },
          { teamMemberId: tm3[1].id, side: 'CHALLENGED', isCaptain: false },
        ],
      },
    },
  });
  const f3match = await prisma.match.create({
    data: {
      friendlyId: f3.id,
      round: 0,
      position: 0,
      status: MatchStatus.IN_PROGRESS,
      teamAId: team1.id,
      teamBId: team3.id,
      scoreTeamA: 8,
      scoreTeamB: 5,
      startedAt: new Date(now.getTime() - 15 * 60000),
    },
  });
  await prisma.matchSet.create({ data: { matchId: f3match.id, setNumber: 1, scoreA: 8, scoreB: 5 } });
  for (let i = 0; i < 8; i++) {
    await prisma.pointEvent.create({ data: { matchId: f3match.id, setNumber: 1, scoredBy: 'A' } });
  }
  for (let i = 0; i < 5; i++) {
    await prisma.pointEvent.create({ data: { matchId: f3match.id, setNumber: 1, scoredBy: 'B' } });
  }
  await prisma.friendly.update({ where: { id: f3.id }, data: { matchId: f3match.id } });
  console.log('F3: IN_PROGRESS — Tubarões vs Furacão (8x5, set 1)');

  // ══════════════════════════════════════════════════════════════════
  // F4: COMPLETED — Tubarões 2x1 Trovão (finished)
  // ══════════════════════════════════════════════════════════════════
  const f4 = await prisma.friendly.create({
    data: {
      title: '[Seed F] Amistoso Finalizado',
      requesterId: a1.id,
      requesterTeamId: team1.id,
      challengedId: a3.id,
      challengedTeamId: team2.id,
      status: FriendlyStatus.COMPLETED,
      date: new Date(today.getTime() - 2 * 86400000),
      address: 'Praia de Jurerê',
      city: 'Florianópolis',
      state: 'SC',
      modality: 'BEACH',
      categoryFormat: 'PAIR',
      scoreTeamA: 2,
      scoreTeamB: 1,
      athletes: {
        create: [
          { teamMemberId: tm1[0].id, side: 'REQUESTER', isCaptain: true },
          { teamMemberId: tm1[1].id, side: 'REQUESTER', isCaptain: false },
          { teamMemberId: tm2[0].id, side: 'CHALLENGED', isCaptain: true },
          { teamMemberId: tm2[1].id, side: 'CHALLENGED', isCaptain: false },
        ],
      },
    },
  });
  const f4match = await prisma.match.create({
    data: {
      friendlyId: f4.id,
      round: 0,
      position: 0,
      status: MatchStatus.FINISHED,
      teamAId: team1.id,
      teamBId: team2.id,
      scoreTeamA: 2,
      scoreTeamB: 1,
      winnerId: team1.id,
      startedAt: new Date(now.getTime() - 3 * 3600000),
      finishedAt: new Date(now.getTime() - 1 * 3600000),
    },
  });
  await prisma.matchSet.createMany({
    data: [
      { matchId: f4match.id, setNumber: 1, scoreA: 21, scoreB: 18 },
      { matchId: f4match.id, setNumber: 2, scoreA: 19, scoreB: 21 },
      { matchId: f4match.id, setNumber: 3, scoreA: 15, scoreB: 12 },
    ],
  });
  await prisma.friendly.update({ where: { id: f4.id }, data: { matchId: f4match.id } });
  console.log('F4: COMPLETED — Tubarões 2x1 Trovão');

  // ══════════════════════════════════════════════════════════════════
  console.log('\n✅ Seed de amistosos concluído!\n');
  console.log('═══ LOGINS ═══');
  console.log(`Lucas (Tubarões captain):    ${mail('friendly.a1')} / ${PASSWORD}`);
  console.log(`Rafael (Trovão captain):     ${mail('friendly.a3')} / ${PASSWORD}`);
  console.log(`Gabriel (Furacão captain):   ${mail('friendly.a5')} / ${PASSWORD}`);
  console.log(`Carlos Arbitro:              ${mail('friendly.ref')} / ${PASSWORD}`);
  console.log('');
  console.log('═══ GUIA DE TESTE ═══');
  console.log('Criar amistoso:  Lucas → Meus Amistosos → Solicitar → Buscar time');
  console.log('Aceitar amistoso: Rafael → F1 pendente → Aceitar');
  console.log('Iniciar partida:  Rafael ou Gabriel → F2 → Ver Partida → Iniciar');
  console.log('Partida ao vivo:  Lucas → F3 aparece AO VIVO');
  console.log('Arbitro:          Carlos → Entrar código → Marcar pontos');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
