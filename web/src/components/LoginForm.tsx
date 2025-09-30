import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, endpoints, setToken, setRole, type AuthResp } from "../lib/api";

export default function LoginForm() {
  const nav = useNavigate();

  // Demo defaults; change as you like
  const [email, setEmail] = useState("admin@demo.test");
  const [password, setPassword] = useState("Passw0rd!");
  const [err, setErr] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    try {
      setErr("");
      setLoading(true);

      const data = await api<AuthResp>(
        endpoints.login(),
        { method: "POST", body: JSON.stringify({ email, password }) }
      );

      // Persist auth
      setToken(data.token);
      setRole(data.user.role);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Route by role
      if (data.user.role === "admin") {
        nav("/projects", { replace: true });
      } else {
        nav("/my-tasks", { replace: true });
      }
    } catch (e: any) {
      setErr(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: 520, margin: "48px auto" }}>
      <h1>Sign in</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", margin: "6px 0" }}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", margin: "6px 0" }}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </button>

      {err && <div style={{ color: "crimson", marginTop: 8 }}>{err}</div>}
    </form>
  );
}
