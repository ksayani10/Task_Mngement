// web/src/components/LoginForm.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE = import.meta.env.VITE_API_BASE as string;

export default function LoginForm() {
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@demo.test");
  const [password, setPassword] = useState("Passw0rd!");
  const [err, setErr] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    try {
      const res = await fetch(`${BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Login failed (${res.status})`);
      }

      const data = await res.json() as { token: string; user: { role: "admin" | "member" } };
      localStorage.setItem("token", data.token);

      // redirect (admin → /projects, member → first project page or /projects)
      nav(data.user.role === "admin" ? "/projects" : "/projects", { replace: true });
    } catch (e: any) {
      setErr(e.message ?? "Login failed");
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 480, margin: "48px auto" }}>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: 8, padding: 8 }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: 12, padding: 8 }}
      />
      <button type="submit">Sign in</button>
      {err && <div style={{ color: "crimson", marginTop: 8 }}>{err}</div>}
    </form>
  );
}
