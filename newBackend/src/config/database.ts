import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { config } from "./app.config";
import { logger } from "../utils/logger";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

// ---- pool และ adapter สร้างครั้งเดียว export ออกไปให้ทุกคนใช้ ----
export const pool = new pg.Pool({ connectionString: config.db.url });

const createPrismaClient = (): PrismaClient => {
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: config.app.isDevelopment
      ? [
          { emit: "event" as const, level: "query" as const },
          { emit: "event" as const, level: "error" as const },
          { emit: "event" as const, level: "warn" as const },
        ]
      : [{ emit: "event" as const, level: "error" as const }],
  });
};

export const prisma: PrismaClient = global.__prisma ?? createPrismaClient();

if (config.app.isDevelopment) {
  global.__prisma = prisma;

  (prisma as any).$on("query", (e: any) => {
    if (e.duration > 200) {
      logger.warn(`Slow query (${e.duration}ms): ${e.query}`);
    }
  });
}

export const connectDatabase = async (): Promise<void> => {
  await prisma.$connect();
  logger.info("Database connected (via PrismaPg adapter)");
};

export const disconnectDatabase = async (): Promise<void> => {
  await prisma.$disconnect();
  await pool.end();
  logger.info("Database disconnected");
};