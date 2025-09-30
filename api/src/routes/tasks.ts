// api/src/routes/tasks.ts
import { Router } from "express";
import { db } from "../db";
import { requireAuth } from "../middleware/auth";
import { requireAdmin } from "../middleware/rbac";

const r = Router();

type Status = "todo" | "in_progress" | "done";
const ALLOWED_STATUS = new Set<Status>(["todo", "in_progress", "done"]);

function asInt(v: any): number | null {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function asISODate(v: any): string | null | undefined {
  if (v === undefined) return undefined;
  if (v === null || v === "") return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

/**
 * GET /tasks/my
 * Return tasks assigned to the authenticated user.
 */
r.get("/tasks/my", requireAuth, async (req, res) => {
  try {
    const uid = req.user!.uid;
    const tasks = await db.task.findMany({
      where: { assigneeUserId: uid },
      orderBy: { id: "asc" },
      include: { assignee: { select: { id: true, name: true } } },
    });
    res.json(tasks);
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? "Failed to load tasks" });
  }
});

/**
 * GET /projects/:id/tasks
 * - admin: all tasks for project
 * - member: only their own tasks for project
 */
r.get("/projects/:id/tasks", requireAuth, async (req, res) => {
  try {
    const projectId = asInt(req.params.id);
    if (!projectId) return res.status(400).json({ error: "Invalid project id" });

    const where =
      req.user!.role === "admin"
        ? { projectId }
        : { projectId, assigneeUserId: req.user!.uid };

    const tasks = await db.task.findMany({
      where,
      orderBy: { id: "asc" },
      include: { assignee: { select: { id: true, name: true } } },
    });
    res.json(tasks);
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? "Failed to load project tasks" });
  }
});

/**
 * POST /tasks
 * Member creates a task **for themselves**.
 * Body: { projectId: number, title: string, dueDate?: string }
 */
r.post("/tasks", requireAuth, async (req, res) => {
  try {
    const uid = req.user!.uid;
    const { projectId, title, dueDate } = req.body ?? {};
    const pid = asInt(projectId);

    if (!pid || !title?.trim()) {
      return res.status(400).json({ error: "Missing projectId or title" });
    }

    // Ensure project exists
    const project = await db.project.findUnique({ where: { id: pid } });
    if (!project) return res.status(404).json({ error: "Project not found" });

    const task = await db.task.create({
      data: {
        projectId: pid,
        title: String(title),
        assigneeUserId: uid,
        dueDate: asISODate(dueDate) ?? null,
        status: "todo",
      },
    });
    res.status(201).json(task);
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? "Failed to create task" });
  }
});

/**
 * GET /tasks/:id
 * Read a single task (owner or admin).
 */
r.get("/tasks/:id", requireAuth, async (req, res) => {
  try {
    const id = asInt(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });

    const task = await db.task.findUnique({
      where: { id },
      include: { assignee: { select: { id: true, name: true } } },
    });
    if (!task) return res.status(404).json({ error: "Not found" });

    const isOwner = task.assigneeUserId === req.user!.uid;
    const isAdmin = req.user!.role === "admin";
    if (!isOwner && !isAdmin) return res.status(403).json({ error: "Forbidden" });

    res.json(task);
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? "Failed to load task" });
  }
});

/**
 * PATCH /tasks/:id
 * Update a task (owner or admin).
 * Body: { title?, status?, dueDate? }
 */
r.patch("/tasks/:id", requireAuth, async (req, res) => {
  try {
    const id = asInt(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });

    const task = await db.task.findUnique({ where: { id } });
    if (!task) return res.status(404).json({ error: "Not found" });

    const isOwner = task.assigneeUserId === req.user!.uid;
    const isAdmin = req.user!.role === "admin";
    if (!isOwner && !isAdmin) return res.status(403).json({ error: "Forbidden" });

    const { title, status, dueDate } = req.body ?? {};
    if (status && !ALLOWED_STATUS.has(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updated = await db.task.update({
      where: { id },
      data: {
        title: title === undefined ? undefined : String(title),
        status: status as Status | undefined,
        dueDate: asISODate(dueDate),
      },
    });
    res.json(updated);
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? "Failed to update task" });
  }
});

/**
 * DELETE /tasks/:id
 * Delete a task (owner or admin).
 */
r.delete("/tasks/:id", requireAuth, async (req, res) => {
  try {
    const id = asInt(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });

    const task = await db.task.findUnique({ where: { id } });
    if (!task) return res.status(404).json({ error: "Not found" });

    const isOwner = task.assigneeUserId === req.user!.uid;
    const isAdmin = req.user!.role === "admin";
    if (!isOwner && !isAdmin) return res.status(403).json({ error: "Forbidden" });

    await db.task.delete({ where: { id } });
    res.status(204).end();
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? "Failed to delete task" });
  }
});

/**
 * PATCH /tasks/:id/assign
 * Admin-only: assign task to any user.
 * Body: { assigneeUserId: number }
 */
r.patch("/tasks/:id/assign", requireAuth, requireAdmin, async (req, res) => {
  try {
    const id = asInt(req.params.id);
    const assigneeUserId = asInt(req.body?.assigneeUserId);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    if (!assigneeUserId) return res.status(400).json({ error: "assigneeUserId required" });

    // ensure user exists
    const user = await db.user.findUnique({ where: { id: assigneeUserId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const updated = await db.task.update({
      where: { id },
      data: { assigneeUserId },
    });
    res.json(updated);
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? "Failed to assign task" });
  }
});

export default r;
