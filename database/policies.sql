-- =========================================================================
-- 3D Design Platform - Row Level Security (RLS) Policies
-- Run this AFTER schema.sql. These policies ensure users can only ever
-- read/write their own projects and assets belonging to their own projects.
-- =========================================================================

-- -------------------------------------------------------------------------
-- projects
-- -------------------------------------------------------------------------
alter table public.projects enable row level security;

drop policy if exists "Users can view their own projects" on public.projects;
create policy "Users can view their own projects"
  on public.projects
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own projects" on public.projects;
create policy "Users can insert their own projects"
  on public.projects
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own projects" on public.projects;
create policy "Users can update their own projects"
  on public.projects
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own projects" on public.projects;
create policy "Users can delete their own projects"
  on public.projects
  for delete
  using (auth.uid() = user_id);

-- -------------------------------------------------------------------------
-- assets
-- Ownership is derived transitively through the parent project's user_id.
-- -------------------------------------------------------------------------
alter table public.assets enable row level security;

drop policy if exists "Users can view assets of their own projects" on public.assets;
create policy "Users can view assets of their own projects"
  on public.assets
  for select
  using (
    exists (
      select 1 from public.projects p
      where p.id = assets.project_id
        and p.user_id = auth.uid()
    )
  );

drop policy if exists "Users can insert assets into their own projects" on public.assets;
create policy "Users can insert assets into their own projects"
  on public.assets
  for insert
  with check (
    exists (
      select 1 from public.projects p
      where p.id = assets.project_id
        and p.user_id = auth.uid()
    )
  );

drop policy if exists "Users can update assets of their own projects" on public.assets;
create policy "Users can update assets of their own projects"
  on public.assets
  for update
  using (
    exists (
      select 1 from public.projects p
      where p.id = assets.project_id
        and p.user_id = auth.uid()
    )
  );

drop policy if exists "Users can delete assets of their own projects" on public.assets;
create policy "Users can delete assets of their own projects"
  on public.assets
  for delete
  using (
    exists (
      select 1 from public.projects p
      where p.id = assets.project_id
        and p.user_id = auth.uid()
    )
  );
