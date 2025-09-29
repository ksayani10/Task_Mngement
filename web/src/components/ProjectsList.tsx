import { useEffect, useState } from "react";
import { api, endpoints, type Project } from "../lib/api";

type Props = { onPick: (id: number) => void };

export default function ProjectsList({ onPick }: Props) {
  const [items, setItems] = useState<Project[]>([]);
  const [err, setErr] = useState("");

  useEffect(() => { (async ()=>{
    try { setItems(await api<Project[]>(endpoints.projects())); }
    catch(e:any){ setErr(e.message); }
  })(); }, []);

  if (err) return <div style={{color:"crimson"}}>{err}</div>;
  if (!items.length) return <div>No projects.</div>;

  return (
    <ul style={{ paddingLeft:18 }}>
      {items.map(p=>(
        <li key={p.id}>
          <button onClick={()=>onPick(p.id)} style={linkBtn}>{p.name}</button>{" "}
          <small>({p._count?.tasks ?? 0} tasks)</small>
        </li>
      ))}
    </ul>
  );
}
const linkBtn: React.CSSProperties = { background:"none", border:"none", padding:0, textDecoration:"underline", cursor:"pointer", color:"#125" };
