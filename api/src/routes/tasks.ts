// api/src/routes/tasks.ts
import { Router } from "express";
import { db } from "../db";
import { requireAuth } from "../middleware/auth";

const r = Router();

// GET /projects/:id/tasks - auth users can view tasks for a project
r.get("/projects/:id/tasks", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "Bad id" });

  const tasks = await db.task.findMany({
    where: { projectId: id },
    orderBy: { id: "asc" },
  });

  res.json(tasks);
});

export default r;
