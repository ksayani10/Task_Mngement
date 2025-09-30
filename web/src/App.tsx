// import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
// import Home from "./pages/Home";
// import LoginPage from "./components/LoginForm";
// import SignupPage from "./pages/SignupPage";
// import ProjectsPage from "./pages/ProjectsPage";
// import ProjectPage from "./pages/ProjectPage";
// import MyTasksPage from "./pages/MyTaskPage";
// import { getToken } from "./lib/api";

// type Role = "admin" | "member";

// function getRoleFromToken(): Role | null {
//   const t = getToken();
//   if (!t) return null;
//   try {
//     // safest: server returns role on /me or decode on server; for demo, decode payload:
//     const payload = JSON.parse(atob(t.split(".")[1]));
//     return payload.role as Role;
//   } catch {
//     return null;
//   }
// }

// function RequireAuth() {
//   const token = getToken();
//   return token ? <Outlet /> : <Navigate to="/login" replace />;
// }

// function RequireRole({ allow }: { allow: Role[] }) {
//   const role = getRoleFromToken();
//   return role && allow.includes(role) ? <Outlet /> : <Navigate to="/" replace />;
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* public */}
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/signup" element={<SignupPage />} />

//         {/* admin area */}
//         <Route element={<RequireAuth />}>
//           <Route element={<RequireRole allow={["admin"]} />}>
//             <Route path="/projects" element={<ProjectsPage />} />
//             <Route path="/projects/:id" element={<ProjectPage />} />
//           </Route>

//           {/* member area */}
//             <Route element={<RequireAuth />}>
//           <Route element={<RequireRole allow={["member"]} />}>
//             <Route path="/my-tasks" element={<MyTasksPage />} />
//           </Route>
//         </Route></Route>

//         {/* fallback */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// web/src/App.tsx
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

import Home from "./pages/Home";
import LoginPage from "./components/LoginForm";
import SignupPage from "./pages/SignupPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectPage from "./pages/ProjectPage";
import MyTasksPage from "./pages/MyTaskPage"; // <- ensure the file name matches
import { getToken } from "./lib/api";

type Role = "admin" | "member";

/** Read role from JWT (quick demo approach). Prefer a /me endpoint in production. */
function getRoleFromToken(): Role | null {
  const t = getToken();
  if (!t) return null;
  try {
    const payload = JSON.parse(atob(t.split(".")[1] ?? ""));
    return (payload?.role ?? null) as Role | null;
  } catch {
    return null;
  }
}

/** Block unauthenticated users. */
function RequireAuth() {
  const token = getToken();
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

/** Allow only specific roles. Requires the user to be authenticated first. */
function RequireRole({ allow }: { allow: Role[] }) {
  const role = getRoleFromToken();
  return role && allow.includes(role) ? <Outlet /> : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected routes (must be logged in) */}
        <Route element={<RequireAuth />}>
          {/* Admin-only area */}
          <Route element={<RequireRole allow={["admin"]} />}>
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectPage />} />
          </Route>

          {/* Member-only area */}
          <Route element={<RequireRole allow={["member"]} />}>
            <Route path="/my-tasks" element={<MyTasksPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
