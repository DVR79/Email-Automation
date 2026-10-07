import { PrismaClient } from "@prisma/client";

/* Prisma client singleton so dev hot-reload does not open many connections.
   Sendrift. Copyright 2026 Venkataramana. */

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ log: ["error", "warn"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
