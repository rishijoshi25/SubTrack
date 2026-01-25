export type BillingCycle = 'monthly' | 'yearly';

export type Category = 'Entertainment' | 'Business' | 'Fitness' | 'ECommerce' | 'Other';

export interface Subscription {
  id: string;
  user_id: string;
  name: string;
  price: number;
  billing_cycle: BillingCycle;
  category: Category;
  next_billing_date: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
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