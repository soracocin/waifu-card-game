import AppLayout from '../layouts/AppLayout';
import GachaSystem from '../components/GachaSystem';
import { useAuth } from '../contexts/AuthContext';

function GachaPage() {
    const { user } = useAuth();

    if (!user) {
        return null;
    }

    return (
        <AppLayout>
            <GachaSystem user={user} />
        </AppLayout>
    );
}

export default GachaPage;
