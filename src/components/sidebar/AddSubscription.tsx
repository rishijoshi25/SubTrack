import { useAuth } from "../../auth/useAuth";
import DashboardLayout from "../dashboard/DashboardLayout";

export default function AddSubscription() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <DashboardLayout 
      userEmail={user?.email} 
      onSignOut={handleSignOut}
    >
      <div style={{ padding: '20px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>
          Add Subscription
        </h1>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>
          This is where you'll have a form to add a new subscription.
        </p>
        <p style={{ color: '#6b7280', fontSize: '16px', marginTop: '10px' }}>
          Coming soon!
        </p>
      </div>
    </DashboardLayout>
  );
}