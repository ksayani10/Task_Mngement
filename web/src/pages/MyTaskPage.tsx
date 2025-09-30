// web/src/pages/MyTasksPage.tsx
import { useEffect, useState } from "react";
import { api, endpoints, type Task, type TaskPayload } from "../lib/api";

export default function MyTasksPage() {
  const [items, setItems] = useState<Task[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState<number>(1);

  async function load() {
    try {
      setErr(null);
      setItems(await api<Task[]>(endpoints.meTasks()));
    } catch (e: any) {
      setErr(e.message);
    }
  }

  useEffect(() => { load(); }, []);

  async function create() {
    try {
      const body: TaskPayload = { title, projectId };
      await api<Task>(endpoints.tasks(), { method: "POST", body: JSON.stringify(body) });
      setTitle("");
      await load();
    } catch (e: any) {
      setErr(e.message);
    }
  }

  async function update(id: number, patch: Partial<TaskPayload>) {
    try {
      await api<Task>(endpoints.task(id), { method: "PATCH", body: JSON.stringify(patch) });
      await load();
    } catch (e: any) {
      setErr(e.message);
    }
  }

  async function remove(id: number) {
    try {
      await api<void>(endpoints.task(id), { method: "DELETE" });
      await load();
    } catch (e: any) {
      setErr(e.message);
    }
  }

  return (
    <div style={{maxWidth: 900, margin: "2rem auto"}}>
      <h1>My tasks</h1>
      {err && <div style={{color:"crimson"}}>{err}</div>}

      <div style={{display:"flex", gap:8, margin:"12px 0"}}>
        <input placeholder="New task title" value={title} onChange={e=>setTitle(e.target.value)} />
        <input type="number" min={1} value={projectId} onChange={e=>setProjectId(Number(e.target.value))} />
        <button onClick={create}>Add</button>
      </div>

      <ul>
        {items.map(t => (
          <li key={t.id} style={{margin:"8px 0"}}>
            <b>#{t.id}</b> {t.title} — <i>{t.status ?? "todo"}</i>
            <button onClick={()=>update(t.id, { status: "in_progress" })} style={{marginLeft:8}}>Start</button>
            <button onClick={()=>update(t.id, { status: "done" })} style={{marginLeft:8}}>Done</button>
            <button onClick={()=>remove(t.id)} style={{marginLeft:8}}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
