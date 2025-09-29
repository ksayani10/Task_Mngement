// api/src/routes/projects.ts
import { Router } from "express";
import { db } from "../db";
import { requireAuth, requireRole } from "../middleware/auth"; // <-- exact names exported above

const r = Router();

// Admin-only project list
r.get("/projects", requireAuth, requireRole("admin"), async (_req, res) => {
  const projects = await db.project.findMany({
    orderBy: { id: "asc" },
    include: { _count: { select: { tasks: true } } },
  });
  res.json(projects);
});

export default r;
