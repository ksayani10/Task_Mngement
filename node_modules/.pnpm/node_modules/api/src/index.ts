// api/src/index.ts
import express from "express";
import cors from "cors";

import auth from "./routes/auth";
import projects from "./routes/projects";
import tasks from "./routes/tasks";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/auth", auth);
app.use(projects);
app.use(tasks);

// 👇 export the app as the DEFAULT export
export default app;
