import React, { useState, useEffect } from 'react';
import AppLayout from '../layouts/AppLayout';
import axios from 'axios';

interface User {
    id: number;
    username: string;
    level: number;
    coins: number;
    gems: number;
    experiencePoints: number;
}

interface DashboardPageProps {
    user: User;
    onLogout: () => void;
}

function DashboardPage({ user, onLogout }: DashboardPageProps) {
    const [userStats, setUserStats] = useState<User>(user);

    const refreshUserData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/users/${user.id}`);
            setUserStats(response.data);
            localStorage.setItem('waifuCardUser', JSON.stringify(response.data));
        } catch (error) {
            console.error('Error refreshing user data:', error);
        }
    };

    useEffect(() => {
        refreshUserData();
    }, [user.id]);

    return (
        <AppLayout user={userStats} onLogout={onLogout}>
            <div style={{ padding: '2rem' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '2rem',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    {/* Welcome Card */}
                    <div className="card" style={{ gridColumn: 'span 2' }}>
                        <h2>Chào mừng trở lại, {userStats.username}!</h2>
                        <p>Level {userStats.level} • {userStats.experiencePoints} EXP</p>
                        <div style={{ marginTop: '1rem' }}>
                            <div style={{
                                background: '#e9ecef',
                                borderRadius: '10px',
                                padding: '1rem',
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '1rem'
                            }}>
                                <div>
                                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#495057' }}>Coins</h4>
                                    <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#ffc107' }}>
                                        💰 {userStats.coins?.toLocaleString() || 0}
                                    </p>
                                </div>
                                <div>
                                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#495057' }}>Gems</h4>
                                    <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#e91e63' }}>
                                        💎 {userStats.gems?.toLocaleString() || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="card">
                        <h3>🎲 Gacha</h3>
                        <p>Mở thẻ mới và mở rộng bộ sưu tập!</p>
                        <button className="btn btn-primary" onClick={() => window.location.href = '/gacha'}>
                            Đi đến Gacha
                        </button>
                    </div>

                    <div className="card">
                        <h3>📚 Bộ sưu tập</h3>
                        <p>Xem và quản lý các thẻ bài của bạn.</p>
                        <button className="btn btn-secondary" onClick={() => window.location.href = '/collection'}>
                            Xem bộ sưu tập
                        </button>
                    </div>

                    <div className="card">
                        <h3>⚔️ Đấu thẻ</h3>
                        <p>Thách đấu với người chơi khác!</p>
                        <button className="btn btn-success" onClick={() => window.location.href = '/battle'}>
                            Bắt đầu đấu
                        </button>
                    </div>

                    <div className="card">
                        <h3>📊 Thống kê</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div>Cấp độ: <strong>{userStats.level}</strong></div>
                            <div>Kinh nghiệm: <strong>{userStats.experiencePoints}</strong></div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

export default DashboardPage;