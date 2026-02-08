create extension if not exists "pgcrypto";

create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  objective text not null,
  platform text not null,
  tone text not null,
  market text not null,
  notes text,
  asset_paths jsonb default '[]'::jsonb,
  concepts jsonb,
  selected_concept_index int,
  brief jsonb,
  performance_index int,
  render_paths jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

alter table campaigns enable row level security;

create policy "Users can view their campaigns" on campaigns
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their campaigns" on campaigns
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their campaigns" on campaigns
  for update
  using (auth.uid() = user_id);

create policy "Users can delete their campaigns" on campaigns
  for delete
  using (auth.uid() = user_id);
