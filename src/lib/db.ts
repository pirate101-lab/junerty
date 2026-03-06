import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  // Use DIRECT_URL for pg adapter, or DATABASE_URL if standard postgres, else default
  const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  const connectionString =
    url?.startsWith("postgresql://") || url?.startsWith("postgres://")
      ? url
      : "postgresql://postgres:postgres@localhost:5432/business_platform";

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

export const prisma =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
