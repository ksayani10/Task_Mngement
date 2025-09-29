import "dotenv/config";
export const ENV = {
  PORT: Number(process.env.PORT ?? 4000),
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret",
};
