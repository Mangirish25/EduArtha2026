create table if not exists public.learning_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  input text not null,
  explanation text not null,
  language text not null,
  mode text not null,
  quiz_score integer,
  bookmarked boolean default false,
  favorite boolean default false,
  created_at timestamptz default now()
);

alter table public.learning_history enable row level security;

create policy "Users can read own history"
on public.learning_history for select
using (auth.uid() = user_id);

create policy "Users can insert own history"
on public.learning_history for insert
with check (auth.uid() = user_id);

create policy "Users can update own history"
on public.learning_history for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
