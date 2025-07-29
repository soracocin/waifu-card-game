import React from 'react';
import AppLayout from '../layouts/AppLayout';
import BattleArena from '../components/BattleArena';

interface User {
    id: number;
    username: string;
    level: number;
    coins: number;
    gems: number;
    experiencePoints: number;
}

interface BattlePageProps {
    user: User;
    onLogout: () => void;
}

function BattlePage({ user, onLogout }: BattlePageProps) {
    return (
        <AppLayout user={user} onLogout={onLogout}>
            <BattleArena user={user} />
        </AppLayout>
    );
}

export default BattlePage;