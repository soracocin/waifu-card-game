import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function CardCollection({ user }) {
    const [userCards, setUserCards] = useState([]);
    const [allCards, setAllCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('name');

    useEffect(() => {
        loadCards();
    }, []);

    const loadCards = async () => {
        try {
            setLoading(true);
            const [userCardsRes, allCardsRes] = await Promise.all([
                axios.get(`http://localhost:8080/api/cards/user/${user.id}`),
                axios.get('http://localhost:8080/api/cards')
            ]);

            setUserCards(userCardsRes.data);
            setAllCards(allCardsRes.data);
        } catch (error) {
            console.error('Error loading cards:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCards = allCards.filter(card => {
        if (filter === 'owned') {
            return userCards.some(userCard => userCard.id === card.id);
        }
        if (filter === 'not_owned') {
            return !userCards.some(userCard => userCard.id === card.id);
        }
        if (filter !== 'all') {
            return card.rarity === filter;
        }
        return true;
    });

    const sortedCards = [...filteredCards].sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'attack':
                return b.attack - a.attack;
            case 'defense':
                return b.defense - a.defense;
            case 'cost':
                return a.cost - b.cost;
            case 'rarity':
                const rarityOrder = { 'COMMON': 1, 'RARE': 2, 'EPIC': 3, 'LEGENDARY': 4 };
                return rarityOrder[b.rarity] - rarityOrder[a.rarity];
            default:
                return 0;
        }
    });

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

    if (loading) {
        return <div className="loading">Đang tải bộ sưu tập...</div>;
    }

    return (
        <div>
            {/* Navigation */}
            <nav className="navbar">
                <h1>📚 Bộ Sưu Tập</h1>
                <div className="nav-links">
                    <Link to="/dashboard">Trang chủ</Link>
                    <Link to="/collection">Bộ sưu tập</Link>
                    <Link to="/gacha">Gacha</Link>
                    <Link to="/battle">Đấu thẻ</Link>
                </div>
            </nav>

            <div style={{ padding: '2rem' }}>
                {/* Filters and Stats */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                    background: 'rgba(255,255,255,0.1)',
                    padding: '1rem',
                    borderRadius: '10px'
                }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <label style={{ color: 'white' }}>Lọc:</label>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: '5px', border: 'none' }}
                        >
                            <option value="all">Tất cả ({allCards.length})</option>
                            <option value="owned">Đã sở hữu ({userCards.length})</option>
                            <option value="not_owned">Chưa có ({allCards.length - userCards.length})</option>
                            <option value="COMMON">Common</option>
                            <option value="RARE">Rare</option>
                            <option value="EPIC">Epic</option>
                            <option value="LEGENDARY">Legendary</option>
                        </select>

                        <label style={{ color: 'white' }}>Sắp xếp:</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: '5px', border: 'none' }}
                        >
                            <option value="name">Tên</option>
                            <option value="attack">Tấn công</option>
                            <option value="defense">Phòng thủ</option>
                            <option value="cost">Chi phí</option>
                            <option value="rarity">Độ hiếm</option>
                        </select>
                    </div>

                    <div style={{ color: 'white' }}>
                        Hiển thị: {sortedCards.length} thẻ
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="card-grid">
                    {sortedCards.map(card => {
                        const isOwned = userCards.some(userCard => userCard.id === card.id);

                        return (
                            <div
                                key={card.id}
                                className="card"
                                style={{
                                    opacity: isOwned ? 1 : 0.6,
                                    border: isOwned ? `3px solid ${getRarityColor(card.rarity)}` : '3px solid #ddd'
                                }}
                            >
                                <div className="card-image">
                                    {getElementEmoji(card.element)}
                                    {!isOwned && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            background: 'rgba(0,0,0,0.7)',
                                            color: 'white',
                                            padding: '0.5rem',
                                            borderRadius: '5px',
                                            fontSize: '0.8rem'
                                        }}>
                                            🔒 Chưa mở khóa
                                        </div>
                                    )}
                                </div>

                                <div className="card-info">
                                    <h3>{card.name}</h3>
                                    <p style={{ fontSize: '0.9rem', color: '#666', margin: '0.5rem 0' }}>
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
                        );
                    })}
                </div>

                {sortedCards.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        color: 'white',
                        fontSize: '1.2rem',
                        marginTop: '3rem'
                    }}>
                        Không có thẻ nào phù hợp với bộ lọc hiện tại.
                    </div>
                )}
            </div>
        </div>
    );
}

export default CardCollection;