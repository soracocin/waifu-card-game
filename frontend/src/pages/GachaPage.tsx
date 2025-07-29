import React from 'react';
import AppLayout from '../layouts/AppLayout';
import GachaSystem from '../components/GachaSystem';

interface User {
    id: number;
    username: string;
    level: number;
    coins: number;
    gems: number;
    experiencePoints: number;
}

interface GachaPageProps {
    user: User;
    onLogout: () => void;
}

function GachaPage({ user, onLogout }: GachaPageProps) {
    return (
        <AppLayout user={user} onLogout={onLogout}>
            <GachaSystem user={user} />
        </AppLayout>
    );
}

export default GachaPage;