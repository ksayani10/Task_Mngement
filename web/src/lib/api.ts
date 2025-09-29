// web/src/lib/api.ts

// Base URL for your API (fallback to localhost:4000 in dev)
export const BASE: string =
  (import.meta.env.VITE_API_BASE as string) ?? "http://localhost:4000";

// ---------- Types ----------
export type Role = "admin" | "member";

export interface AuthResp {
  token: string;
  user: { id: number; name: string; email: string; role: Role };
}

// kept for older imports that referenced LoginResp
export type LoginResp = AuthResp;

export interface Project {
  id: number;
  name: string;
  description?: string | null;
  // present on list endpoint when you include counts
  _count?: { tasks: number };
}

export interface Task {
  id: number;
  title: string;
  projectId: number;
  status?: "todo" | "in_progress" | "done";
  dueDate?: string | null;
  // NOTE: correct property name is 'assignee'
  assignee?: { id: number; name: string } | null;
  // for optimistic locking if you add it later
  version?: number;
}

// ---------- Token helpers ----------
const TOKEN_KEY = "token";

export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// ---------- Endpoints ----------
// Always return a FULL URL so callers can pass directly to api()
export const endpoints = {
  login: () => `${BASE}/auth/login`,
  signup: () => `${BASE}/auth/signup`,

  projects: () => `${BASE}/projects`,
  project: (id: number) => `${BASE}/projects/${id}`,
  projectTasks: (id: number) => `${BASE}/projects/${id}/tasks`,

  tasks: () => `${BASE}/tasks`,
  task: (id: number) => `${BASE}/tasks/${id}`,
};

// ---------- Fetch helper ----------
// Pass endpoints.*() result directly here.
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
    // Try to surface server JSON error; otherwise show raw text/status
    try {
      const j = text ? JSON.parse(text) : null;
      throw new Error(j?.error ?? res.statusText);
    } catch {
      throw new Error(text || res.statusText);
    }
  }

  // some endpoints may return 204 No Content
  return text ? (JSON.parse(text) as T) : (undefined as unknown as T);
}
