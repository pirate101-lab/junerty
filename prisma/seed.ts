import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const url = process.env.DATABASE_URL;
const adapter =
  url?.startsWith("prisma+postgres://") || url?.startsWith("prisma://")
    ? undefined
    : new PrismaPg({ connectionString: url ?? "postgresql://localhost:5432/platform" });

const prisma =
  adapter !== undefined
    ? new PrismaClient({ adapter })
    : new PrismaClient({ accelerateUrl: url });

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@platform.dev" },
    update: {},
    create: {
      email: "admin@platform.dev",
      name: "Admin User",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "user@platform.dev" },
    update: {},
    create: {
      email: "user@platform.dev",
      name: "Demo User",
      password: hashedPassword,
      role: "USER",
    },
  });

  console.log("Seeded users:", { admin: admin.email, user: user.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
