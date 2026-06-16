import { PrismaPg } from "@prisma/adapter-pg";
import * as PrismaGenerated from "../generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaGenerated.PrismaClient | undefined;
};

let prismaClient = globalForPrisma.prisma;

function getPrisma() {
  if (prismaClient) {
    return prismaClient;
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  prismaClient = new PrismaGenerated.PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
  });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prismaClient;
  }

  return prismaClient;
}

export const prisma = new Proxy({} as PrismaGenerated.PrismaClient, {
  get(_target, property, receiver) {
    const client = getPrisma();
    const value = Reflect.get(client, property, receiver);

    return typeof value === "function" ? value.bind(client) : value;
  },
});
