# Architecture

## Overview

```
Browser (React + R3F editor)
   │
   │  direct calls, protected by Row Level Security
   ▼
Supabase (Postgres + Auth + Storage)
   ▲
   │  optional, for server-side/privileged logic
   │
Express API (Render web service)
```

The frontend talks to Supabase **directly** for everything user-scoped (auth, saving/loading
projects, storage) using the public anon key. Row Level Security policies (see
`database/policies.sql`) enforce that a user can only ever read/write their own rows — the
anon key alone is not enough to access another user's data.

The Express backend is intentionally minimal today (health check + scene shape validation). It
exists as a clean extension point for anything that shouldn't run in the browser or needs the
Supabase **service role** key — e.g. server-side glTF export, thumbnail generation, or admin
tooling — without having to restructure the frontend later.

## Frontend structure

```
frontend/src/
  components/
    Layout/     — TopBar, LeftPanel, RightPanel, ProjectBrowser
    Viewport/   — Scene (R3F Canvas), SceneObjectMesh (primitive renderer)
    Panels/     — ObjectLibrary, ToolsPanel, SceneHierarchy, PropertiesPanel, MaterialEditor
    Auth/       — AuthModal, AccountMenu
  store/
    useSceneStore.ts   — single Zustand store: objects, selection, transform mode
  hooks/
    useAuth.ts                 — tracks Supabase auth session
    useProjectPersistence.ts   — save/load/list/delete against `projects` table
    useKeyboardShortcuts.ts    — W/E/R, Delete, Ctrl+D
  types/scene.ts        — SceneObject, SceneJSON, Project types shared across the app
  utils/                — id generation, JSON export
```

State flows one way: user interacts with a panel or the viewport → calls a `useSceneStore`
action → store updates → all subscribed components (including the 3D viewport) re-render.
The transform gizmo is the only two-way link: dragging it in 3D writes back into the same store
via `setObjectTransform`, so the Properties panel and viewport never fall out of sync.

## Data model

A project's entire design lives in one `jsonb` column (`projects.scene_json`), shaped as:

```json
{
  "version": 1,
  "objects": [
    {
      "id": "uuid",
      "name": "Cube 1",
      "type": "cube",
      "position": [0, 0.5, 0],
      "rotation": [0, 0, 0],
      "scale": [1, 1, 1],
      "material": { "color": "#4f7cff", "metalness": 0.2, "roughness": 0.6 }
    }
  ]
}
```

This keeps saves atomic (one row write) and makes the format trivial to version — the `version`
field lets future migrations transform older scenes on load.

## Why these libraries

- **React Three Fiber + Drei**: idiomatic React bindings for Three.js; Drei's `OrbitControls`,
  `TransformControls`, `Grid`, and `Environment` cover the required viewport features without
  hand-rolling raycasting/gizmo math.
- **Zustand**: much lighter than Redux for this scope, works cleanly outside React components
  (needed inside the R3F render loop), and has no boilerplate for the amount of state here.
- **Supabase**: gives Postgres + Auth + Storage + Row Level Security out of the box, avoiding a
  hand-rolled auth/session backend entirely.

## Future improvements

Roughly in order of impact:

1. **Undo/redo** — the store already centralizes all mutations, so a command-history middleware
   (e.g. wrapping each action to push a diff onto a stack) would be a self-contained addition.
2. **Real glTF/OBJ export** — currently export is a JSON snapshot of the scene graph. Adding
   `GLTFExporter` from three.js (client-side) or a server-side conversion route in the backend
   would let users take designs into Blender, Unity, etc.
3. **Multi-select and grouping** — select multiple objects and transform them together.
4. **More primitives & imported meshes** — cone, torus, and glTF/OBJ file import via Supabase
   Storage uploads (the `assets` table already anticipates this).
5. **Autosave** — debounce `saveProject()` on scene changes instead of requiring a manual click.
6. **Collaborative editing** — Supabase Realtime could broadcast scene changes between multiple
   users on the same project.
7. **Texture support in the Material Editor** — upload an image (via the `project-assets`
   storage bucket) and apply it as a `map` on the selected object's material.
8. **Snapping** — optional grid/angle snapping while dragging the transform gizmo.
9. **Performance for large scenes** — instanced meshes for repeated primitives, and frustum-based
   culling hints, if scenes grow into the hundreds/thousands of objects.
10. **Testing** — component tests for the store (pure logic, easy to unit test) and integration
    tests for the save/load round trip against a local Supabase instance.
