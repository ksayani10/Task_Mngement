// web/src/components/TasksForProject.tsx
import { useEffect, useState } from "react";
import { endpoints, type Task } from "../lib/api";

export default function TasksForProject({ projectId }: { projectId: number }) {
  const [items, setItems] = useState<Task[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch(endpoints.projectTasks(projectId), {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) throw new Error(await res.text());
        const data: Task[] = await res.json();
        if (alive) setItems(data);
      } catch (e: any) {
        if (alive) setErr(e?.message ?? "Failed to load tasks");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [projectId]);

  if (loading) return <div>Loading…</div>;
  if (err) return <div style={{ color: "crimson" }}>{err}</div>;
  if (!items.length) return <div>No tasks.</div>;

  return (
    <ul style={{ lineHeight: 1.6 }}>
      {items.map(t => (
        <li key={t.id}>
          <strong>{t.title}</strong>
          {t.assignee ? <> — {t.assignee.name}</> : null}
        </li>
      ))}
    </ul>
  );
}
