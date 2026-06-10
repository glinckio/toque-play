import {
  PrismaClient,
  Role,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const PASSWORD = '123456';

async function main() {
  console.log('Seeding database...\n');

  const hash = await bcrypt.hash(PASSWORD, 10);

  // Super Admin
  await prisma.user.upsert({
    where: { email: 'admin@toqueplay.com' },
    update: { name: 'Super Admin', password: hash, role: Role.SUPER_ADMIN, isEmailVerified: true, isFirstAccess: false, status: 'ACTIVE' },
    create: { email: 'admin@toqueplay.com', name: 'Super Admin', password: hash, role: Role.SUPER_ADMIN, isEmailVerified: true, isFirstAccess: false },
  });

  // 24 athletes (2 per team × 12 teams)
  for (let i = 1; i <= 24; i++) {
    const padded = String(i).padStart(2, '0');
    await prisma.user.upsert({
      where: { email: `atleta${padded}@seed.toqueplay.com` },
      update: { name: `Atleta ${padded}`, password: hash, role: Role.ATLETA, isEmailVerified: true, isFirstAccess: false, status: 'ACTIVE' },
      create: { email: `atleta${padded}@seed.toqueplay.com`, name: `Atleta ${padded}`, password: hash, role: Role.ATLETA, isEmailVerified: true, isFirstAccess: false },
    });
  }

  const teamNames = [
    'Trovao', 'Furacao', 'Tsunami', 'Relampago', 'Avalanche', 'Tempestade',
    'Vulcao', 'Ciclone', 'Tornado', 'Maremoto', 'Glaciador', 'Fenix',
  ];

  for (let i = 0; i < 12; i++) {
    const a1email = `atleta${String(i * 2 + 1).padStart(2, '0')}@seed.toqueplay.com`;
    const a2email = `atleta${String(i * 2 + 2).padStart(2, '0')}@seed.toqueplay.com`;
    const a1 = await prisma.user.findUnique({ where: { email: a1email } });
    const a2 = await prisma.user.findUnique({ where: { email: a2email } });
    if (!a1 || !a2) continue;

    await prisma.team.create({
      data: {
        name: teamNames[i],
        description: 'Time gerado pelo seed',
        sport: 'VOLEI',
        ownerId: a1.id,
        members: {
          create: [
            { userId: a1.id, isCaptain: true, isGuest: false },
            { userId: a2.id, isCaptain: false, isGuest: false },
          ],
        },
      },
    });
    console.log(`  ${teamNames[i]} criado`);
  }

  console.log('');
  console.log('Seed completo!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Senha para todos: ${PASSWORD}`);
  console.log('Admin:     admin@toqueplay.com');
  console.log('Atletas:   atleta01@seed.toqueplay.com ate atleta24@seed.toqueplay.com');
  console.log('Times:     12 duplas (capitao = atleta impar)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
