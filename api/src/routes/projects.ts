// // api/src/routes/projects.ts
// import { Router } from "express";
// import { db } from "../db";
// import { requireAuth, requireRole } from "../middleware/auth"; // <-- exact names exported above

// const r = Router();

// // Admin-only project list
// r.get("/projects", requireAuth, requireRole("admin"), async (_req, res) => {
//   const projects = await db.project.findMany({
//     orderBy: { id: "asc" },
//     include: { _count: { select: { tasks: true } } },
//   });
//   res.json(projects);
// });

// export default r;
// api/src/routes/projects.ts
import { Router } from "express";
import { db } from "../db";
import { requireAuth } from "../middleware/auth";

const r = Router();

/** List projects (admin view or everyone, depending on your app) */
r.get("/projects", requireAuth, async (_req, res) => {
  const projects = await db.project.findMany({
    orderBy: { id: "asc" },
    include: { _count: { select: { tasks: true } } },
  });
  res.json(projects);
});

/** Tasks for a project
 *  - Admin: all tasks in that project
 *  - Member: only tasks assigned to the logged-in user in that project
 */
r.get("/projects/:id/tasks", requireAuth, async (req, res) => {
  const projectId = Number(req.params.id);
  if (Number.isNaN(projectId)) {
    return res.status(400).json({ error: "Invalid project id" });
  }

  const where: any = { projectId };
  if (req.user!.role !== "admin") {
    // members see only their tasks within the project
    where.assigneeUserId = req.user!.uid;
  }

  const tasks = await db.task.findMany({
    where,
    orderBy: { id: "asc" },
    include: { assignee: { select: { id: true, name: true } } },
  });

  res.json(tasks);
});

export default r;
