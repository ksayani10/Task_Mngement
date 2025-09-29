// web/src/pages/SignupPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, endpoints, setToken, type AuthResp, type Role } from "../lib/api";

export default function SignupPage() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("member");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setErr("");
    setLoading(true);
    try {
      const data = await api<AuthResp>(endpoints.signup(), {
        method: "POST",
        body: JSON.stringify({ name, email, password, role }),
      });
      setToken(data.token);
      // after sign-up, either go straight to dashboard…
      nav("/projects", { replace: true });
      // …or redirect to /login instead:
      // nav("/login", { replace: true });
    } catch (e: any) {
      setErr(e.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: "48px auto" }}>
      <h1>Sign up</h1>
      <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
      <div>
        <label><input type="radio" name="role" checked={role==="member"} onChange={()=>setRole("member")} /> Member</label>
        <label><input type="radio" name="role" checked={role==="admin"} onChange={()=>setRole("admin")} /> Admin</label>
      </div>
      <button onClick={submit} disabled={loading}>
        {loading ? "Creating..." : "Create account"}
      </button>
      {err && <div style={{ color: "crimson" }}>{err}</div>}
    </div>
  );
}

