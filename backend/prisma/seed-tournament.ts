import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding tournament...\n');

  const admin = await prisma.user.findUnique({ where: { email: 'admin@toqueplay.com' } });
  if (!admin) {
    console.error('Admin not found. Run seed.ts first.');
    process.exit(1);
  }

  const teams = await prisma.team.findMany({ include: { members: true } });
  if (teams.length < 8) {
    console.error('Need at least 8 teams. Run seed.ts first.');
    process.exit(1);
  }

  const tournament = await prisma.tournament.create({
    data: {
      name: 'Torneio Seed - Teste Chaveamento',
      description: 'Torneio criado pelo seed para testar os tipos de chaveamento. Use a tela de detalhes para gerar chaves.',
      eventType: 'SINGLE',
      status: 'REGISTRATION_OPEN',
      isPublished: true,
      ownerId: admin.id,
      categories: {
        create: {
          type: 'MALE',
          format: 'PAIR',
          modality: 'BEACH',
          minMembers: 2,
          maxMembers: 2,
          bestOfSets: 3,
          tiebreakScore: 15,
        },
      },
      stages: {
        create: {
          name: 'Etapa Unica',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          startTime: new Date(),
          maxTeams: 12,
          city: 'Florianopolis',
          state: 'SC',
          address: 'Praia da Barra da Lagoa',
        },
      },
      sponsors: {
        createMany: {
          data: [
            { name: 'Patrocinador Alpha', description: 'Apoio oficial' },
            { name: 'Patrocinador Beta', description: 'Apoio midia' },
          ],
        },
      },
    },
    include: { categories: true, stages: true },
  });

  console.log(`Torneio criado: ${tournament.id}`);
  console.log(`  Categoria: ${tournament.categories[0].id}`);

  const category = tournament.categories[0];
  let regCount = 0;
  for (const team of teams.slice(0, 8)) {
    const captain = team.members.find((m) => m.isCaptain);
    if (!captain?.userId) continue;

    await prisma.registration.create({
      data: {
        tournamentId: tournament.id,
        categoryId: category.id,
        teamId: team.id,
        userId: captain.userId!,
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        paymentMethod: 'SEED',
        paidAt: new Date(),
        members: {
          create: team.members.map((m) => ({
            teamMemberId: m.id,
            isCaptain: m.isCaptain,
          })),
        },
      },
    });
    regCount++;
  }

  console.log(`  ${regCount} equipes inscritas e confirmadas`);
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Login: admin@toqueplay.com / 123456');
  console.log('O torneio aparece na listagem.');
  console.log('Na aba "Visao geral" (modo organizador) voce vera');
  console.log('a secao CHAVEAMENTO com os 4 tipos e o botao de info.');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((e) => {
    console.error('Seed tournament failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
