import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CollectionPage from './pages/CollectionPage';
import GachaPage from './pages/GachaPage';
import BattlePage from './pages/BattlePage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

interface User {
    id: number;
    username: string;
    level: number;
    coins: number;
    gems: number;
    experiencePoints: number;
}

function App() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in (from localStorage)
        const savedUser = localStorage.getItem('waifuCardUser');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const handleLogin = (userData: User) => {
        setUser(userData);
        localStorage.setItem('waifuCardUser', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('waifuCardUser');
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route
                        path="/login"
                        element={!user ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/dashboard" />}
                    />
                    <Route
                        path="/dashboard"
                        element={user ? <DashboardPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/collection"
                        element={user ? <CollectionPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/gacha"
                        element={user ? <GachaPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/battle"
                        element={user ? <BattlePage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/admin/cards"
                        element={user ? <AdminPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
                    />
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;