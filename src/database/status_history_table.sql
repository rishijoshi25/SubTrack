create table subscription_status_history (
  id uuid default gen_random_uuid() primary key,
  subscription_id uuid references subscriptions(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  old_status text,
  new_status text not null check (new_status in ('active', 'paused', 'trial', 'cancelled')),
  changed_at timestamp with time zone default now() not null,
  notes text,
  price_at_change decimal(10, 2),
  billing_cycle_at_change text
)