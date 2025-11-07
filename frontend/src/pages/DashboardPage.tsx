import { useEffect, useState } from 'react';
import axios from 'axios';
import AppLayout from '../layouts/AppLayout';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../types/user';

function DashboardPage() {
    const { user, updateUser } = useAuth();
    const [userStats, setUserStats] = useState<User | null>(user);

    useEffect(() => {
        if (!user) {
            return;
        }

        const refreshUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/users/${user.id}`);
                setUserStats(response.data);
                updateUser(response.data);
            } catch (error) {
                console.error('Error refreshing user data:', error);
            }
        };

        refreshUserData();
    }, [user?.id, updateUser]);

    if (!userStats) {
        return null;
    }

    return (
        <AppLayout>
            <div style={{ padding: '2rem' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '2rem',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    <div className="card" style={{ gridColumn: 'span 2' }}>
                        <h2>Welcome back, {userStats.username}!</h2>
                        <p>Level {userStats.level} - {userStats.experiencePoints} EXP</p>
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
                                        Coins {userStats.coins?.toLocaleString() || 0}
                                    </p>
                                </div>
                                <div>
                                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#495057' }}>Gems</h4>
                                    <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#e91e63' }}>
                                        Gems {userStats.gems?.toLocaleString() || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <h3>Gacha</h3>
                        <p>Pull new cards and expand your collection!</p>
                        <button className="btn btn-primary" onClick={() => window.location.href = '/gacha'}>
                            Đi đến Gacha
                        </button>
                    </div>

                    <div className="card">
                        <h3>Collection</h3>
                        <p>Review and manage every card you own.</p>
                        <button className="btn btn-secondary" onClick={() => window.location.href = '/collection'}>
                            Xem bộ sưu tập
                        </button>
                    </div>

                    <div className="card">
                        <h3>Battle</h3>
                        <p>Challenge other players to card duels.</p>
                        <button className="btn btn-success" onClick={() => window.location.href = '/battle'}>
                            Bắt đầu trận đấu
                        </button>
                    </div>

                    <div className="card">
                        <h3>Stats</h3>
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
