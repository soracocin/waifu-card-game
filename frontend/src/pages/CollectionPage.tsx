import AppLayout from '../layouts/AppLayout';
import CardCollection from '../components/CardCollection';
import { useAuth } from '../contexts/AuthContext';

function CollectionPage() {
    const { user } = useAuth();

    if (!user) {
        return null;
    }

    return (
        <AppLayout>
            <CardCollection user={user} />
        </AppLayout>
    );
}

export default CollectionPage;
