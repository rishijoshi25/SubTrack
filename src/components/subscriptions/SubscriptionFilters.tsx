import { useState, useMemo } from "react";
import type { Subscription, Category, BillingCycle, SubscriptionStatus } from "../../types/subscription";
import './SubscriptionFilters.css';

type SortOption = 'billing-asc' | 'billing-desc' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'recent';

interface SubscriptionFiltersProps {
  subscriptions: Subscription[];
  onFilteredChange: (filtered: Subscription[]) => void;
}

const allCategories: Category[] = ['Entertainment', 'Business', 'Food', 'Housing', 'Utilities', 'Fitness', 'ECommerce', 'Other'];
const allBillingCycles: BillingCycle[] = ['monthly', 'yearly'];
const allStatuses: SubscriptionStatus[] = ['active', 'paused', 'trial', 'cancelled'];

export default function SubscriptionFilters({ subscriptions, onFilteredChange }: SubscriptionFiltersProps){
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('billing-asc');
    const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | null>(null);
    const [billingCycleFilter, setbillingCycleFilter] = useState<BillingCycle | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<Category | null>(null);

    const getNextBillingDate = (sub: Subscription): Date | null => {
        if(!sub.next_billing_date) return null;
        return new Date(sub.next_billing_date);
    }

    const processedSubscriptions = useMemo(() => {
        let filteredSubscriptions = [...subscriptions];

        if(searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filteredSubscriptions = filteredSubscriptions.filter(sub => sub.name.toLowerCase().includes(query) || sub.description?.toLowerCase().includes(query));
        }

        if (statusFilter) {
            filteredSubscriptions = filteredSubscriptions.filter(sub => sub.status === statusFilter);
        }

        if (billingCycleFilter) {
            filteredSubscriptions = filteredSubscriptions.filter(sub => sub.billing_cycle === billingCycleFilter);
        }

        if (categoryFilter) {
            filteredSubscriptions = filteredSubscriptions.filter(sub => sub.category === categoryFilter);
        }

        filteredSubscriptions.sort((a,b) => {
            switch(sortBy){
                case 'billing-asc': {
                    const dateA = getNextBillingDate(a);
                    const dateB = getNextBillingDate(b);

                    if(!dateA) return 1;
                    if(!dateB) return -1;

                    return dateA.getTime() - dateB.getTime();
                }
                case 'billing-desc': {
                    const dateA = getNextBillingDate(a);
                    const dateB = getNextBillingDate(b);
                    if (!dateA) return 1;
                    if (!dateB) return -1;
                    return dateB.getTime() - dateA.getTime();
                }
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'recent':
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                default:
                    return 0;
            }
        });
        return filteredSubscriptions;
    }, [subscriptions, searchQuery, sortBy, statusFilter, billingCycleFilter, categoryFilter])

    useMemo(() => {
        onFilteredChange(processedSubscriptions);
    }, [processedSubscriptions, onFilteredChange]);

    const clearFilters = () => {
        setSearchQuery('');
        setStatusFilter(null);
        setbillingCycleFilter(null);
        setCategoryFilter(null);
        setSortBy('billing-asc');
    };

    const hasActiveFilters = searchQuery || statusFilter || billingCycleFilter || categoryFilter;

    return (
        <div className="subscription-filters">
            <div className="search-sort-container">
                <div className="search-box">
                    <input 
                        type="text"
                        placeholder="Eg: - Netlfix"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    {
                        searchQuery && (
                            <button
                                className="search-clear"
                                onClick={() => setSearchQuery('')}
                            >
                                X
                            </button>
                        )
                    }
                </div>
                <div className="sort-controls">
                    <label htmlFor="sort-select"></label>
                    <select
                        id="sort-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="sort-select"
                    >
                        <option value="billing-asc">Next Billing (Soonest)</option>
                        <option value="billing-desc">Next Billing (Latest)</option>
                        <option value="cost-asc">Cost (Low to High)</option>
                        <option value="cost-desc">Cost (High to Low)</option>
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                        <option value="recent">Recently Added</option>
                    </select>
                </div>
            </div>
            <div className="filters-container">
                <div className="filter-group">
                    <span className="filter-label">Status:</span>
                    <div className="filter-chips">
                        {
                            allStatuses.map(status => (
                                <button
                                    key={status}
                                    className={`filter-chip ${statusFilter === status ? 'active' : ''}`}
                                    onClick={() => setStatusFilter(statusFilter === status ? null : status)}
                                >
                                    {status}
                                </button>
                            ))
                        }
                    </div>
                </div>
                <div className="filter-group">
                    <span className="filter-label">Billing Cycle:</span>
                    <div className="filter-chips">
                        {
                            allBillingCycles.map(cycle => (
                                <button
                                    key={cycle}
                                    className={`filter-chip ${billingCycleFilter === cycle ? 'active' : ''}`}
                                    onClick={() => setbillingCycleFilter(billingCycleFilter === cycle ? null : cycle)}
                                >
                                    {cycle}
                                </button>
                            ))
                        }
                    </div>
                </div>
                <div className="filter-group">
                    <span className="filter-label">Category:</span>
                    <div className="filter-chips">
                        {
                            allCategories.map(category => (
                                <button
                                    key={category}
                                    className={`filter-chip ${categoryFilter === category ? 'active' : ''}`}
                                    onClick={() => setCategoryFilter(categoryFilter === category ? null : category)}
                                >
                                    {category}
                                </button>
                            ))
                        }
                    </div>
                </div>
                    
                {
                    hasActiveFilters && (
                        <button
                            className="clear-filters-btn"
                            onClick={clearFilters}
                        ></button>
                    )
                }
            </div>
            <div className="results-summary">
                Showing {processedSubscriptions.length} of {subscriptions.length} subscription{subscriptions.length !== 1 ? 's' : ''}
            </div>
        </div>
    )
}