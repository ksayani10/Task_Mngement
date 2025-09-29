// api/src/auth/hash.ts
import bcrypt from "bcryptjs";

export async function hash(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyHash(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}
