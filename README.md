## 🧭 NovaVantix — Project & Task Tracker

 - A small full-stack app that lets admins manage projects and tasks, and members work on their own tasks. It demonstrates clean API design, RBAC with JWT, Prisma + PostgreSQL, optimistic locking, and a simple React + Vite frontend.
   
---

## 📌 Project Overview

This project implements:

- Auth: Email/password login returning a JWT.

- Roles: admin and member.

- Projects: CRUD (admin) + list.

 ## Tasks:

- Members: CRUD own tasks within assigned projects.

- Admin: create tasks, assign/unassign any task to any member, view all.

- Optimistic locking by version on updates (409 on stale, retry succeeds).

  ## Tech stack:

- API: Node.js, Express, Prisma, PostgreSQL, Zod (validation)

- Auth: JWT (HS256)

- Frontend: React (TypeScript), Vite, React Router

- DevX: pnpm, dotenv, nodemon / ts-node-dev

---

✨ Features

🔐 Login & Roles

- Email/password, returns JWT.

- Role-based access control: admin vs member.

  ---

📁 Projects (Admin)

- List, create, update, delete.

- Project detail shows tasks + assignee counts.

  ---

📝 Tasks

- Members: create/read/update/delete their own tasks.

- Admin: assign tasks to any user; view/edit all tasks.

- Status: todo | in_progress | done.

- Optimistic locking with version → conflicts return 409; UI retries.

  ---

🧭 UX States

Clear loading/error/empty states across pages.

---

🧪 Tests (outline)

Unit tests for validation + rules.

One integration test (create → stale update → 409 → retry → success).
