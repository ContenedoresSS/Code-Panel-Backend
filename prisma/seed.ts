import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prismaClientSingleton = () => {
  const connectionString = `${process.env.DATABASE_URL}`;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

async function main() {
  console.log('Initializing seeding...');

  const roles = ['God', 'Student', 'Teacher'];

  console.log('Creating Roles...');
  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
  }

  console.log('Creating default user...');

  const saltRounds = 10;
  const defaultPassword = 'AdminPassword123!!';
  const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      email: 'admin@admin.com',
      name: 'Admin',
      lastName: 'Master',
      passwordHash: hashedPassword,
      role: {
        connect: { name: 'God' }
      }
    },
  });

  console.log(`Successfully seed`);
  console.log(`God user created: ${adminUser.email}`);
}

main()
  .catch((e) => {
    console.error('Error ', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
