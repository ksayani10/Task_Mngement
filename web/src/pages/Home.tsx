import { Link } from "react-router-dom";

export default function Home() {
  return (
     <div style={{maxWidth:720, margin:"48px auto"}}>
      <h1>Welcome</h1>
      <p>Sign in or create an account.</p>
      <div style={{display:"flex", gap:12}}>
        <Link to="/login"><button>Login</button></Link>
        <Link to="/signup"><button>Create account</button></Link>
      </div>
    </div>
  );
}
// const box: React.CSSProperties = { maxWidth:720, margin:"48px auto", fontFamily:"system-ui, Arial, sans-serif" };
// const btn: React.CSSProperties = { padding:"8px 12px", borderRadius:8, border:"1px solid #ddd", background:"#fafafa", cursor:"pointer" };
