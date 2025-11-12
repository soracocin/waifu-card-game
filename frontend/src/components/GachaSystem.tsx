import { useMemo, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
    FIRE: '??',
    WATER: '??',
    EARTH: '??',
    AIR: '???',
    LIGHT: '?',
    DARK: '??'
};

const rarityEmoji: Record<Rarity, string> = {
    COMMON: '?',
    RARE: '??',
    EPIC: '??',
    LEGENDARY: '??'
};

function GachaSystem({ user }: GachaSystemProps) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<GachaResult | null>(null);
    const [userStats, setUserStats] = useState<User>(user);
    const [showResult, setShowResult] = useState(false);

    const rewardTips = useMemo(() => t('gacha.rewards.points', { returnObjects: true }) as string[], [t]);

    const refreshUserData = async () => {
        try {
            const response = await axios.get<User>('http://localhost:8080/api/users/' + user.id);
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
            const currencyName = useGems ? t('gacha.currency.gemName') : t('gacha.currency.coinName');
            alert(t('gacha.errors.notEnough', { currency: currencyName, cost }));
            return;
        }

        try {
            setLoading(true);
            const endpoint = pull === 'single' ? 'single' : 'ten';
            const response = await axios.post<GachaResult>(
                'http://localhost:8080/api/gacha/' + endpoint + '/' + user.id + '?useGems=' + useGems
            );
            setResult(response.data);
            setShowResult(true);
            await refreshUserData();
        } catch (error) {
            console.error('Gacha error:', error);
            alert(t('gacha.errors.generic'));
        } finally {
            setLoading(false);
        }
    };

    if (showResult && result) {
        const currencyUsed = result.pullType.includes('GEM') ? t('gacha.currency.gemName') : t('gacha.currency.coinName');
        return (
            <div>
                <nav className="navbar">
                    <h1>{t('gacha.results.title')}</h1>
                    <div className="nav-links">
                        <Link to="/dashboard">{t('nav.dashboard')}</Link>
                        <Link to="/collection">{t('nav.collection')}</Link>
                        <Link to="/gacha">{t('nav.gacha')}</Link>
                        <Link to="/battle">{t('nav.battle')}</Link>
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
                            {t('gacha.results.summary', { count: result.cards.length })}
                        </h2>
                        <p style={{ color: 'white' }}>
                            {t('gacha.results.cost', { amount: result.totalCost, currency: currencyUsed })}
                        </p>
                        <p style={{ color: 'white' }}>
                            {t('gacha.results.remaining', { coins: result.remainingCoins, gems: result.remainingGems })}
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
                                        {card.description || t('common.status.noDescription')}
                                    </p>

                                    <div className="card-stats">
                                        <span className="stat">{t('collection.stats.attack', { value: card.attack })}</span>
                                        <span className="stat">{t('collection.stats.defense', { value: card.defense })}</span>
                                        <span className="stat">{t('collection.stats.cost', { value: card.cost })}</span>
                                    </div>

                                    <div className="rarity" style={{ background: rarityColor[card.rarity] }}>
                                        {t('cards.rarity.' + card.rarity)}
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
                            {t('gacha.results.pullAgain')}
                        </button>
                        <Link to="/collection" className="btn btn-large">
                            {t('gacha.results.viewCollection')}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <nav className="navbar">
                <h1>{t('gacha.title')}</h1>
                <div className="nav-links">
                    <Link to="/dashboard">{t('nav.dashboard')}</Link>
                    <Link to="/collection">{t('nav.collection')}</Link>
                    <Link to="/gacha">{t('nav.gacha')}</Link>
                    <Link to="/battle">{t('nav.battle')}</Link>
                </div>
                <div className="currency">
                    <span>{t('gacha.currency.coinsLabel', { amount: userStats.coins?.toLocaleString() || 0 })}</span>
                    <span>{t('gacha.currency.gemsLabel', { amount: userStats.gems?.toLocaleString() || 0 })}</span>
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
                        <h2 style={{ color: 'white', marginBottom: '1rem' }}>{t('gacha.rewards.title')}</h2>
                        <ul style={{ color: 'white', lineHeight: 1.6 }}>
                            {rewardTips.map((tip) => (
                                <li key={tip}>{tip}</li>
                            ))}
                        </ul>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem'
                    }}>
                        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>??</div>
                            <h3>{t('gacha.single.title')}</h3>
                            <p style={{ margin: '1rem 0', color: '#666' }}>
                                {t('gacha.single.description')}
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <button
                                    className="btn btn-large"
                                    onClick={() => performGacha('single', false)}
                                    disabled={loading || userStats.coins < 100}
                                >
                                    {loading ? t('gacha.buttons.processing') : t('gacha.single.coinButton', { amount: 100 })}
                                </button>

                                <button
                                    className="btn btn-large btn-warning"
                                    onClick={() => performGacha('single', true)}
                                    disabled={loading || userStats.gems < 1}
                                >
                                    {loading ? t('gacha.buttons.processing') : t('gacha.single.gemButton', { count: 1 })}
                                </button>
                            </div>
                        </div>

                        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>??</div>
                            <h3>{t('gacha.ten.title')}</h3>
                            <p style={{ margin: '1rem 0', color: '#666' }}>
                                {t('gacha.ten.description')}
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <button
                                    className="btn btn-large btn-success"
                                    onClick={() => performGacha('ten', false)}
                                    disabled={loading || userStats.coins < 900}
                                >
                                    {loading ? t('gacha.buttons.processing') : t('gacha.ten.coinButton', { amount: 900 })}
                                </button>
                                <small style={{ color: '#666' }}>{t('gacha.ten.coinSavings')}</small>

                                <button
                                    className="btn btn-large btn-warning"
                                    onClick={() => performGacha('ten', true)}
                                    disabled={loading || userStats.gems < 9}
                                >
                                    {loading ? t('gacha.buttons.processing') : t('gacha.ten.gemButton', { count: 9 })}
                                </button>
                                <small style={{ color: '#666' }}>{t('gacha.ten.gemSavings')}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GachaSystem;
