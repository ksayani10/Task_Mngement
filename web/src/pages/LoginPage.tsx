import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, endpoints, setToken, type AuthResp } from "../lib/api";

export default function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@demo.test");
  const [password, setPassword] = useState("Passw0rd!");
  const [err, setErr] = useState("");

  async function submit() {
    try {
      setErr("");
      // inside your login handler
const data = await api<AuthResp>(endpoints.login(), { method: "POST", body: JSON.stringify({ email, password }) });
setToken(data.token);
localStorage.setItem("user", JSON.stringify(data.user));
if (data.user.role === "admin") {
  nav("/projects", { replace: true });
} else {
  nav("/my-tasks", { replace: true });
}

    } catch (e: any) {
      setErr(e.message || "Login failed");
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: "48px auto" }}>
      <h1>Sign in</h1>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={{width:"100%",margin:"6px 0"}} />
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" style={{width:"100%",margin:"6px 0"}} />
      <button onClick={submit}>Sign in</button>
      {err && <div style={{ color: "crimson", marginTop: 8 }}>{err}</div>}
    </div>
  );
}
