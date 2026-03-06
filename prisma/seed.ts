import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required for seed");
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      name: "Demo User",
      password: hashedPassword,
      role: "USER",
    },
  });

  await prisma.task.createMany({
    data: [
      { title: "Setup project", status: "DONE", priority: "HIGH", assigneeId: admin.id },
      { title: "Implement auth", status: "DONE", priority: "HIGH", assigneeId: admin.id },
      { title: "Build dashboard", status: "IN_PROGRESS", priority: "MEDIUM", assigneeId: user.id },
      { title: "Add task management", status: "TODO", priority: "HIGH", assigneeId: user.id },
      { title: "Write documentation", status: "TODO", priority: "LOW" },
    ],
  });

  console.log("Seed completed:", { admin: admin.email, user: user.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
