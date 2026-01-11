import type { Subscription, Category } from '../types/subscription';

export const getMonthlyEquivalent = (subscription: Subscription): number => {
  if (subscription.billing_cycle === 'monthly') {
    return subscription.price;
  }
  return subscription.price / 12;
};

export const getTotalMonthlySpending = (subscriptions: Subscription[]): number => {
    const activeSubscriptions = subscriptions.filter(subscription => subscription.is_active);
    const totalCost = activeSubscriptions.reduce((total, subscription) => total + getMonthlyEquivalent(subscription), 0);
    return totalCost;
};

export const getTotalMonthlySpendingByCategory = (subscriptions: Subscription[], category: Category): number => {
    const activeSubscriptions = subscriptions.filter(subscription => subscription.is_active);
    const categorySubscriptions: Subscription[] = activeSubscriptions.filter((subscription) => subscription.category === category);
    
    const totalCost = categorySubscriptions.reduce((total, subscription) => total + getMonthlyEquivalent(subscription), 0);

    return totalCost;
};

export const getTotalYearlySpending = (subscriptions: Subscription[]): number => {
    const activeSubscriptions = subscriptions.filter(subscription => subscription.is_active);
    const totalCost = activeSubscriptions.reduce((total, subscription) => {
        if (subscription.billing_cycle === 'yearly'){
            return total + subscription.price;
        }
        return total + (subscription.price * 12);
    }, 0);

    return totalCost;
}

export const getTotalYearlySpendingByCategory = (subscriptions: Subscription[], category: Category): number => {
    const activeSubscriptions = subscriptions.filter(subscription => subscription.is_active);
    const categorySubscriptions: Subscription[] = activeSubscriptions.filter((subscription) => subscription.category === category);
    
    const totalCost = categorySubscriptions.reduce((total, subscription) => {
        if (subscription.billing_cycle === 'yearly'){
            return total + subscription.price;
        }
        return total + (subscription.price * 12);
    }, 0);

    return totalCost;
};

export const getActiveSubscriptionsCount = (subscriptions: Subscription[], category?: Category): number => {
    
    if (category){
        return subscriptions.filter((subscription) => subscription.category === category && subscription.is_active).length;
    }
    return subscriptions.filter(subscription => subscription.is_active).length; 
};

export const getSpendingByCategory = (subscriptions: Subscription[]): Record<Category, number> => {
  const categories: Category[] = ['Entertainment', 'Business', 'Fitness', 'ECommerce', 'Other'];
  
  return categories.reduce((acc, category) => {
    acc[category] = getTotalMonthlySpendingByCategory(subscriptions, category);
    return acc;
  }, {} as Record<Category, number>);
};

// Calculate percentage change
export const calculatePercentageChange = (category?: Category): number => {
  // Mock data: returns random percentage between -20% and +20%
  // In real implementation, this would compare current period to previous period
  const mockChanges: Record<string, number> = {
    'Entertainment': 5.2,
    'Business': -3.1,
    'Fitness': 12.5,
    'ECommerce': -8.7,
    'Other': 2.3,
    'overall': 1.8,
  };
  
  return mockChanges[category || 'overall'];
};