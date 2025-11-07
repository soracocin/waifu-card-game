import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CSSProperties, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { UPLOAD_BASE_URL } from '../config';
import type { User } from '../types/user';

type Rarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
type Element = 'FIRE' | 'WATER' | 'EARTH' | 'AIR' | 'LIGHT' | 'DARK';
type Filter = 'all' | 'owned' | 'not_owned' | Rarity;
type SortKey = 'name' | 'attack' | 'defense' | 'cost' | 'rarity';

interface Card {
    id: number;
    name: string;
    description: string;
    attack: number;
    defense: number;
    cost: number;
    rarity: Rarity;
    element: Element;
    imageUrl: string;
}

interface CardCollectionProps {
    user: User;
}

const rarityColor: Record<Rarity, string> = {
    COMMON: '#808080',
    RARE: '#0066cc',
    EPIC: '#9933cc',
    LEGENDARY: '#ff9900'
};

const rarityOrder: Record<Rarity, number> = {
    COMMON: 1,
    RARE: 2,
    EPIC: 3,
    LEGENDARY: 4
};

const elementEmoji: Record<Element, string> = {
    FIRE: '🔥',
    WATER: '💧',
    EARTH: '🌱',
    AIR: '🌪️',
    LIGHT: '✨',
    DARK: '🌑'
};

const cardImageStyle: CSSProperties = {
    width: '100%',
    height: '150px',
    background: 'linear-gradient(45deg, #f0f0f0, #e0e0e0)',
    borderRadius: '5px',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3rem',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease'
};

function CardCollection({ user }: CardCollectionProps) {
    const [userCards, setUserCards] = useState<Card[]>([]);
    const [allCards, setAllCards] = useState<Card[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<Filter>('all');
    const [sortBy, setSortBy] = useState<SortKey>('name');

    const loadCards = useCallback(async () => {
        try {
            setLoading(true);
            const [ownedResponse, allResponse] = await Promise.all([
                axios.get<Card[]>(`http://localhost:8080/api/cards/user/${user.id}`),
                axios.get<Card[]>('http://localhost:8080/api/cards')
            ]);
            setUserCards(ownedResponse.data);
            setAllCards(allResponse.data);
        } catch (error) {
            console.error('Error loading cards:', error);
        } finally {
            setLoading(false);
        }
    }, [user.id]);

    useEffect(() => {
        loadCards();
    }, [loadCards]);

    const ownedIds = useMemo(() => new Set(userCards.map((card) => card.id)), [userCards]);

    const filteredCards = useMemo(() => {
        return allCards.filter((card) => {
            if (filter === 'owned') {
                return ownedIds.has(card.id);
            }
            if (filter === 'not_owned') {
                return !ownedIds.has(card.id);
            }
            if (filter !== 'all') {
                return card.rarity === filter;
            }
            return true;
        });
    }, [allCards, filter, ownedIds]);

    const sortedCards = useMemo(() => {
        return [...filteredCards].sort((a, b) => {
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
                    return rarityOrder[b.rarity] - rarityOrder[a.rarity];
                default:
                    return 0;
            }
        });
    }, [filteredCards, sortBy]);

    const handleFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setFilter(event.target.value as Filter);
    };

    const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSortBy(event.target.value as SortKey);
    };

    if (loading) {
        return <div className="loading">Loading your collection...</div>;
    }

    return (
        <div>
            <nav className="navbar">
                <h1>Card Collection</h1>
                <div className="nav-links">
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/collection">Collection</Link>
                    <Link to="/gacha">Gacha</Link>
                    <Link to="/battle">Battle</Link>
                </div>
            </nav>

            <div style={{ padding: '2rem' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                    background: 'rgba(255,255,255,0.1)',
                    padding: '1rem',
                    borderRadius: '12px'
                }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <label style={{ color: 'white' }}>Filter</label>
                        <select value={filter} onChange={handleFilterChange} style={{ padding: '0.5rem', borderRadius: '5px', border: 'none' }}>
                            <option value="all">All ({allCards.length})</option>
                            <option value="owned">Owned ({userCards.length})</option>
                            <option value="not_owned">Missing ({allCards.length - userCards.length})</option>
                            <option value="COMMON">Common</option>
                            <option value="RARE">Rare</option>
                            <option value="EPIC">Epic</option>
                            <option value="LEGENDARY">Legendary</option>
                        </select>

                        <label style={{ color: 'white' }}>Sort</label>
                        <select value={sortBy} onChange={handleSortChange} style={{ padding: '0.5rem', borderRadius: '5px', border: 'none' }}>
                            <option value="name">Name</option>
                            <option value="attack">Attack</option>
                            <option value="defense">Defense</option>
                            <option value="cost">Cost</option>
                            <option value="rarity">Rarity</option>
                        </select>
                    </div>

                    <div style={{ color: 'white' }}>
                        Showing {sortedCards.length} cards
                    </div>
                </div>

                <div className="card-grid">
                    {sortedCards.map((card) => {
                        const isOwned = ownedIds.has(card.id);
                        return (
                            <div
                                key={card.id}
                                className="card"
                                style={{
                                    opacity: isOwned ? 1 : 0.6,
                                    border: isOwned ? `3px solid ${rarityColor[card.rarity]}` : '3px solid #ddd'
                                }}
                            >
                                <div className="card-image">
                                    <img
                                        src={UPLOAD_BASE_URL + card.imageUrl}
                                        alt={card.name}
                                        style={cardImageStyle}
                                        className="card-image-clickable"
                                    />
                                    <span>{elementEmoji[card.element]}</span>
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
                                            Locked
                                        </div>
                                    )}
                                </div>

                                <div className="card-info">
                                    <h3>{card.name}</h3>
                                    <p style={{ fontSize: '0.9rem', color: '#666', margin: '0.5rem 0' }}>
                                        {card.description}
                                    </p>

                                    <div className="card-stats">
                                        <span className="stat">ATK {card.attack}</span>
                                        <span className="stat">DEF {card.defense}</span>
                                        <span className="stat">COST {card.cost}</span>
                                    </div>

                                    <div
                                        className="rarity"
                                        style={{ background: rarityColor[card.rarity] }}
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
                        No cards match the selected filters.
                    </div>
                )}
            </div>
        </div>
    );
}

export default CardCollection;
