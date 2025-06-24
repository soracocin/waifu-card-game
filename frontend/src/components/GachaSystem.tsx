import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function GachaSystem({ user }) {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [userStats, setUserStats] = useState(user);
    const [showResult, setShowResult] = useState(false);

    const refreshUserData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/users/${user.id}`);
            setUserStats(response.data);
        } catch (error) {
            console.error('Error refreshing user data:', error);
        }
    };

    const performGacha = async (type, useGems = false) => {
        if (loading) return;

        const cost = type === 'single'
            ? (useGems ? 1 : 100)
            : (useGems ? 9 : 900);

        const currency = useGems ? userStats.gems : userStats.coins;

        if (currency < cost) {
            alert(`Không đủ ${useGems ? 'gems' : 'coins'}! Cần ${cost} ${useGems ? 'gems' : 'coins'}.`);
            return;
        }

        try {
            setLoading(true);
            const endpoint = type === 'single' ? 'single' : 'ten';
            const response = await axios.post(
                `http://localhost:8080/api/gacha/${endpoint}/${user.id}?useGems=${useGems}`
            );

            setResult(response.data);
            setShowResult(true);
            await refreshUserData();
        } catch (error) {
            console.error('Gacha error:', error);
            alert('Có lỗi xảy ra khi thực hiện gacha!');
        } finally {
            setLoading(false);
        }
    };

    const getRarityColor = (rarity) => {
        switch (rarity) {
            case 'COMMON': return '#808080';
            case 'RARE': return '#0066cc';
            case 'EPIC': return '#9933cc';
            case 'LEGENDARY': return '#ff9900';
            default: return '#808080';
        }
    };

    const getElementEmoji = (element) => {
        switch (element) {
            case 'FIRE': return '🔥';
            case 'WATER': return '💧';
            case 'EARTH': return '🌍';
            case 'AIR': return '💨';
            case 'LIGHT': return '✨';
            case 'DARK': return '🌙';
            default: return '❓';
        }
    };

    const getRarityEmoji = (rarity) => {
        switch (rarity) {
            case 'COMMON': return '⚪';
            case 'RARE': return '🔵';
            case 'EPIC': return '🟣';
            case 'LEGENDARY': return '🟡';
            default: return '⚪';
        }
    };

    if (showResult && result) {
        return (
            <div>
                <nav className="navbar">
                    <h1>🎰 Kết Quả Gacha</h1>
                    <div className="nav-links">
                        <Link to="/dashboard">Trang chủ</Link>
                        <Link to="/collection">Bộ sưu tập</Link>
                        <Link to="/gacha">Gacha</Link>
                        <Link to="/battle">Đấu thẻ</Link>
                    </div>
                </nav>

                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <div style={{
                        background: 'rgba(255,255,255,0.1)',
                        padding: '2rem',
                        borderRadius: '15px',
                        marginBottom: '2rem'
                    }}>
                        <h2 style={{ color: 'white', marginBottom: '1rem' }}>
                            🎉 Bạn đã nhận được {result.cards.length} thẻ mới!
                        </h2>
                        <p style={{ color: 'white' }}>
                            Chi phí: {result.totalCost} {result.pullType.includes('GEM') ? 'gems 💎' : 'coins 💰'}
                        </p>
                        <p style={{ color: 'white' }}>
                            Còn lại: {result.remainingCoins} coins 💰 | {result.remainingGems} gems 💎
                        </p>
                    </div>

                    <div className="card-grid" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        {result.cards.map((card, index) => (
                            <div
                                key={index}
                                className="card"
                                style={{
                                    border: `3px solid ${getRarityColor(card.rarity)}`,
                                    animation: `cardFlip 0.6s ease-in-out ${index * 0.1}s both`
                                }}
                            >
                                <div className="card-image">
                                    {getElementEmoji(card.element)}
                                    <div style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        fontSize: '1.5rem'
                                    }}>
                                        {getRarityEmoji(card.rarity)}
                                    </div>
                                </div>

                                <div className="card-info">
                                    <h3>{card.name}</h3>
                                    <p style={{ fontSize: '0.8rem', color: '#666', margin: '0.5rem 0' }}>
                                        {card.description}
                                    </p>

                                    <div className="card-stats">
                                        <span className="stat">⚔️ {card.attack}</span>
                                        <span className="stat">🛡️ {card.defense}</span>
                                        <span className="stat">💎 {card.cost}</span>
                                    </div>

                                    <div
                                        className="rarity"
                                        style={{ background: getRarityColor(card.rarity) }}
                                    >
                                        {card.rarity}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '3rem' }}>
                        <button
                            className="btn btn-large"
                            onClick={() => setShowResult(false)}
                            style={{ marginRight: '1rem' }}
                        >
                            Tiếp tục Gacha 🎰
                        </button>
                        <Link to="/collection" className="btn btn-large">
                            Xem Bộ Sưu Tập 📚
                        </Link>
                    </div>
                </div>

                <style jsx>{`
          @keyframes cardFlip {
            0% {
              transform: rotateY(180deg) scale(0.8);
              opacity: 0;
            }
            50% {
              transform: rotateY(90deg) scale(0.9);
              opacity: 0.5;
            }
            100% {
              transform: rotateY(0deg) scale(1);
              opacity: 1;
            }
          }
        `}</style>
            </div>
        );
    }

    return (
        <div>
            <nav className="navbar">
                <h1>🎰 Gacha System</h1>
                <div className="nav-links">
                    <Link to="/dashboard">Trang chủ</Link>
                    <Link to="/collection">Bộ sưu tập</Link>
                    <Link to="/gacha">Gacha</Link>
                    <Link to="/battle">Đấu thẻ</Link>
                </div>
                <div className="currency">
                    <span>💰 {userStats.coins?.toLocaleString() || 0}</span>
                    <span>💎 {userStats.gems?.toLocaleString() || 0}</span>
                </div>
            </nav>

            <div style={{ padding: '2rem' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>

                    {/* Gacha Info */}
                    <div style={{
                        background: 'rgba(255,255,255,0.1)',
                        padding: '2rem',
                        borderRadius: '15px',
                        marginBottom: '3rem',
                        textAlign: 'center'
                    }}>
                        <h2 style={{ color: 'white', marginBottom: '1rem' }}>
                            ✨ Mở Thẻ Waifu Mới ✨
                        </h2>
                        <p style={{ color: 'white', fontSize: '1.1rem', lineHeight: '1.6' }}>
                            Sử dụng coins hoặc gems để mở những thẻ waifu tuyệt đẹp!
                            <br />Cơ hội nhận thẻ hiếm với gacha 10 lần cao hơn!
                        </p>
                    </div>

                    {/* Rates Display */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '1rem',
                        marginBottom: '3rem'
                    }}>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚪</div>
                            <h4>COMMON</h4>
                            <p style={{ margin: 0, color: '#666' }}>70%</p>
                        </div>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔵</div>
                            <h4>RARE</h4>
                            <p style={{ margin: 0, color: '#666' }}>25%</p>
                        </div>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🟣</div>
                            <h4>EPIC</h4>
                            <p style={{ margin: 0, color: '#666' }}>4%</p>
                        </div>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🟡</div>
                            <h4>LEGENDARY</h4>
                            <p style={{ margin: 0, color: '#666' }}>1%</p>
                        </div>
                    </div>

                    {/* Gacha Options */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem'
                    }}>

                        {/* Single Pull */}
                        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎲</div>
                            <h3>Mở 1 Thẻ</h3>
                            <p style={{ margin: '1rem 0', color: '#666' }}>
                                Mở một thẻ ngẫu nhiên
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <button
                                    className="btn btn-large"
                                    onClick={() => performGacha('single', false)}
                                    disabled={loading || userStats.coins < 100}
                                    style={{ opacity: userStats.coins < 100 ? 0.5 : 1 }}
                                >
                                    {loading ? 'Đang mở...' : '100 Coins 💰'}
                                </button>

                                <button
                                    className="btn btn-large btn-warning"
                                    onClick={() => performGacha('single', true)}
                                    disabled={loading || userStats.gems < 1}
                                    style={{ opacity: userStats.gems < 1 ? 0.5 : 1 }}
                                >
                                    {loading ? 'Đang mở...' : '1 Gem 💎'}
                                </button>
                            </div>
                        </div>

                        {/* Ten Pull */}
                        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎁</div>
                            <h3>Mở 10 Thẻ</h3>
                            <p style={{ margin: '1rem 0', color: '#666' }}>
                                Mở 10 thẻ cùng lúc<br />
                                <strong>Đảm bảo ít nhất 1 thẻ Rare+!</strong>
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <button
                                    className="btn btn-large btn-success"
                                    onClick={() => performGacha('ten', false)}
                                    disabled={loading || userStats.coins < 900}
                                    style={{ opacity: userStats.coins < 900 ? 0.5 : 1 }}
                                >
                                    {loading ? 'Đang mở...' : '900 Coins 💰'}
                                </button>
                                <small style={{ color: '#666' }}>Tiết kiệm 100 coins!</small>

                                <button
                                    className="btn btn-large btn-warning"
                                    onClick={() => performGacha('ten', true)}
                                    disabled={loading || userStats.gems < 9}
                                    style={{ opacity: userStats.gems < 9 ? 0.5 : 1 }}
                                >
                                    {loading ? 'Đang mở...' : '9 Gems 💎'}
                                </button>
                                <small style={{ color: '#666' }}>Tiết kiệm 1 gem!</small>
                            </div>
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="card" style={{ marginTop: '3rem' }}>
                        <h3>💡 Mẹo Gacha</h3>
                        <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                            <li>Gacha 10 lần để đảm bảo ít nhất 1 thẻ Rare hoặc cao hơn</li>
                            <li>Gems hiếm hơn coins, nên sử dụng coins trước khi dùng gems</li>
                            <li>Thẻ trùng sẽ cho thêm EXP để nâng cấp thẻ hiện có</li>
                            <li>Thẻ LEGENDARY có tỷ lệ rất thấp nhưng sức mạnh vượt trội</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GachaSystem;