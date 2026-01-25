alter table subscriptions enable row level security;

create policy "Users can view own subscriptions"
  on subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can insert own subscriptions"
  on subscriptions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own subscriptions"
  on subscriptions for update
  using (auth.uid() = user_id);

create policy "Users can delete own subscriptions"
  on subscriptions for delete
  using (auth.uid() = user_id);