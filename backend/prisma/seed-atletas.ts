import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const ATLETAS = [
  { name: 'João Silva', email: 'joao@toqueplay.com' },
  { name: 'Maria Santos', email: 'maria@toqueplay.com' },
  { name: 'Pedro Lima', email: 'pedro@toqueplay.com' },
  { name: 'Ana Costa', email: 'ana@toqueplay.com' },
  { name: 'Lucas Oliveira', email: 'lucas@toqueplay.com' },
  { name: 'Julia Ferreira', email: 'julia@toqueplay.com' },
  { name: 'Rafael Souza', email: 'rafael@toqueplay.com' },
  { name: 'Camila Alves', email: 'camila@toqueplay.com' },
  { name: 'Bruno Pereira', email: 'bruno@toqueplay.com' },
  { name: 'Larissa Martins', email: 'larissa@toqueplay.com' },
  { name: 'Gabriel Rocha', email: 'gabriel@toqueplay.com' },
  { name: 'Fernanda Dias', email: 'fernanda@toqueplay.com' },
];

const TIMES = [
  { name: 'Trovão VC', captain: 0, members: [0, 1, 2, 3, 4, 5] },
  { name: 'Fúria Vôlei', captain: 6, members: [6, 7, 8, 9, 10, 11] },
];

async function main() {
  console.log('Seeding atletas + times...');

  const passwordHash = await bcrypt.hash('123456', 10);

  const userIds: string[] = [];

  for (const a of ATLETAS) {
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
    userIds.push(user.id);
  }

  console.log(`${ATLETAS.length} atletas created.`);

  for (const t of TIMES) {
    const captainId = userIds[t.captain];
    const existing = await prisma.team.findFirst({ where: { name: t.name, ownerId: captainId } });
    if (existing) {
      console.log(`  Time "${t.name}" already exists, skipping.`);
      continue;
    }

    const team = await prisma.team.create({
      data: {
        name: t.name,
        ownerId: captainId,
        members: {
          create: t.members.map((idx) => ({
            userId: userIds[idx],
            isCaptain: idx === t.captain,
          })),
        },
      },
    });
    console.log(`  Time "${t.name}" created (${team.id})`);
  }

  console.log('\nSeed completed!');
  console.log('Senha para todos: 123456');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
