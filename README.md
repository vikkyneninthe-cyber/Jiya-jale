# HYDD AI — Agency-as-Software (V1 Static Ads)

HYDD AI is a premium, ultra-dark creative workflow that replaces traditional agencies with software. V1 generates exactly three strategic concepts, a creative brief, and two static ad renders (1:1 and 9:16) with typography overlays.

## Stack
- Next.js App Router + React 19
- Tailwind CSS
- Supabase (Google OAuth, Postgres, Storage)
- OpenAI Responses API + Image Generation (server-side only)

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```
3. Add Supabase + OpenAI credentials in `.env.local`.
4. Run the dev server:
   ```bash
   npm run dev
   ```

## Supabase SQL Schema + RLS Policies
Run the SQL below in the Supabase SQL editor.

```sql
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
```

## Storage Buckets
Create two public buckets in Supabase Storage:
- `assets` for uploaded brand assets
- `renders` for generated image output

## Notes on Cost + Rate Limits
- OpenAI Responses API and Image generation are billable. Monitor rate limits and image usage.
- Supabase Storage and Database usage scale with asset uploads and campaign volume.

## Security Disclaimer
OpenAI keys are used server-side only. The browser never receives the OpenAI API key.
