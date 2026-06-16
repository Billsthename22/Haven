import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

async function main() {
  console.log("🌱 Starting database seeding pipeline...");

  // 1. Purge older dashboard content to avoid composite/unique key collisions
  await prisma.like.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.circle.deleteMany({});
  await prisma.event.deleteMany({});

  // 2. Generate a secure fallback password hash
  const securePassword = await bcrypt.hash("password123", 10);

  // 3. Seed active peer profiles
  const tomi = await prisma.profile.upsert({
    where: { email: "tomi@haven.com" },
    update: {},
    create: {
      fullName: "Tomi Dipo",
      email: "tomi@haven.com",
      passwordHash: securePassword,
      isVerified: true,
      isOnline: true,
      customStatus: "Coding in Lekki...",
    },
  });

  const sarah = await prisma.profile.upsert({
    where: { email: "sarah@haven.com" },
    update: {},
    create: {
      fullName: "Sarah Okafor",
      email: "sarah@haven.com",
      passwordHash: securePassword,
      isVerified: true,
      isOnline: true,
      customStatus: "Reviewing pull requests",
    },
  });

  console.log("👥 Network profiles initialized.");

  // 4. Seed system Circles (Groups)
  const group1 = await prisma.circle.create({
    data: { 
      name: "Design System Studio", 
      memberCount: 12, 
      streakDays: 5,
      members: { connect: [{ id: tomi.id }] }
    }
  });

  const group2 = await prisma.circle.create({
    data: { 
      name: "Dev Alpha Cluster", 
      memberCount: 8, 
      streakDays: 14,
      members: { connect: [{ id: tomi.id }, { id: sarah.id }] }
    }
  });

  console.log("⭕ Tactical clusters synchronized.");

  // 5. Seed initial feed posts
  const post1 = await prisma.post.create({
    data: {
      content: "Just updated the core theme configurations. The UI feels incredibly responsive now.",
      type: "text",
      authorId: tomi.id,
      circleId: group2.id,
      likesCount: 1,
    }
  });

  // Attach a baseline reaction
  await prisma.like.create({
    data: {
      profileId: sarah.id,
      postId: post1.id
    }
  });

  // 6. Seed calendar sync nodes
  await prisma.event.createMany({
    data: [
      { title: "Project Sync & Sprint Review", scheduledAt: new Date(Date.now() + 86400000) },
      { title: "UI/UX Architecture Critique", scheduledAt: new Date(Date.now() + 172800000) }
    ]
  });

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding transaction dropped:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
