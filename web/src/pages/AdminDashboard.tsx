// web/src/pages/AdminDashboard.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, endpoints, type Project } from "../lib/api";

type Stats = {
  projects: number;
  tasks: number;
};

export default function AdminDashboard() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<Stats>({ projects: 0, tasks: 0 });

  // form state for creating a project
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const canSubmit = useMemo(() => name.trim().length > 0, [name]);

  useEffect(() => {
    (async () => {
      try {
        setErr(null);
        setLoading(true);

        // Load projects (with task counts)
        const proj = await api<Project[]>(endpoints.projects());

        // Optional: if you have /tasks endpoint returning all tasks
        // you can compute stats; otherwise compute from counts.
        const taskTotal =
          proj.reduce((sum, p) => sum + (p._count?.tasks ?? 0), 0);

        setProjects(proj);
        setStats({ projects: proj.length, tasks: taskTotal });
      } catch (e: any) {
        setErr(e?.message ?? "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function createProject(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setErr(null);

      // optimistic add
      const temp: Project = {
        id: -Date.now(),
        name: name.trim(),
        description: description.trim() || null,
        _count: { tasks: 0 },
      };
      setProjects((prev) => [temp, ...prev]);

      const created = await api<Project>(endpoints.projects(), {
        method: "POST",
        body: JSON.stringify({ name: name.trim(), description: description.trim() || null }),
      });

      // replace temp with server copy
      setProjects((prev) => [created, ...prev.filter((p) => p.id !== temp.id)]);
      setName("");
      setDescription("");
    } catch (e: any) {
      setErr(e?.message ?? "Failed to create project");
      // rollback optimistic add
      setProjects((prev) => prev.filter((p) => p.id >= 0));
    }
  }

  return (
    <div style={wrap}>
      <header style={{ marginBottom: 24, display: "flex", alignItems: "baseline", gap: 12 }}>
        <h1 style={{ fontSize: 28, margin: 0 }}>Admin Dashboard</h1>
        <Link to="/projects" style={linkBtn}>View all projects</Link>
      </header>

      {err && <div style={errorBox}>{err}</div>}

      <section style={grid}>
        <div style={card}>
          <div style={kpiValue}>{stats.projects}</div>
          <div style={kpiLabel}>Projects</div>
        </div>
        <div style={card}>
          <div style={kpiValue}>{stats.tasks}</div>
          <div style={kpiLabel}>Total Tasks</div>
        </div>
      </section>

      <section style={{ marginTop: 28 }}>
        <h2 style={h2}>Create a project</h2>
        <form onSubmit={createProject} style={formRow}>
          <input
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={input}
          />
          <input
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={input}
          />
          <button type="submit" disabled={!canSubmit} style={primaryBtn}>
            Create
          </button>
        </form>
      </section>

      <section style={{ marginTop: 28 }}>
        <h2 style={h2}>Recent projects</h2>
        {loading ? (
          <div>Loading…</div>
        ) : projects.length === 0 ? (
          <div>No projects yet.</div>
        ) : (
          <ul style={{ paddingLeft: 16 }}>
            {projects.map((p) => (
              <li key={p.id} style={{ margin: "8px 0" }}>
                <button
                  onClick={() => nav(`/projects/${p.id}`)}
                  style={linkLike}
                  title="Open project"
                >
                  {p.name}
                </button>{" "}
                <span style={{ color: "#666" }}>
                  ({p._count?.tasks ?? 0} tasks)
                </span>
                {p.description ? (
                  <div style={{ color: "#666", fontSize: 13 }}>{p.description}</div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

/* ---- inline styles (simple, no external CSS needed) ---- */
const wrap: React.CSSProperties = {
  maxWidth: 980,
  margin: "36px auto",
  fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 16,
};

const card: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 16,
  background: "#fff",
  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
};

const kpiValue: React.CSSProperties = { fontSize: 28, fontWeight: 700, lineHeight: 1.1 };
const kpiLabel: React.CSSProperties = { color: "#6b7280", marginTop: 4 };

const h2: React.CSSProperties = { fontSize: 18, margin: "0 0 12px" };

const formRow: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "2fr 3fr auto",
  gap: 8,
  alignItems: "center",
};

const input: React.CSSProperties = {
  padding: "10px 12px",
  border: "1px solid #d1d5db",
  borderRadius: 8,
  outline: "none",
};

const primaryBtn: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 8,
  border: "1px solid #2563eb",
  background: "#2563eb",
  color: "#fff",
  cursor: "pointer",
};

const linkBtn: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  textDecoration: "none",
  color: "#111827",
  background: "#fafafa",
};

const linkLike: React.CSSProperties = {
  background: "transparent",
  border: "none",
  color: "#2563eb",
  textDecoration: "underline",
  cursor: "pointer",
  fontSize: 16,
};

const errorBox: React.CSSProperties = {
  border: "1px solid #fecaca",
  background: "#fff1f2",
  color: "#991b1b",
  padding: 12,
  borderRadius: 8,
  marginBottom: 16,
};
