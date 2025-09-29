import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET ?? "dev-secret";

export type JWTPayload = { uid: number; role: "admin" | "member" };

export function sign(payload: JWTPayload) {
  // token valid for 7 days
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function verify(token: string): JWTPayload {
  return jwt.verify(token, SECRET) as JWTPayload;
}
