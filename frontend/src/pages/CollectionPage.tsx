import React from 'react';
import AppLayout from '../layouts/AppLayout';
import CardCollection from '../components/CardCollection';

interface User {
    id: number;
    username: string;
    level: number;
    coins: number;
    gems: number;
    experiencePoints: number;
}

interface CollectionPageProps {
    user: User;
    onLogout: () => void;
}

function CollectionPage({ user, onLogout }: CollectionPageProps) {
    return (
        <AppLayout user={user} onLogout={onLogout}>
            <CardCollection user={user} />
        </AppLayout>
    );
}

export default CollectionPage;