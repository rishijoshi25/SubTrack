import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { supabase } from "../../lib/supabase";
import type { SubscriptionFormData } from "../../types/subscription";
import DashboardLayout from "../dashboard/DashboardLayout";
import SubscriptionForm from "./form/SubscriptionForm";
import './AddSubscription.css'

export default function AddSubscription() {
  const { user, signOut } = useAuth();
  
  const handleSignOut = async () => {
    try {
      await signOut();
    }
    catch(error) {
      console.error('Error signing out:', error);
    }
  };

  const navigate = useNavigate();

  const handleSubmit = async (data: SubscriptionFormData) => {
    try {
      
      if (!user) {
        alert('You must be logged in to add a subscription');
        return;
      }

      const subscriptionData = {
        user_id: user.id,
        name: data.name,
        price: data.price,
        billing_cycle: data.billing_cycle,
        category: data.category,
        next_billing_date: data.next_billing_date,
        status: data.status,
        status_changed_at: new Date().toISOString(),
        trial_end_date: data.trial_end_date || null,
        description: data.description || null,
      };

      const { error } = await supabase
        .from('subscriptions')
        .insert([subscriptionData]);

      if (error) {
        console.error('Error adding subscription:', error);
        alert('Failed to add subscription. Please try again.');
        return;
      }

      alert('Subscription added successfully!');
      navigate('/subscriptions');
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/subscriptions');
  };

  return (
    <DashboardLayout
      userEmail={user?.email}
      onSignOut={handleSignOut}
    >
      <div className="add-subscription-page">
        <div className="page-header">
          <h1>Add New Subscription</h1>
          <p>Track a new recurring subscription</p>
        </div>
        
        <SubscriptionForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel="Add Subscription"
        />
      </div>
    </DashboardLayout>
  );
}