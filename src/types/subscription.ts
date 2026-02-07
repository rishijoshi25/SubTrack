export type BillingCycle = 'monthly' | 'yearly';

export type Category = 'Entertainment' | 'Business' | 'Food' | 'Housing' | 'Utilities' | 'Fitness' | 'ECommerce' | 'Other';

export type SubscriptionStatus = 'active' | 'paused' | 'trial' | 'cancelled';

export interface Subscription {
  id: string;
  user_id: string;
  name: string;
  price: number;
  billing_cycle: BillingCycle;
  category: Category;
  next_billing_date: string;
  status: SubscriptionStatus;
  status_changed_at: string;
  trial_end_date?: string;
  original_price?: number;
  price_changed_at?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryColors {
  [key: string]: string;
}

export const CATEGORY_COLORS: CategoryColors = {
  Entertainment: '#E74C3C',
  Business: '#3498DB',
  Fitness: '#2ECC71',
  ECommerce: '#F39C12',
  Other: '#95A5A6',
};

export interface SubscriptionStatusHistory {
  id: string;
  subscription_id: string;
  user_id: string;
  old_status?: SubscriptionStatus;
  new_status: SubscriptionStatus;
  changed_at: string;
  notes?: string;
  price_at_change?: number;
  billing_cycle_at_change?: BillingCycle;
}

export interface SubscriptionFormData {
  name: string;
  price: number | string; // Allow string for input handling, will convert to number
  billing_cycle: BillingCycle;
  category: Category;
  next_billing_date: string;
  status: SubscriptionStatus;
  trial_end_date?: string;
  description?: string;
}