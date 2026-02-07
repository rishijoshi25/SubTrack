import { useAuth } from '../../auth/useAuth';
import DashboardLayout from './DashboardLayout';
import Overview from './Overview';

export default function Dashboard() {
    const { user, signOut } = useAuth();

    const handleSignOut = async () => {
        try {
            await signOut();
        }
        catch(error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <DashboardLayout
            userEmail={user?.email}
            onSignOut={handleSignOut}
        >
            <Overview />
        </DashboardLayout>
    )
}