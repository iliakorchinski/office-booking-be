import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { User } from 'src/types/common';

const prisma = new PrismaClient();

async function main() {
  for (let i = 1; i <= 16; i++) {
    await prisma.desk.upsert({
      where: { name: `desk ${i}` },
      update: {},
      create: {
        name: `desk #${i}`,
        location: 'Section A, floor 2',
      },
    });
  }

  const users: User[] = [
    {
      email: 'test@test.com',
      password: '123456',
      name: 'Ilia',
      surname: 'Kortchinski',
      role: 'USER',
    },
    {
      email: 'test2@test.com',
      password: '123456',
      name: 'Bob',
      surname: 'Brown',
      role: 'ADMIN',
    },
  ];

  for (const user of users) {
    const hashed = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        password: hashed,
        name: user.name,
        surname: user.surname,
        role: user.role,
      },
    });
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
