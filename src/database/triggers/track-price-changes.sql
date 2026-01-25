create or replace function track_price_changes()
returns trigger as $$
begin
  if old.price is distinct from new.price then
    new.original_price = coalesce(old.original_price, old.price);
    new.price_changed_at = now();
  end if;
  return new;
end;
$$ language plpgsql;

create trigger track_subscription_price_changes
  before update on subscriptions
  for each row
  execute function track_price_changes();