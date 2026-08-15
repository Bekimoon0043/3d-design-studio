-- =========================================================================
-- 3D Design Platform - Database Schema
-- Run this in the Supabase SQL editor (Project > SQL Editor > New Query).
-- =========================================================================

-- Enable UUID generation (usually already enabled on Supabase projects)
create extension if not exists "pgcrypto";

-- -------------------------------------------------------------------------
-- projects
-- One row per saved 3D scene/design. `scene_json` stores the full object
-- graph (primitives, transforms, materials) produced by the frontend editor.
-- -------------------------------------------------------------------------
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null default 'Untitled Project',
  scene_json  jsonb not null default '{"version":1,"objects":[]}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_projects_user_id on public.projects(user_id);
create index if not exists idx_projects_updated_at on public.projects(updated_at desc);

-- -------------------------------------------------------------------------
-- assets
-- Optional per-project uploaded files (e.g. reference images, textures)
-- stored in Supabase Storage; this table just tracks metadata + the URL.
-- -------------------------------------------------------------------------
create table if not exists public.assets (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects(id) on delete cascade,
  file_url    text not null,
  asset_type  text not null check (asset_type in ('texture', 'reference_image', 'model', 'other')),
  created_at  timestamptz not null default now()
);

create index if not exists idx_assets_project_id on public.assets(project_id);

-- -------------------------------------------------------------------------
-- updated_at auto-touch trigger for projects
-- -------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_projects_updated_at on public.projects;
create trigger trg_projects_updated_at
  before update on public.projects
  for each row
  execute function public.set_updated_at();
