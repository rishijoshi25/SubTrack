import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/useAuth';
import type { Subscription } from '../../types/subscription';
import DashboardLayout from '../dashboard/DashboardLayout';
import { supabase } from '../../lib/supabase';
import SubscriptionCard from './SubscriptionCard';
import SubscriptionFilters from './SubscriptionFilters';
import './Subscriptions.css'

export default function Subscriptions() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async() => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (fetchError) throw fetchError;

      setSubscriptions(data || []);
      setFilteredSubscriptions(data || []);
    }
    catch(err) {
      console.error('Error fetching subscriptions:', err);
      setError(err instanceof Error ? err.message : 'Failed to load subscriptions');
    }
    finally {
      setLoading(false);
    }
  }

  const handleManageSubscription = (subscription: Subscription) => {
    
  }

  const handleFilteredChange = (filtered: Subscription[]) => {
    setFilteredSubscriptions(filtered);
  };

  if (loading) {
    return (
      <DashboardLayout 
        userEmail={user?.email} 
        onSignOut={handleSignOut}
      >
        <div className="subscriptions-page">
          <div className="loading-container">
            <p>Loading subscriptions...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  else if (error) {
    return (
      <DashboardLayout 
        userEmail={user?.email} 
        onSignOut={handleSignOut}
      >
        <div className="subscriptions-page">
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button onClick={fetchSubscriptions} className="retry-button">
              Try Again
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  else {
    return (
      <DashboardLayout 
        userEmail={user?.email} 
        onSignOut={handleSignOut}
      >
        <div className="subscriptions-page">
          <div className="subscriptions-header">
            <h1>My Subscriptions</h1>
            <p className="subscriptions-count">
              {subscriptions.length} {subscriptions.length === 1 ? 'subscription' : 'subscriptions'}
            </p>
          </div>

          {subscriptions.length === 0 ? 
            (
              <div className="empty-state">
                <h2>No subscriptions yet</h2>
                <p>Start tracking your subscriptions by adding your first one!</p>
                <button 
                  className="add-first-button"
                  onClick={() => window.location.href = '/add-subscription'}
                >
                  Add Subscription
                </button>
              </div>
            ) : 
            (
              <>
                <SubscriptionFilters
                  subscriptions={subscriptions}
                  onFilteredChange={handleFilteredChange}
                />
                {filteredSubscriptions.length === 0 ? (
                  <div className="no-results-state">
                    <h3>No subscriptions match your filters</h3>
                    <p>Try adjusting your search or filters to see more results.</p>
                  </div>
                ) : 
                (
                  <div className="subscriptions-grid">
                    {filteredSubscriptions.map((subscription) => (
                      <SubscriptionCard
                        key={subscription.id}
                        subscription={subscription}
                        onManage={handleManageSubscription}
                      />
                    ))}
                  </div>
                )}
              </>
            )
          }
        </div>
      </DashboardLayout>
    );
  }
}