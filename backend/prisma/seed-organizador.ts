import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding organizador...');

  const passwordHash = await bcrypt.hash('123456', 10);

  await prisma.user.upsert({
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

  console.log('Seed completed! Organizador created.');
  console.log({
    email: 'organizador@toqueplay.com',
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
