/**
 * Seed demo grande — popula DB para visualização do painel admin.
 *
 * Cria: 80 atletas, 24 times, 6 torneios, ~80 inscrições (com pagamentos),
 * ~60 partidas, 20 amistosos, 50 AthleteStats, 20 AdminLog.
 *
 * Uso: pnpm db:seed:demo
 */
import {
  PrismaClient,
  Role,
  TournamentType,
  TournamentFormat,
  TournamentModality,
  TournamentEventType,
  TournamentStatus,
  RegistrationStatus,
  BracketType,
  MatchStatus,
  FriendlyStatus,
  UserStatus,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const PASSWORD = '123456';
const MARKER = '[DEMO]';

const FIRST_NAMES = [
  'Lucas', 'Mariana', 'Pedro', 'Ana', 'Rafael', 'Juliana', 'Bruno', 'Camila',
  'Gabriel', 'Beatriz', 'Tiago', 'Aline', 'Felipe', 'Carla', 'Rodrigo', 'Fernanda',
  'Diego', 'Larissa', 'Vinicius', 'Patricia', 'Gustavo', 'Renata', 'Marcelo', 'Isabela',
  'Bruna', 'Eduardo', 'Tatiane', 'Marcos', 'Priscila', 'André', 'Daniela', 'Thiago',
];
const LAST_NAMES = [
  'Silva', 'Souza', 'Costa', 'Oliveira', 'Santos', 'Pereira', 'Lima', 'Ferreira',
  'Almeida', 'Rodrigues', 'Gomes', 'Martins', 'Araujo', 'Barbosa', 'Ribeiro', 'Carvalho',
  'Nascimento', 'Melo', 'Mendes', 'Freitas', 'Dias', 'Castro', 'Andrade', 'Rocha',
];
const TEAM_NAMES = [
  'Trovao', 'Furacao', 'Tsunami', 'Relampago', 'Avalanche', 'Tempestade',
  'Vulcao', 'Ciclone', 'Tornado', 'Maremoto', 'Glaciador', 'Fenix',
  'Tubarao', 'Tigre', 'Lobo', 'Aguia', 'Pantera', 'Falcão',
  'Leao', 'Touro', 'Cobra', 'Escorpiao', 'Urubu', 'Crocodilo',
];
const TOURNAMENT_NAMES = [
  'Circuito Verão Praia 2026',
  'Copa Universitária Indoor',
  'Festival Maresia',
  'Beach Open SP',
  'Arena Courts Championship',
  'Torneio Cidade Maravilhosa',
];
const CITIES = [
  ['Florianopolis', 'SC', 'Praia da Joaquina'],
  ['Sao Paulo', 'SP', 'Ginasio do Ibirapuera'],
  ['Balneario Camboriu', 'SC', 'Praia Central'],
  ['Rio de Janeiro', 'RJ', 'Praia de Copacabana'],
  ['Vitoria', 'ES', 'Praia de Camburi'],
  ['Salvador', 'BA', 'Praia do Farol da Barra'],
];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}
function rng(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}
const rand = rng(42);
function randInt(min: number, max: number) {
  return Math.floor(rand() * (max - min + 1)) + min;
}

async function main() {
  console.log('Limpando dados demo antigos...');
  await prisma.adminLog.deleteMany({ where: { source: { startsWith: 'demo' } } });
  await prisma.athleteStats.deleteMany({});
  await prisma.friendlyAthlete.deleteMany({});
  await prisma.friendly.deleteMany({ where: { title: { startsWith: MARKER } } });
  await prisma.matchEvent.deleteMany({});
  await prisma.pointEvent.deleteMany({});
  await prisma.matchSet.deleteMany({});
  await prisma.match.deleteMany({});
  await prisma.bracket.deleteMany({});
  await prisma.registrationMember.deleteMany({});
  await prisma.registration.deleteMany({});
  await prisma.sponsor.deleteMany({});
  await prisma.tournamentStage.deleteMany({});
  await prisma.tournamentCategory.deleteMany({});
  await prisma.tournament.deleteMany({ where: { name: { startsWith: MARKER } } });
  await prisma.teamMember.deleteMany({});
  await prisma.team.deleteMany({ where: { name: { startsWith: MARKER } } });

  const hash = await bcrypt.hash(PASSWORD, 10);

  console.log('Criando admin + 80 atletas...');
  await prisma.user.upsert({
    where: { email: 'admin@toqueplay.com' },
    update: { name: 'Super Admin', password: hash, role: Role.SUPER_ADMIN, isEmailVerified: true, isFirstAccess: false, status: UserStatus.ACTIVE },
    create: { email: 'admin@toqueplay.com', name: 'Super Admin', password: hash, role: Role.SUPER_ADMIN, isEmailVerified: true, isFirstAccess: false },
  });

  const athletes: { id: string; name: string; email: string }[] = [];
  for (let i = 1; i <= 80; i++) {
    const padded = String(i).padStart(2, '0');
    const email = `atleta${padded}@seed.toqueplay.com`;
    const name = `${pick(FIRST_NAMES, i - 1)} ${pick(LAST_NAMES, i - 1)}`;
    const u = await prisma.user.upsert({
      where: { email },
      update: { name, password: hash, role: Role.ATLETA, isEmailVerified: true, isFirstAccess: false, status: UserStatus.ACTIVE },
      create: { email, name, password: hash, role: Role.ATLETA, isEmailVerified: true, isFirstAccess: false, status: UserStatus.ACTIVE },
    });
    athletes.push({ id: u.id, name, email });
  }

  // 5 organizadores extras
  const organizers: { id: string; name: string }[] = [];
  for (let i = 1; i <= 5; i++) {
    const padded = String(i).padStart(2, '0');
    const email = `organizador${padded}@seed.toqueplay.com`;
    const name = `Organizador ${padded}`;
    const u = await prisma.user.upsert({
      where: { email },
      update: { name, password: hash, role: Role.ORGANIZADOR, isEmailVerified: true, isFirstAccess: false, status: UserStatus.ACTIVE },
      create: { email, name, password: hash, role: Role.ORGANIZADOR, isEmailVerified: true, isFirstAccess: false, status: UserStatus.ACTIVE },
    });
    organizers.push({ id: u.id, name });
  }

  console.log('Criando 24 times...');
  const teams: { id: string; name: string; ownerId: string; memberIds: string[]; teamMemberIds: string[] }[] = [];
  for (let i = 0; i < 24; i++) {
    const captain = athletes[i * 3];
    const member2 = athletes[i * 3 + 1];
    const member3 = athletes[i * 3 + 2];
    const t = await prisma.team.create({
      data: {
        name: `${MARKER} ${TEAM_NAMES[i % TEAM_NAMES.length]}`,
        description: 'Time demo',
        sport: 'VOLEI',
        ownerId: captain.id,
        members: {
          create: [
            { userId: captain.id, isCaptain: true, isGuest: false },
            { userId: member2.id, isCaptain: false, isGuest: false },
            { userId: member3.id, isCaptain: false, isGuest: false },
          ],
        },
      },
      include: { members: true },
    });
    teams.push({
      id: t.id,
      name: t.name,
      ownerId: captain.id,
      memberIds: [captain.id, member2.id, member3.id],
      teamMemberIds: t.members.map((m) => m.id),
    });
  }

  console.log('Criando 6 torneios...');
  const tournamentStatuses: TournamentStatus[] = [
    TournamentStatus.REGISTRATION_OPEN,
    TournamentStatus.REGISTRATION_OPEN,
    TournamentStatus.IN_PROGRESS,
    TournamentStatus.IN_PROGRESS,
    TournamentStatus.FINISHED,
    TournamentStatus.FINISHED,
  ];
  const tournaments: { id: string; name: string; categoryId: string }[] = [];
  for (let i = 0; i < 6; i++) {
    const owner = organizers[i % organizers.length];
    const [city, state, address] = CITIES[i % CITIES.length];
    const status = tournamentStatuses[i];
    const modality: TournamentModality = i % 2 === 0 ? TournamentModality.BEACH : TournamentModality.COURT;
    const type: TournamentType = pick([TournamentType.MALE, TournamentType.FEMALE, TournamentType.MIX], i);
    const startOffset = (i - 3) * 7; // semanas

    const t = await prisma.tournament.create({
      data: {
        name: `${MARKER} ${TOURNAMENT_NAMES[i]}`,
        description: `Torneio demo de ${modality.toLowerCase()}`,
        eventType: TournamentEventType.SINGLE,
        status,
        isPublished: true,
        ownerId: owner.id,
        categories: {
          create: {
            type,
            format: TournamentFormat.PAIR,
            modality,
            minMembers: 2,
            maxMembers: 2,
            bestOfSets: 3,
            tiebreakScore: 15,
            registrationPrice: randInt(80, 250),
          },
        },
        stages: {
          create: {
            name: 'Etapa Unica',
            date: new Date(Date.now() + startOffset * 24 * 60 * 60 * 1000),
            startTime: new Date(Date.now() + startOffset * 24 * 60 * 60 * 1000),
            maxTeams: 16,
            city,
            state,
            address,
          },
        },
        sponsors: {
          createMany: {
            data: [
              { name: `Patrocinador ${i + 1}A`, description: 'Apoio ouro' },
              { name: `Patrocinador ${i + 1}B`, description: 'Apoio prata' },
            ],
          },
        },
      },
      include: { categories: true },
    });
    tournaments.push({ id: t.id, name: t.name, categoryId: t.categories[0].id });
  }

  console.log('Criando ~80 inscrições com pagamentos...');
  const paymentStatuses = ['PAID', 'PAID', 'PAID', 'PAID', 'PENDING', 'PENDING', 'FAILED', 'REFUNDED'];
  let registrationCount = 0;
  for (const tour of tournaments) {
    // cada torneio recebe entre 8 e 16 inscrições
    const count = randInt(8, 16);
    for (let k = 0; k < count; k++) {
      const team = teams[(registrationCount + k) % teams.length];
      const athlete = athletes[(registrationCount + k) % athletes.length];
      const paymentStatus = paymentStatuses[registrationCount % paymentStatuses.length];
      const isPaid = paymentStatus === 'PAID';
      const createdAt = new Date(Date.now() - randInt(1, 60) * 24 * 60 * 60 * 1000);
      const paidAt = isPaid ? new Date(createdAt.getTime() + randInt(1, 48) * 60 * 60 * 1000) : null;
      const regStatus =
        paymentStatus === 'PAID'
          ? RegistrationStatus.CONFIRMED
          : paymentStatus === 'PENDING'
            ? RegistrationStatus.PENDING_PAYMENT
            : RegistrationStatus.CANCELLED;

      const reg = await prisma.registration.create({
        data: {
          tournamentId: tour.id,
          categoryId: tour.categoryId,
          teamId: team.id,
          userId: athlete.id,
          status: regStatus,
          paymentId: paymentStatus === 'FAILED' ? null : `pi_demo_${registrationCount}_${Date.now().toString(36)}`,
          paymentStatus,
          paymentMethod: 'CARD',
          paidAt,
          createdAt,
        },
      });

      // registration members (usa teamMemberIds = TeamMember.id, não userId)
      if (team.teamMemberIds.length >= 2) {
        await prisma.registrationMember.createMany({
          data: [
            { registrationId: reg.id, teamMemberId: team.teamMemberIds[0], isCaptain: true },
            { registrationId: reg.id, teamMemberId: team.teamMemberIds[1], isCaptain: false },
          ],
          skipDuplicates: true,
        });
      }
      registrationCount++;
    }
  }
  console.log(`  ${registrationCount} inscrições criadas.`);

  console.log('Criando brackets + partidas...');
  let matchCount = 0;
  for (const tour of tournaments.slice(0, 5)) {
    const bracket = await prisma.bracket.create({
      data: {
        tournamentId: tour.id,
        categoryId: tour.categoryId,
        type: BracketType.SINGLE_ELIMINATION,
      },
    });

    const matchesPerBracket = randInt(8, 14);
    for (let m = 0; m < matchesPerBracket; m++) {
      const teamA = teams[(matchCount * 2) % teams.length];
      const teamB = teams[(matchCount * 2 + 1) % teams.length];
      const status = pick(
        [
          MatchStatus.SCHEDULED,
          MatchStatus.IN_PROGRESS,
          MatchStatus.FINISHED,
          MatchStatus.FINISHED,
          MatchStatus.FINISHED,
          MatchStatus.WALKOVER,
        ],
        m,
      );
      const scheduledAt = new Date(Date.now() + (m - 4) * 24 * 60 * 60 * 1000);
      const scoreA = status === MatchStatus.FINISHED ? randInt(0, 3) : 0;
      const scoreB = status === MatchStatus.FINISHED ? randInt(0, 3) : 0;
      const winnerId =
        status === MatchStatus.FINISHED ? (scoreA >= scoreB ? teamA.id : teamB.id) : null;

      const match = await prisma.match.create({
        data: {
          bracketId: bracket.id,
          round: Math.floor(m / 4) + 1,
          position: m,
          status,
          scheduledAt,
          teamAId: teamA.id,
          teamBId: teamB.id,
          scoreTeamA: scoreA,
          scoreTeamB: scoreB,
          winnerId,
          bestOfSets: 3,
          label: `Rodada ${Math.floor(m / 4) + 1}`,
          ...(status === MatchStatus.FINISHED && {
            startedAt: new Date(scheduledAt.getTime()),
            finishedAt: new Date(scheduledAt.getTime() + 90 * 60 * 1000),
          }),
        },
      });

      if (status === MatchStatus.FINISHED) {
        await prisma.matchSet.createMany({
          data: Array.from({ length: 3 }).map((_, s) => ({
            matchId: match.id,
            setNumber: s + 1,
            scoreA: randInt(15, 25),
            scoreB: randInt(10, 25),
          })),
        });
        await prisma.matchEvent.create({
          data: {
            matchId: match.id,
            type: 'MATCH_FINISH' as never,
            scoreA,
            scoreB,
            createdBy: teamA.ownerId,
          },
        });
      }
      matchCount++;
    }
  }
  console.log(`  ${matchCount} partidas criadas.`);

  console.log('Criando 20 amistosos...');
  for (let i = 0; i < 20; i++) {
    const reqTeam = teams[i % teams.length];
    const chalTeam = teams[(i + 7) % teams.length];
    const status = pick(
      [
        FriendlyStatus.PENDING,
        FriendlyStatus.ACCEPTED,
        FriendlyStatus.COMPLETED,
        FriendlyStatus.COMPLETED,
        FriendlyStatus.REJECTED,
      ],
      i,
    );
    const date = new Date(Date.now() + (i - 10) * 24 * 60 * 60 * 1000);
    await prisma.friendly.create({
      data: {
        title: `${MARKER} Amistoso ${i + 1}`,
        description: 'Amistoso demo',
        requesterId: reqTeam.ownerId,
        requesterTeamId: reqTeam.id,
        challengedId: chalTeam.ownerId,
        challengedTeamId: chalTeam.id,
        status,
        date,
        startTime: date,
        city: pick(CITIES, i)[0],
        state: pick(CITIES, i)[1],
        address: pick(CITIES, i)[2],
        scoreTeamA: status === FriendlyStatus.COMPLETED ? randInt(0, 3) : null,
        scoreTeamB: status === FriendlyStatus.COMPLETED ? randInt(0, 3) : null,
        modality: 'BEACH',
        categoryFormat: 'PAIR',
      },
    });
  }

  console.log('Criando AthleteStats...');
  let statsCount = 0;
  for (const tour of tournaments) {
    for (let i = 0; i < 12; i++) {
      const athlete = athletes[i % athletes.length];
      const team = teams[i % teams.length];
      try {
        await prisma.athleteStats.create({
          data: {
            userId: athlete.id,
            teamId: team.id,
            tournamentId: tour.id,
            matchesPlayed: randInt(2, 10),
            matchesWon: randInt(0, 6),
            setsWon: randInt(0, 18),
            pointsScored: randInt(20, 200),
            mvpCount: randInt(0, 4),
          },
        });
        statsCount++;
      } catch {
        // unique [userId, teamId, tournamentId] — ignora duplicatas
      }
    }
  }
  console.log(`  ${statsCount} AthleteStats criados.`);

  console.log('Criando AdminLogs...');
  const logSeeds: { level: string; source: string; message: string }[] = [
    { level: 'INFO', source: 'demo.auth', message: 'Login admin realizado' },
    { level: 'INFO', source: 'demo.payment', message: 'Pagamento confirmado via Stripe' },
    { level: 'WARN', source: 'demo.payment', message: 'Webhook Stripe demorou mais que 2s' },
    { level: 'ERROR', source: 'demo.payment', message: 'Falha ao processar chargeback' },
    { level: 'INFO', source: 'demo.tournament', message: 'Chaveamento gerado automaticamente' },
    { level: 'WARN', source: 'demo.match', message: 'Partida iniciada sem árbitro confirmado' },
    { level: 'ERROR', source: 'demo.notification', message: 'Falha ao enviar push FCM' },
    { level: 'INFO', source: 'demo.user', message: 'Usuário bloqueado por comportamento abusivo' },
  ];
  for (let i = 0; i < 20; i++) {
    const l = logSeeds[i % logSeeds.length];
    await prisma.adminLog.create({
      data: {
        level: l.level,
        source: l.source,
        message: `${l.message} #${i + 1}`,
        createdAt: new Date(Date.now() - i * 60 * 60 * 1000),
      },
    });
  }

  console.log('');
  console.log('Seed demo completo!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Admin:     admin@toqueplay.com  (senha: ${PASSWORD})`);
  console.log(`Atletas:   80 (atleta01..atleta80@seed.toqueplay.com)`);
  console.log(`Times:     24 · Torneios: 6 · Inscrições: ${registrationCount}`);
  console.log(`Partidas:  ${matchCount} · Amistosos: 20 · AthleteStats: ${statsCount}`);
  console.log('Logs:      20');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((e) => {
    console.error('Seed demo falhou:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
