// api/src/types/express.d.ts
import "express";

declare global {
  namespace Express {
    type Role = "admin" | "member";

    interface UserPayload {
      uid: number;
      role: Role;
    }

    // Merge into Express types:
    interface Request {
      user?: UserPayload;
      // optionally, if you attach loaded task:
      task?: any;
    }
  }
}

export {};
