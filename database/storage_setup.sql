-- =========================================================================
-- 3D Design Platform - Supabase Storage bucket + policies
-- Run this AFTER schema.sql and policies.sql.
-- Creates a private "project-assets" bucket, with access restricted to a
-- folder path convention: {user_id}/{project_id}/{filename}
-- =========================================================================

insert into storage.buckets (id, name, public)
values ('project-assets', 'project-assets', false)
on conflict (id) do nothing;

-- Allow authenticated users to upload files into their own folder
drop policy if exists "Users can upload to their own folder" on storage.objects;
create policy "Users can upload to their own folder"
  on storage.objects
  for insert
  with check (
    bucket_id = 'project-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow authenticated users to read their own files
drop policy if exists "Users can read their own files" on storage.objects;
create policy "Users can read their own files"
  on storage.objects
  for select
  using (
    bucket_id = 'project-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow authenticated users to delete their own files
drop policy if exists "Users can delete their own files" on storage.objects;
create policy "Users can delete their own files"
  on storage.objects
  for delete
  using (
    bucket_id = 'project-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
