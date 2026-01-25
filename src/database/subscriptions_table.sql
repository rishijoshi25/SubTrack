create table subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  price decimal(10, 2) not null,
  billing_cycle text not null check (billing_cycle in ('monthly','yearly')),
  category text not null check (category in ('Entertainment', 'Business', 'Food', 'Housing', 'Utilities', 'Fitness', 'ECommerce', 'Other')),
  next_billing_date date not null,
  status text default 'active' check (status in ('active', 'paused', 'trial', 'cancelled')) not null,
  status_changed_at timestamp with time zone default now() not null,
  trial_end_date date,
  original_price decimal(10, 2),
  price_changed_at timestamp with time zone,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  description text
);