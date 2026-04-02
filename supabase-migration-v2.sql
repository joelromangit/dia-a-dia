-- Grindset Migration V2: Supabase persistence for Study + Reading gallery
-- Run this in the Supabase SQL editor

-- ============ APP STATE (key-value store for study data) ============
create table if not exists app_state (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);
alter table app_state enable row level security;
create policy "Allow all" on app_state for all using (true) with check (true);

-- ============ BOOK GALLERY ============
create table if not exists book_gallery (
  id bigint generated always as identity primary key,
  book_id bigint references books(id) on delete cascade,
  url text not null,
  caption text default '',
  created_at timestamptz default now()
);
alter table book_gallery enable row level security;
create policy "Allow all" on book_gallery for all using (true) with check (true);

-- ============ STORAGE: uploads bucket ============
insert into storage.buckets (id, name, public) values ('uploads', 'uploads', true)
on conflict do nothing;

-- Storage policies (ignore errors if they already exist)
do $$
begin
  begin
    create policy "Public read uploads" on storage.objects for select using (bucket_id = 'uploads');
  exception when duplicate_object then null;
  end;
  begin
    create policy "Anyone can upload to uploads" on storage.objects for insert with check (bucket_id = 'uploads');
  exception when duplicate_object then null;
  end;
  begin
    create policy "Anyone can delete from uploads" on storage.objects for delete using (bucket_id = 'uploads');
  exception when duplicate_object then null;
  end;
end $$;
