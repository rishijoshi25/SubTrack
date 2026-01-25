alter table subscription_status_history enable row level security;

create policy "Users can view own subscription history"
  on subscription_status_history for select
  using (auth.uid() = user_id);

create policy "Users can insert own subscription history"
  on subscription_status_history for insert
  with check (auth.uid() = user_id);