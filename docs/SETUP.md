# Local Setup Guide

This project has two independently runnable services:

- **frontend/** — React + TypeScript + Vite + Three.js editor (what users interact with)
- **backend/** — Node.js + Express API (health check, scene validation, future server-side features)

Supabase provides the database, authentication, and file storage — there is no backend of its own to install.

## Prerequisites

- Node.js 18 or newer (20 LTS recommended)
- npm 9+
- A free [Supabase](https://supabase.com) account (see `docs/SUPABASE_SETUP.md`)

## 1. Clone / unzip the project

```bash
unzip 3d-design-platform.zip
cd 3d-design-platform
```

## 2. Set up Supabase first

Follow `docs/SUPABASE_SETUP.md` completely before running the frontend, so you have your
project URL and anon key ready.

## 3. Configure environment variables

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

Edit `frontend/.env`:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_API_BASE_URL=http://localhost:4000
```

Edit `backend/.env` (only needed if/when you extend the backend with privileged operations):

```
PORT=4000
CORS_ORIGIN=http://localhost:5173
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

> The frontend talks to Supabase **directly** using the public anon key + Row Level Security,
> so the backend is not required just to save/load projects. It exists as a place to add
> server-side logic later (see `docs/ARCHITECTURE.md`).

## 4. Install dependencies

```bash
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

## 5. Run in development

In one terminal:

```bash
cd frontend
npm run dev
```

Open http://localhost:5173 — you should see the 3D editor. Without Supabase configured,
the viewport and local editing work fine in "demo mode"; Sign In / Save will show a
configuration warning until you complete Supabase setup.

In a second terminal (optional, only needed for the API):

```bash
cd backend
npm run dev
```

The API will be available at http://localhost:4000/api/health.

## 6. Verify each stage works

- [ ] 3D viewport loads with grid + axes, camera orbit/zoom/pan work
- [ ] Add Cube/Sphere/Cylinder/Plane from the left panel
- [ ] Click an object to select it (highlighted outline)
- [ ] Move / Rotate / Scale gizmo appears and works (shortcuts: W / E / R)
- [ ] Duplicate (Ctrl/Cmd+D) and Delete (Backspace/Delete) work
- [ ] Properties panel edits position/rotation/scale numerically
- [ ] Material editor changes color/metalness/roughness live
- [ ] Sign up / sign in works (after Supabase setup)
- [ ] Save creates a row in the `projects` table; Open lists and loads it
- [ ] Export downloads a `.json` scene file

## Building for production

```bash
cd frontend
npm run build      # outputs static files to frontend/dist
npm run preview    # serve the production build locally to sanity-check it
```

```bash
cd backend
npm run build       # compiles TypeScript to backend/dist
npm start           # runs the compiled server
```

See `docs/RENDER_DEPLOYMENT.md` for deploying both to Render.
