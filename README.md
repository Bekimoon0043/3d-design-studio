# 3D Design Platform

A full-stack 3D design studio built with React, Three.js (React Three Fiber), Zustand, and Supabase.

## Project Structure

```
3d-design-platform/
├── frontend/          # React + Vite + R3F application
├── backend/           # Optional Node/Express API
├── database/          # Supabase SQL schemas & policies
├── docs/              # Architecture & setup guides
└── render.yaml        # Render deployment config
```

## Quick Start

### Frontend

```bash
cd frontend
cp .env.example .env   # Add your Supabase keys
npm install
npm run dev
```

### Backend (optional)

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### Database

See `docs/SUPABASE_SETUP.md` and run the SQL files in `database/` in your Supabase project.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Setup Guide](docs/SETUP.md)
- [Supabase Setup](docs/SUPABASE_SETUP.md)
- [Render Deployment](docs/RENDER_DEPLOYMENT.md)

## Tech Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS, React Three Fiber, @react-three/drei, Zustand
- **Backend:** Node.js, Express, TypeScript
- **Database / Auth / Storage:** Supabase (PostgreSQL)
- **Deployment:** Render
