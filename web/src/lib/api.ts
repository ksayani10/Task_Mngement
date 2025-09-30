// web/src/lib/api.ts

// ---- Base URL (falls back to localhost:4000) ----
export const BASE: string =
  (import.meta.env.VITE_API_BASE as string) || "http://localhost:4000";

// ---- Types ----
export type Role = "admin" | "member";

export interface AuthResp {
  token: string;
  user: { id: number; name: string; email: string; role: Role };
}

export interface Project {
  id: number;
  name: string;
  description?: string | null;
  _count?: { tasks: number };
}

export interface Task {
  id: number;
  title: string;
  projectId: number;
  status?: "todo" | "in_progress" | "done";
  assignee?: { id: number; name: string } | null;
  dueDate?: string | null;
  version?: number;
}

// ---- add this near your other types ----
export type TaskPayload = {
  // use for both create & patch:
  title?: string;
  projectId?: number;
  status?: "todo" | "in_progress" | "done";
  dueDate?: string | null;
};


// ---- Storage helpers ----
const TOKEN_KEY = "token";
const ROLE_KEY = "role";

export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const setRole = (r: Role) => localStorage.setItem(ROLE_KEY, r);
export const getRole = (): Role | null =>
  (localStorage.getItem(ROLE_KEY) as Role | null) ?? null;
export const clearRole = () => localStorage.removeItem(ROLE_KEY);

// ---- Endpoints (return full URLs) ----
export const endpoints = {
  // auth
  login: () => `${BASE}/auth/login`,
  signup: () => `${BASE}/auth/signup`,

  // projects
  projects: () => `${BASE}/projects`,
  project: (id: number) => `${BASE}/projects/${id}`,
  projectTasks: (id: number) => `${BASE}/projects/${id}/tasks`,

  // tasks (member’s own)
  meTasks: () => `${BASE}/tasks/my`,
  tasks: () => `${BASE}/tasks`,
  task: (id: number) => `${BASE}/tasks/${id}`,
};

// ---- Fetch helper ----
// Pass endpoints.*() directly here. Automatically adds Authorization if token exists.
export async function api<T>(url: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();

  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers || {}),
    },
  });

  const text = await res.text();

  if (!res.ok) {
    try {
      const j = text ? JSON.parse(text) : null;
      throw new Error(j?.error ?? res.statusText);
    } catch {
      throw new Error(text || res.statusText);
    }
  }

  // some endpoints may return 204
  return text ? (JSON.parse(text) as T) : (undefined as unknown as T);
}
