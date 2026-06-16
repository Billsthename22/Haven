import { PrismaPg } from "@prisma/adapter-pg";
import * as PrismaGenerated from "../generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaGenerated.PrismaClient | undefined;
};

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

const cachedPrisma = globalForPrisma.prisma;

export const prisma =
  cachedPrisma && "passwordResetToken" in cachedPrisma
    ? cachedPrisma
    : new PrismaGenerated.PrismaClient({
        adapter: new PrismaPg({ connectionString: databaseUrl }),
      });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
