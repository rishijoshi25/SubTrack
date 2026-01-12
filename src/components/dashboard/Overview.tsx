import { useState } from "react";
import type { Category } from "../../types/subscription";
import { 
    calculatePercentageChange, 
    getActiveSubscriptionsCount, 
    getTotalMonthlySpending, 
    getTotalMonthlySpendingByCategory, 
    getTotalYearlySpending, 
    getTotalYearlySpendingByCategory 
} from "../../utils/subscriptionUtils";
import { mockSubscriptions } from "../../data/mockSubscriptions";
import MetricCard from "./MetricCard";

export default function Overview(){
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const monthlySpending = selectedCategory === null 
        ? getTotalMonthlySpending(mockSubscriptions)
        : getTotalMonthlySpendingByCategory(mockSubscriptions, selectedCategory);

    const yearlySpending = selectedCategory === null
        ? getTotalYearlySpending(mockSubscriptions)
        : getTotalYearlySpendingByCategory(mockSubscriptions, selectedCategory);

    const activeCount = selectedCategory === null
        ? getActiveSubscriptionsCount(mockSubscriptions)
        : getActiveSubscriptionsCount(mockSubscriptions, selectedCategory);

    const percentageChange = selectedCategory === null
        ? calculatePercentageChange()
        : calculatePercentageChange(selectedCategory);

  return (
    <div className="overview">
      <div className="overview-header">
        <h1 className="overview-title">Dashboard Overview</h1>
        
        <div className="category-filter">
          <label htmlFor="category-select">Filter by Category:</label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as Category | 'All')}
            className="category-dropdown"
          >
            <option value="All">All Categories</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Business">Business</option>
            <option value="Fitness">Fitness</option>
            <option value="ECommerce">ECommerce</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="metrics-grid">
        <MetricCard
          title="Monthly Spending"
          value={`$${monthlySpending.toFixed(2)}`}
          percentageChange={percentageChange}
          icon="💳"
        />
        <MetricCard
          title="Yearly Spending"
          value={`$${yearlySpending.toFixed(2)}`}
          percentageChange={percentageChange}
          icon="📅"
        />
        <MetricCard
          title="Active Subscriptions"
          value={activeCount.toString()}
          percentageChange={percentageChange}
          icon="✓"
        />
      </div>

      {/* Placeholder for Category Breakdown (Pie Chart) */}
      <div className="section-placeholder">
        <h2>Category Breakdown</h2>
        <p>Pie chart coming next...</p>
      </div>

      {/* Placeholder for Spending Trends */}
      <div className="section-placeholder">
        <h2>Spending Trends</h2>
        <p>Comparison table coming next...</p>
      </div>
    </div>
  );
}