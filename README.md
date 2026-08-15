# 3D Design Studio

Browser-based 3D editor: create primitives, transform them, edit materials, save/load from **browser localStorage**, and export JSON.

**Local testing mode** — no Supabase or backend required. Projects are cached in your browser.

## Quick start

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

## Features

- Interactive WebGL viewport (orbit / zoom / pan)
- Primitives: Cube, Sphere, Cylinder, Plane
- Move / Rotate / Scale (W / E / R) + gizmo
- Properties + material editor (color, metalness, roughness)
- **Save / Open / Delete** → stored in `localStorage`
- Export scene as JSON
- Keyboard shortcuts: W/E/R, Delete, Ctrl/Cmd+D

## Project layout

```
frontend/     React + Vite + R3F editor (run this)
backend/      Optional Express API (not needed for local testing)
database/     Supabase SQL (optional, for later cloud mode)
docs/         Architecture & setup notes
```

## How saves work

Projects are written to `localStorage` under the key `3d-design-studio:projects`.
Clearing site data for localhost will wipe them. Export JSON if you need a backup.

## Optional: cloud later

The original Supabase schema lives under `database/`. To re-enable cloud, restore
`@supabase/supabase-js` in `frontend/package.json` and the cloud versions of
`useAuth` / `useProjectPersistence`.
