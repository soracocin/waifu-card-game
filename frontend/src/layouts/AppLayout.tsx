import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';

interface User {
    id: number;
    username: string;
    level: number;
    coins: number;
    gems: number;
    experiencePoints: number;
}

interface AppLayoutProps {
    children: React.ReactNode;
    user: User;
    onLogout: () => void;
}

function AppLayout({ children, user, onLogout }: AppLayoutProps) {
    const [userStats, setUserStats] = useState<User>(user);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const refreshUserData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8080/api/users/${user.id}`);
            setUserStats(response.data);
            localStorage.setItem('waifuCardUser', JSON.stringify(response.data));
        } catch (error) {
            console.error('Error refreshing user data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshUserData();
    }, [user.id]);

    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <div className="app-layout">
            {/* Unified Header */}
            <Header user={userStats} onLogout={handleLogout} />

            {/* Main Content */}
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}

export default AppLayout;