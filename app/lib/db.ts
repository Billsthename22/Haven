// lib/db.ts
import { PrismaClient } from "@/app/generated/prisma/client";

if (!process.env.DATABASE_URL && process.env.Supabase_Database_URL) {
  process.env.DATABASE_URL = process.env.Supabase_Database_URL;
}

declare global {
  // Prevent multiple instances of Prisma Client in development
  var cachedPrisma: PrismaClient | undefined;
}

export const db =
  globalThis.cachedPrisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.cachedPrisma = db;
}
