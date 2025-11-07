import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import type { User } from '../types/user';

type Rarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
type Element = 'FIRE' | 'WATER' | 'EARTH' | 'AIR' | 'LIGHT' | 'DARK';

interface Card {
    id: number;
    name: string;
    description: string;
    attack: number;
    defense: number;
    cost: number;
    rarity: Rarity;
    element: Element;
    imageUrl?: string;
}

interface GachaResult {
    cards: Card[];
    pullType: string;
    totalCost: number;
    remainingCoins: number;
    remainingGems: number;
}

interface GachaSystemProps {
    user: User;
}

const rarityColor: Record<Rarity, string> = {
    COMMON: '#808080',
    RARE: '#0066cc',
    EPIC: '#9933cc',
    LEGENDARY: '#ff9900'
};

const elementEmoji: Record<Element, string> = {
    FIRE: '🔥',
    WATER: '💧',
    EARTH: '🌱',
    AIR: '🌪️',
    LIGHT: '✨',
    DARK: '🌑'
};

const rarityEmoji: Record<Rarity, string> = {
    COMMON: '⭐',
    RARE: '🌟',
    EPIC: '💠',
    LEGENDARY: '🏆'
};

function GachaSystem({ user }: GachaSystemProps) {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<GachaResult | null>(null);
    const [userStats, setUserStats] = useState<User>(user);
    const [showResult, setShowResult] = useState(false);

    const refreshUserData = async () => {
        try {
            const response = await axios.get<User>(`http://localhost:8080/api/users/${user.id}`);
            setUserStats(response.data);
        } catch (error) {
            console.error('Error refreshing user data:', error);
        }
    };

    const performGacha = async (pull: 'single' | 'ten', useGems = false) => {
        if (loading) {
            return;
        }

        const cost = pull === 'single' ? (useGems ? 1 : 100) : (useGems ? 9 : 900);
        const currency = useGems ? userStats.gems : userStats.coins;

        if (currency < cost) {
            alert(`Not enough ${useGems ? 'gems' : 'coins'}. You need ${cost}.`);
            return;
        }

        try {
            setLoading(true);
            const endpoint = pull === 'single' ? 'single' : 'ten';
            const response = await axios.post<GachaResult>(
                `http://localhost:8080/api/gacha/${endpoint}/${user.id}?useGems=${useGems}`
            );
            setResult(response.data);
            setShowResult(true);
            await refreshUserData();
        } catch (error) {
            console.error('Gacha error:', error);
            alert('Something went wrong while running gacha.');
        } finally {
            setLoading(false);
        }
    };

    if (showResult && result) {
        return (
            <div>
                <nav className="navbar">
                    <h1>Gacha Results</h1>
                    <div className="nav-links">
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/collection">Collection</Link>
                        <Link to="/gacha">Gacha</Link>
                        <Link to="/battle">Battle</Link>
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
                            You pulled {result.cards.length} new cards!
                        </h2>
                        <p style={{ color: 'white' }}>
                            Cost: {result.totalCost} {result.pullType.includes('GEM') ? 'gems' : 'coins'}
                        </p>
                        <p style={{ color: 'white' }}>
                            Remaining: {result.remainingCoins} coins | {result.remainingGems} gems
                        </p>
                    </div>

                    <div className="card-grid" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        {result.cards.map((card) => (
                            <div
                                key={`${card.id}-${card.name}`}
                                className="card"
                                style={{
                                    border: `3px solid ${rarityColor[card.rarity]}`
                                }}
                            >
                                <div className="card-image">
                                    <div style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        fontSize: '1.5rem'
                                    }}>
                                        {rarityEmoji[card.rarity]}
                                    </div>
                                    <div style={{
                                        position: 'absolute',
                                        top: '10px',
                                        left: '10px',
                                        fontSize: '1.2rem'
                                    }}>
                                        {elementEmoji[card.element]}
                                    </div>
                                </div>

                                <div className="card-info">
                                    <h3>{card.name}</h3>
                                    <p style={{ fontSize: '0.8rem', color: '#666', margin: '0.5rem 0' }}>
                                        {card.description}
                                    </p>

                                    <div className="card-stats">
                                        <span className="stat">ATK {card.attack}</span>
                                        <span className="stat">DEF {card.defense}</span>
                                        <span className="stat">COST {card.cost}</span>
                                    </div>

                                    <div className="rarity" style={{ background: rarityColor[card.rarity] }}>
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
                            Pull Again
                        </button>
                        <Link to="/collection" className="btn btn-large">
                            View Collection
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <nav className="navbar">
                <h1>Gacha System</h1>
                <div className="nav-links">
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/collection">Collection</Link>
                    <Link to="/gacha">Gacha</Link>
                    <Link to="/battle">Battle</Link>
                </div>
                <div className="currency">
                    <span>Coins {userStats.coins?.toLocaleString() || 0}</span>
                    <span>Gems {userStats.gems?.toLocaleString() || 0}</span>
                </div>
            </nav>

            <div style={{ padding: '2rem' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{
                        background: 'rgba(255,255,255,0.1)',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        marginBottom: '2rem'
                    }}>
                        <h2 style={{ color: 'white', marginBottom: '1rem' }}>Gacha Rewards</h2>
                        <ul style={{ color: 'white', lineHeight: 1.6 }}>
                            <li>Single pull: 100 coins or 1 gem</li>
                            <li>Ten pull: 900 coins or 9 gems</li>
                            <li>Ten pull guarantees at least one Rare card</li>
                            <li>Use coins first to save gems for events</li>
                        </ul>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem'
                    }}>
                        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎲</div>
                            <h3>Single Pull</h3>
                            <p style={{ margin: '1rem 0', color: '#666' }}>
                                Grab a random card with instant delivery.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <button
                                    className="btn btn-large"
                                    onClick={() => performGacha('single', false)}
                                    disabled={loading || userStats.coins < 100}
                                >
                                    {loading ? 'Processing...' : '100 Coins'}
                                </button>

                                <button
                                    className="btn btn-large btn-warning"
                                    onClick={() => performGacha('single', true)}
                                    disabled={loading || userStats.gems < 1}
                                >
                                    {loading ? 'Processing...' : '1 Gem'}
                                </button>
                            </div>
                        </div>

                        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎁</div>
                            <h3>Ten Pull</h3>
                            <p style={{ margin: '1rem 0', color: '#666' }}>
                                Ten cards plus a guaranteed Rare or better.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <button
                                    className="btn btn-large btn-success"
                                    onClick={() => performGacha('ten', false)}
                                    disabled={loading || userStats.coins < 900}
                                >
                                    {loading ? 'Processing...' : '900 Coins'}
                                </button>
                                <small style={{ color: '#666' }}>Save 100 coins</small>

                                <button
                                    className="btn btn-large btn-warning"
                                    onClick={() => performGacha('ten', true)}
                                    disabled={loading || userStats.gems < 9}
                                >
                                    {loading ? 'Processing...' : '9 Gems'}
                                </button>
                                <small style={{ color: '#666' }}>Save 1 gem</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GachaSystem;
