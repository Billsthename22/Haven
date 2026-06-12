create table if not exists public.spotify_tokens (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  access_token  text not null,
  refresh_token text not null,
  expires_at    bigint not null,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

alter table public.spotify_tokens enable row level security;

create policy "Users can manage their own Spotify tokens"
  on public.spotify_tokens
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
