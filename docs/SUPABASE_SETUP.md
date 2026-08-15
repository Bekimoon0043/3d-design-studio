# Supabase Setup Guide

Supabase provides the database, authentication, and file storage for this project.
Everything below is done from the [Supabase dashboard](https://supabase.com/dashboard) — no CLI required
(a CLI-based alternative is noted at the bottom).

## 1. Create a project

1. Go to https://supabase.com/dashboard and click **New Project**.
2. Choose an organization, name it (e.g. `3d-design-platform`), set a database password, pick a region close to you.
3. Wait ~2 minutes for provisioning.

## 2. Run the database schema

1. Open **SQL Editor** in the left sidebar → **New Query**.
2. Paste the contents of `database/schema.sql` and click **Run**.
3. Open a new query, paste `database/policies.sql`, and click **Run**.
4. Open a new query, paste `database/storage_setup.sql`, and click **Run**.

This creates:
- `public.projects` — one row per saved design
- `public.assets` — metadata for uploaded files
- Row Level Security policies so users can only ever see their own data
- A private `project-assets` storage bucket with per-user folder access

You can verify tables exist under **Table Editor**, and the bucket under **Storage**.

## 3. Enable email/password authentication

1. Go to **Authentication → Providers**.
2. Confirm **Email** is enabled (it is by default).
3. Optional but recommended for local development: go to **Authentication → Settings** and
   disable "Confirm email" so you can sign in immediately without checking an inbox. Re-enable
   it before going to production.

## 4. Get your API credentials

1. Go to **Project Settings → API**.
2. Copy the **Project URL** → this is `VITE_SUPABASE_URL`.
3. Copy the **anon public** key → this is `VITE_SUPABASE_ANON_KEY`.
4. (Optional, backend only) Copy the **service_role** key → this is `SUPABASE_SERVICE_ROLE_KEY`.
   Never expose this key to the frontend or commit it to source control — it bypasses RLS entirely.

## 5. Add credentials to your `.env` files

```
# frontend/.env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

```
# backend/.env (only if you extend the backend with privileged operations)
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 6. Test it

Start the frontend (`npm run dev` inside `frontend/`), sign up with an email + password,
create a couple of objects, and click **Save**. Check **Table Editor → projects** in Supabase —
you should see a new row with your scene JSON.

## Schema reference

```
projects
  id           uuid, primary key
  user_id      uuid, references auth.users(id)
  name         text
  scene_json   jsonb   -- { version: 1, objects: [...] }
  created_at   timestamptz
  updated_at   timestamptz  -- auto-updated via trigger

assets
  id           uuid, primary key
  project_id   uuid, references projects(id)
  file_url     text
  asset_type   text  -- 'texture' | 'reference_image' | 'model' | 'other'
  created_at   timestamptz
```

## Alternative: Supabase CLI

If you prefer infrastructure-as-code, the same SQL files in `database/` can be run via
`supabase db push` after adding them to a `supabase/migrations` folder in a Supabase CLI project.
This repo ships the plain SQL so it works with zero additional tooling.
