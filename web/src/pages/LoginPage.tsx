// web/src/pages/LoginPage.tsx
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  const nav = useNavigate();
  return (
    <div style={{ maxWidth: 720, margin: "48px auto" }}>
      <h1>Login</h1>
      <LoginForm onLoggedIn={() => nav("/projects", { replace: true })} />
    </div>
  );
}
