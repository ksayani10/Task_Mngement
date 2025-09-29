import { PrismaClient } from "@prisma/client";
export const db =
  (global as any).prisma ||
  new PrismaClient({ log: ["error", "warn"] });

if (process.env.NODE_ENV !== "production") (global as any).prisma = db;
