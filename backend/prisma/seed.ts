import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const passwordHash = await bcrypt.hash('123456', 10);

  // ─── Super Admin ───────────────────────────────────────────────
  await prisma.user.upsert({
    where: { email: 'admin@toqueplay.com' },
    update: {},
    create: {
      email: 'admin@toqueplay.com',
      name: 'Super Admin',
      password: passwordHash,
      role: Role.SUPER_ADMIN,
      isEmailVerified: true,
      isFirstAccess: false,
    },
  });

  console.log('Seed completed! Super admin created.');
  console.log({
    email: 'admin@toqueplay.com',
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
