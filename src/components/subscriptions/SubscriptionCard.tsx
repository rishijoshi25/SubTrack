import type { Subscription } from "../../types/subscription";
import './SubscriptionCard.css';

interface SubscriptionCardProps {
  subscription: Subscription;
  onManage: (subscription: Subscription) => void;
}

export default function SubscriptionCard({ subscription, onManage }: SubscriptionCardProps){
    const checkBillingProximity = () => {
        const now = new Date();
        const billingDate = new Date(subscription.next_billing_date);
        const millisecondsInADay: number = 1000 * 60 * 60 * 24;
        const daysUntilBilling = Math.ceil((billingDate.getTime() - now.getTime()) / millisecondsInADay);

        return {
            isUrgent: daysUntilBilling <= 3,
            isUpcoming: daysUntilBilling > 3 && daysUntilBilling <= 7
        };
    }

    const { isUrgent, isUpcoming } = checkBillingProximity();

    const formatCost = () => {
        const price = Number(subscription.price);
        
        if (subscription.billing_cycle === 'monthly') {
            return `$${price.toFixed(2)}/month`;
        } 
        else if (subscription.billing_cycle === 'yearly') {
            const monthlyEquivalent = (price / 12).toFixed(2);
            return `$${price.toFixed(2)}/year ($${monthlyEquivalent}/month)`;
        }
            
        return `$${price.toFixed(2)}/${subscription.billing_cycle}`;
  };

    const getStatusClass = () => {
        switch (subscription.status) {
            case 'active':
                return 'status-active';
            case 'trial':
                return 'status-trial';
            case 'paused':
                return 'status-paused';
            case 'cancelled':
                return 'status-cancelled';
            default:
                return 'status-active';
        }
    }

    const formatDate = (date: string) => {
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    }

    const formatStatus = (status: string) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    }

    return(
        <div className={`subscription-card ${isUrgent ? 'urgent' : ''} ${isUpcoming ? 'upcoming' : ''}`}>
            <div className="card-logo">
                <span className="logo-placeholder">{subscription.name.charAt(0).toUpperCase()}</span>
            </div>

            <div className="card-content">
                <h3 className="subscription-name">{subscription.name}</h3>
                <span className={`status-badge ${getStatusClass()}`}>{formatStatus(subscription.status)}</span>
                <p className="subscription-cost">{formatCost()}</p>
                <span className="category-tag">{subscription.category}</span>
                <p className="billing-date">Next billing: {formatDate(subscription.next_billing_date)}</p>

                {
                    (isUrgent || isUpcoming) && (
                        <p className="billing-alert">
                            {isUrgent ? 'Billing in 3 days or less' : 'Billing soon'}
                        </p>
                    )
                }
            </div>
            <div className="card-actions">
                <button 
                    className="manage-button"
                    onClick={() => onManage(subscription)}
                >
                    Manage
                </button>
            </div>
        </div>
    )

}