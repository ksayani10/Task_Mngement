import type { Request, Response, NextFunction } from "express";
import { verify, type JWTPayload } from "../auth/jwt";

export type AuthedReq = Request & { user?: JWTPayload };

export function requireAuth(req: AuthedReq, res: Response, next: NextFunction) {
  const h = req.header("authorization") || "";
  const m = h.match(/^Bearer\s+(.+)$/i);
  if (!m) return res.status(401).json({ error: "Unauthorized" });

  try {
    const payload = verify(m[1]); // { uid, role }
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function requireRole(role: "admin" | "member") {
  return (req: AuthedReq, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    if (req.user.role !== role) return res.status(403).json({ error: "Forbidden" });
    next();
  };
}
