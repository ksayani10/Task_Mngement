// api/src/routes/auth.ts
import { Router } from "express";
import { db } from "../db";                 // Prisma client instance
import { hash, verifyHash } from "../auth/hash";
import { sign } from "../auth/jwt";

const r = Router();

/**
 * POST /auth/signup
 * body: { name, email, password, role }
 */
r.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = (req.body ?? {}) as {
      name?: string; email?: string; password?: string; role?: "admin" | "member";
    };

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (!["admin", "member"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: "Email already in use" });

    const passwordHash = await hash(password);
    const user = await db.user.create({
      data: { name, email, passwordHash, role },
      select: { id: true, name: true, email: true, role: true },
    });

    const token = sign({ uid: user.id, role: user.role });
    return res.json({ token, user });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: "Signup failed" });
  }
});

/**
 * POST /auth/login
 * body: { email, password }
 */
r.post("/login", async (req, res) => {
  try {
    const { email, password } = (req.body ?? {}) as { email?: string; password?: string };
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user || !(await verifyHash(password, user.passwordHash))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = sign({ uid: user.id, role: user.role });
    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: "Login failed" });
  }
});

export default r;
