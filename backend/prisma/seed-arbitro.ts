import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding arbitro...');

  const passwordHash = await bcrypt.hash('123456', 10);

  await prisma.user.upsert({
    where: { email: 'arbitro@toqueplay.com' },
    update: {},
    create: {
      email: 'arbitro@toqueplay.com',
      name: 'Arbitro Teste',
      password: passwordHash,
      role: Role.ATLETA,
      isEmailVerified: true,
      isFirstAccess: false,
    },
  });

  console.log('Seed completed! Arbitro created.');
  console.log({
    email: 'arbitro@toqueplay.com',
    password: '123456',
  });
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
