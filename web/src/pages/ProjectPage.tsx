// ProjectPage.tsx
import { useParams, Link } from "react-router-dom";
import TasksForProject from "../components/TasksForProject";
import type { CSSProperties } from "react";   // ⬅ add

export default function ProjectPage() {
  const { id } = useParams();
  const pid = Number(id);

  // Guard invalid ids (e.g., user typed /projects/abc)
  if (!pid) {
    return (
      <div style={box}>
        <p><Link to="/projects">← Back to projects</Link></p>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>Invalid project id</h1>
      </div>
    );
  }

  return (
    <div style={box}>
      <p><Link to="/projects">← Back to projects</Link></p>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Tasks for project {pid}</h1>
      <TasksForProject projectId={pid} />
    </div>
  );
}

const box: CSSProperties = { maxWidth: 820, margin: "36px auto", fontFamily: "system-ui, Arial, sans-serif" };
