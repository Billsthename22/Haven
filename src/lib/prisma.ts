import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as PrismaGenerated from "../generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaGenerated.PrismaClient | undefined;
};

// 1. Create a function that spins up the client safely
const createPrismaClient = () => {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  const pool = new Pool({ connectionString: databaseUrl });
  
  return new PrismaGenerated.PrismaClient({
    adapter: new PrismaPg(pool),
  });
};

// 2. Export a clean instance directly instead of wrapping it in a Proxy
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}