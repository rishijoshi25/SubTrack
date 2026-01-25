create or replace function log_status_change()
returns trigger as $$
begin
  if old.status is distinct from new.status then
    insert into subscription_status_history (
      subscription_id,
      user_id,
      old_status,
      new_status,
      price_at_change,
      billing_cycle_at_change,
      notes
    ) values (
      new.id,
      new.user_id,
      old.status,
      new.status,
      new.price,
      new.billing_cycle,
      case 
        when new.status = 'cancelled' then 'Subscription cancelled'
        when new.status = 'paused' then 'Subscription paused'
        when new.status = 'active' and old.status = 'paused' then 'Subscription resumed'
        when new.status = 'active' and old.status = 'trial' then 'Trial ended, subscription activated'
        else null
      end
    );
    new.status_changed_at = now();
  end if;
  
  return new;
end;
$$ language plpgsql;

create trigger log_subscription_status_changes
  before update on subscriptions
  for each row
  execute function log_status_change();