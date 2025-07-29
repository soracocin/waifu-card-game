import React from 'react';
import AppLayout from '../layouts/AppLayout';
import CardManager from '../components/CardManager';

interface User {
    id: number;
    username: string;
    level: number;
    coins: number;
    gems: number;
    experiencePoints: number;
}

interface AdminPageProps {
    user: User;
    onLogout: () => void;
}

function AdminPage({ user, onLogout }: AdminPageProps) {
    return (
        <AppLayout user={user} onLogout={onLogout}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '18px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.09)',
                padding: '2rem 1rem',
                minHeight: '70vh',
                overflowX: 'auto',
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontWeight: 700, letterSpacing: 1, color: '#fff' }}>
                    Quản lý thẻ bài
                </h2>
                <CardManager user={user} />
            </div>
        </AppLayout>
    );
}

export default AdminPage;