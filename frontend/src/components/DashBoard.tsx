import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Dashboard({ user, onLogout }) {
    const [userStats, setUserStats] = useState(user);
    const [loading, setLoading] = useState(false);

    const refreshUserData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8080/api/users/${user.id}`);
            setUserStats(response.data);

            // Update localStorage
            localStorage.setItem('waifuCardUser', JSON.stringify(response.data));
        } catch (error) {
            console.error('Error refreshing user data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshUserData();
    }, []);

    return (
        <div>
            {/* Navigation Bar */}
            <nav className="navbar">
                <h1>🌸 Waifu Card Game</h1>

                <div className="nav-links">
                    <Link to="/dashboard">Trang chủ</Link>
                    <Link to="/collection">Bộ sưu tập</Link>
                    <Link to="/gacha">Gacha</Link>
                    <Link to="/battle">Đấu thẻ</Link>
                </div>

                <div className="user-info">
                    <div className="currency">
                        <span>💰 {userStats.coins?.toLocaleString() || 0}</span>
                        <span>💎 {userStats.gems?.toLocaleString() || 0}</span>
                    </div>
                    <span>Lv.{userStats.level} {userStats.username}</span>
                    <button onClick={onLogout} className="btn" style={{marginLeft: '1rem'}}>
                        Đăng xuất
                    </button>
                </div>
            </nav>

            {/* Main Content */}
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
                                    <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#17a2b8' }}>
                                        💎 {userStats.gems?.toLocaleString() || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <Link to="/gacha" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎰</div>
                            <h3>Gacha</h3>
                            <p>Mở thẻ mới để mở rộng bộ sưu tập của bạn!</p>
                        </div>
                    </Link>

                    <Link to="/collection" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
                            <h3>Bộ sưu tập</h3>
                            <p>Xem tất cả các thẻ bài trong bộ sưu tập của bạn.</p>
                        </div>
                    </Link>

                    <Link to="/battle" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚔️</div>
                            <h3>Đấu thẻ</h3>
                            <p>Thách đấu với người chơi khác để nhận thưởng!</p>
                        </div>
                    </Link>

                    {/* Game Tips */}
                    <div className="card">
                        <h3>💡 Mẹo chơi game</h3>
                        <ul style={{ paddingLeft: '1.2rem', lineHeight: '1.6' }}>
                            <li>Đăng nhập hàng ngày để nhận coins miễn phí</li>
                            <li>Gacha 10 lần để có cơ hội cao hơn nhận thẻ hiếm</li>
                            <li>Sắp xếp deck cân bằng giữa tấn công và phòng thủ</li>
                            <li>Thẻ LEGENDARY có sức mạnh vượt trội</li>
                        </ul>
                    </div>
                </div>

                {loading && (
                    <div style={{
                        position: 'fixed',
                        top: 0, left: 0,
                        width: '100%', height: '100%',
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.2rem'
                    }}>
                        Đang tải dữ liệu...
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;