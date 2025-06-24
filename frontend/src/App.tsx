import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/DashBoard';
import CardCollection from './components/CardCollection';
import GachaSystem from './components/GachaSystem';
import BattleArena from './components/BattleArena';
import './App.css';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in (from localStorage)
        const savedUser = localStorage.getItem('waifuCardUser');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const handleLogin = (userData) => {
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
                        element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />}
                    />
                    <Route
                        path="/dashboard"
                        element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/collection"
                        element={user ? <CardCollection user={user} /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/gacha"
                        element={user ? <GachaSystem user={user} /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/battle"
                        element={user ? <BattleArena user={user} /> : <Navigate to="/login" />}
                    />
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;