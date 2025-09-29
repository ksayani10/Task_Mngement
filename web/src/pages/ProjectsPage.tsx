import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { endpoints, type Project } from "../lib/api";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(endpoints.projects(), {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) throw new Error(await res.text());
        setProjects(await res.json());
      } catch (e: any) {
        setErr(e?.message ?? "Failed to load projects");
      }
    })();
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      <div>
        <h2>Projects</h2>
        {err && <div style={{ color: "crimson" }}>{err}</div>}
        <ul>
          {projects.map((p) => (
            <li key={p.id}>
              <Link to={`/projects/${p.id}`}>{p.name}</Link> ({p._count?.tasks ?? 0} tasks)
            </li>
          ))}
        </ul>
      </div>
      <div />
    </div>
  );
}
