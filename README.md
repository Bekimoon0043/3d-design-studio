# 3D Design Studio

A browser-based 3D design platform: create, transform, and style primitive objects in an
interactive WebGL viewport, save projects to the cloud, and export scenes — all from a
professional dark-themed editor UI.

![tech](https://img.shields.io/badge/frontend-React%20%2B%20TypeScript%20%2B%20Three.js-4f7cff)
![tech](https://img.shields.io/badge/backend-Node.js%20%2B%20Express-4f7cff)
![tech](https://img.shields.io/badge/database-Supabase-4f7cff)

## Features

- **Interactive 3D viewport** — orbit/zoom/pan camera, grid + axis helpers, click-to-select
- **Object creation** — Cube, Sphere, Cylinder, Plane
- **Object editing** — move, rotate, scale (draggable gizmo + numeric fields), duplicate, delete
- **Properties panel** — name, position X/Y/Z, rotation X/Y/Z, scale X/Y/Z
- **Material editor** — color picker, metalness, roughness
- **Projects** — sign up / sign in, save, open, and manage designs, backed by Supabase
- **Export** — download the current scene as JSON
- **Keyboard shortcuts** — `W`/`E`/`R` to switch tools, `Delete` to remove, `Ctrl/Cmd+D` to duplicate

## Tech stack

| Layer          | Technology                                              |
|----------------|----------------------------------------------------------|
| Frontend       | React, TypeScript, Vite, Three.js, React Three Fiber, Drei, Tailwind CSS |
| Backend        | Node.js, Express                                         |
| Database       | Supabase (Postgres)                                       |
| Authentication | Supabase Auth                                              |
| Storage        | Supabase Storage                                            |

## Project structure

```
3d-design-platform/
├── frontend/            React + Vite + Three.js editor (the app users interact with)
│   ├── src/
│   │   ├── components/  Layout, Viewport, Panels, Auth
│   │   ├── store/       Zustand scene store
│   │   ├── hooks/       auth, persistence, keyboard shortcuts
│   │   ├── types/       shared TypeScript types
│   │   └── utils/       id generation, JSON export
│   └── .env.example
├── backend/              Express API (health check, scene validation, extension point)
│   ├── src/
│   │   ├── routes/
│   │   └── middleware/
│   └── .env.example
├── database/             SQL for Supabase: schema, RLS policies, storage bucket
│   ├── schema.sql
│   ├── policies.sql
│   └── storage_setup.sql
├── docs/                 Setup, Supabase, deployment, and architecture guides
│   ├── SETUP.md
│   ├── SUPABASE_SETUP.md
│   ├── RENDER_DEPLOYMENT.md
│   └── ARCHITECTURE.md
├── render.yaml            Render Blueprint (deploy both services in one step)
└── README.md              You are here
```

## Quick start

```bash
# 1. Set up Supabase (see docs/SUPABASE_SETUP.md), then:
cp frontend/.env.example frontend/.env   # fill in your Supabase URL + anon key
cp backend/.env.example backend/.env

# 2. Install and run the frontend
cd frontend
npm install
npm run dev
# → open http://localhost:5173

# 3. (Optional) install and run the backend API
cd ../backend
npm install
npm run dev
# → http://localhost:4000/api/health
```

Full walkthrough, including verification steps for each feature: **[docs/SETUP.md](docs/SETUP.md)**.

## Deploying

This project deploys to [Render](https://render.com) as two services — a static site for the
frontend and a web service for the backend — using the included `render.yaml` Blueprint, or
manually. Full instructions: **[docs/RENDER_DEPLOYMENT.md](docs/RENDER_DEPLOYMENT.md)**.

Supabase setup (database schema, auth, storage): **[docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)**.

Architecture notes and future improvement ideas: **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**.

## License

This starter project is provided as-is for you to use, modify, and deploy freely.
