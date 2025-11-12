import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CSSProperties, ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { UPLOAD_BASE_URL } from '../config';
import { handleImageError } from '../utils/imageFallback';
import type { User } from '../types/user';
import type { CardCollectionSummary } from '../types/collection';

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
    FIRE: '??',
    WATER: '??',
    EARTH: '??',
    AIR: '???',
    LIGHT: '?',
    DARK: '??'
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
    const { t } = useTranslation();
    const [userCards, setUserCards] = useState<Card[]>([]);
    const [allCards, setAllCards] = useState<Card[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<Filter>('all');
    const [sortBy, setSortBy] = useState<SortKey>('name');
    const [selectedCardId, setSelectedCardId] = useState<number | ''>('');
    const [collections, setCollections] = useState<CardCollectionSummary[]>([]);
    const [collectionsLoading, setCollectionsLoading] = useState(false);
    const [collectionsError, setCollectionsError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<CardCollectionSummary[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    const loadCards = useCallback(async () => {
        try {
            setLoading(true);
            const [ownedResponse, allResponse] = await Promise.all([
                axios.get<Card[]>('http://localhost:8080/api/cards/user/' + user.id),
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

    const fetchCollectionsByCard = useCallback(async (cardId: number) => {
        setCollectionsLoading(true);
        setCollectionsError(null);
        try {
            const { data } = await axios.get<CardCollectionSummary[]>('http://localhost:8080/api/cards/' + cardId + '/collections');
            setCollections(data);
        } catch (error) {
            console.error('Error loading collections:', error);
            setCollections([]);
            setCollectionsError(t('collection.explore.error'));
        } finally {
            setCollectionsLoading(false);
        }
    }, [t]);

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

    const handleCollectionSelect = (event: ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        if (!value) {
            setSelectedCardId('');
            setCollections([]);
            return;
        }
        const cardId = Number(value);
        setSelectedCardId(cardId);
        fetchCollectionsByCard(cardId);
    };

    const handleSearchSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!searchTerm.trim()) {
            setSearchResults([]);
            setSearchError(t('collection.search.validation'));
            return;
        }
        setSearchLoading(true);
        setSearchError(null);
        try {
            const { data } = await axios.get<CardCollectionSummary[]>('http://localhost:8080/api/collections', {
                params: { name: searchTerm.trim() }
            });
            setSearchResults(data);
        } catch (error) {
            console.error('Error searching collections:', error);
            setSearchResults([]);
            setSearchError(t('collection.search.error'));
        } finally {
            setSearchLoading(false);
        }
    };

    const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSortBy(event.target.value as SortKey);
    };

    if (loading) {
        return <div className="loading">{t('collection.loading')}</div>;
    }

    const cardEndpointText = '/api/cards/{cardId}/collections';
    const collectionsEndpointText = '/api/collections';

    return (
        <div>
            <nav className="navbar">
                <h1>{t('collection.title')}</h1>
                <div className="nav-links">
                    <Link to="/dashboard">{t('nav.dashboard')}</Link>
                    <Link to="/collection">{t('nav.collection')}</Link>
                    <Link to="/gacha">{t('nav.gacha')}</Link>
                    <Link to="/battle">{t('nav.battle')}</Link>
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
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <label style={{ color: 'white' }}>{t('collection.filters.label')}</label>
                        <select value={filter} onChange={handleFilterChange} style={{ padding: '0.5rem', borderRadius: '5px', border: 'none' }}>
                            <option value="all">{t('collection.filters.all', { count: allCards.length })}</option>
                            <option value="owned">{t('collection.filters.owned', { count: userCards.length })}</option>
                            <option value="not_owned">{t('collection.filters.missing', { count: allCards.length - userCards.length })}</option>
                            <option value="COMMON">{t('collection.filters.rarities.COMMON')}</option>
                            <option value="RARE">{t('collection.filters.rarities.RARE')}</option>
                            <option value="EPIC">{t('collection.filters.rarities.EPIC')}</option>
                            <option value="LEGENDARY">{t('collection.filters.rarities.LEGENDARY')}</option>
                        </select>

                        <label style={{ color: 'white' }}>{t('collection.sort.label')}</label>
                        <select value={sortBy} onChange={handleSortChange} style={{ padding: '0.5rem', borderRadius: '5px', border: 'none' }}>
                            <option value="name">{t('collection.sort.name')}</option>
                            <option value="attack">{t('collection.sort.attack')}</option>
                            <option value="defense">{t('collection.sort.defense')}</option>
                            <option value="cost">{t('collection.sort.cost')}</option>
                            <option value="rarity">{t('collection.sort.rarity')}</option>
                        </select>
                    </div>

                    <div style={{ color: 'white' }}>
                        {t('collection.showing', { count: sortedCards.length })}
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
                                        onError={handleImageError}
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
                                            {t('common.status.locked')}
                                        </div>
                                    )}
                                </div>

                                <div className="card-info">
                                    <h3>{card.name}</h3>
                                    <p style={{ fontSize: '0.9rem', color: '#666', margin: '0.5rem 0' }}>
                                        {card.description || t('common.status.noDescription')}
                                    </p>

                                    <div className="card-stats">
                                        <span className="stat">{t('collection.stats.attack', { value: card.attack })}</span>
                                        <span className="stat">{t('collection.stats.defense', { value: card.defense })}</span>
                                        <span className="stat">{t('collection.stats.cost', { value: card.cost })}</span>
                                    </div>

                                    <div
                                        className="rarity"
                                        style={{ background: rarityColor[card.rarity] }}
                                    >
                                        {t('cards.rarity.' + card.rarity)}
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
                        {t('collection.empty')}
                    </div>
                )}

                <section style={{ marginTop: '3rem' }}>
                    <div style={{
                        background: 'rgba(255,255,255,0.08)',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        marginBottom: '2rem'
                    }}>
                        <h2 style={{ marginBottom: '0.5rem' }}>{t('collection.explore.title')}</h2>
                        <p style={{ color: '#ccc', marginBottom: '1rem' }}>
                            {t('collection.explore.description', { cardEndpoint: cardEndpointText, collectionsEndpoint: collectionsEndpointText })}
                        </p>
                        <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem' }}>
                            {t('collection.explore.selectLabel')}
                        </label>
                        <select
                            value={selectedCardId}
                            onChange={handleCollectionSelect}
                            style={{ padding: '0.6rem', borderRadius: '8px', minWidth: '240px', border: 'none' }}
                        >
                            <option value="">{t('collection.explore.placeholder')}</option>
                            {allCards.map((card) => (
                                <option key={card.id} value={card.id}>
                                    {card.name} ({t('cards.rarity.' + card.rarity)})
                                </option>
                            ))}
                        </select>

                        {collectionsLoading && <p style={{ color: '#ccc', marginTop: '1rem' }}>{t('collection.explore.loading')}</p>}
                        {collectionsError && <p style={{ color: '#ff6b6b', marginTop: '1rem' }}>{collectionsError}</p>}
                        {!collectionsLoading && selectedCardId && collections.length === 0 && !collectionsError && (
                            <p style={{ color: '#ccc', marginTop: '1rem' }}>
                                {t('collection.explore.none')}
                            </p>
                        )}

                        <div className="card-grid" style={{ marginTop: '1.5rem' }}>
                            {collections.map((collection) => (
                                <div key={collection.id} className="card" style={{ background: 'rgba(0,0,0,0.35)' }}>
                                    <h3>{collection.name}</h3>
                                    <p style={{ color: '#bbb', minHeight: '48px' }}>{collection.description || t('collection.explore.descriptionFallback')}</p>
                                    <p style={{ fontWeight: 600, color: '#fff' }}>{t('collection.explore.imageCount', { count: collection.images.length })}</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                                        {collection.images.slice(0, 2).map((image) => (
                                            <div key={image.id} style={{
                                                padding: '0.6rem',
                                                borderRadius: '10px',
                                                background: 'rgba(255,255,255,0.05)'
                                            }}>
                                                <strong>{image.title || t('collection.explore.imageTitleFallback')}</strong>
                                                <p style={{ margin: '0.25rem 0', color: '#ccc' }}>{image.description || t('collection.explore.imageDescriptionFallback')}</p>
                                                <small style={{ color: '#999' }}>{t('collection.explore.dialogueCount', { count: image.dialogues.length })}</small>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{
                        background: 'rgba(255,255,255,0.04)',
                        borderRadius: '16px',
                        padding: '1.5rem'
                    }}>
                        <h3 style={{ marginBottom: '0.5rem' }}>{t('collection.search.title')}</h3>
                        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(event) => {
                                    setSearchTerm(event.target.value);
                                    if (searchError) {
                                        setSearchError(null);
                                    }
                                }}
                                placeholder={t('collection.search.placeholder')}
                                style={{
                                    flex: '1 1 240px',
                                    padding: '0.6rem',
                                    borderRadius: '8px',
                                    border: 'none'
                                }}
                            />
                            <button type="submit" className="btn btn-secondary" disabled={searchLoading}>
                                {searchLoading ? t('collection.search.searching') : t('collection.search.button')}
                            </button>
                        </form>
                        {searchError && <p style={{ color: '#ff6b6b' }}>{searchError}</p>}
                        {searchResults.length > 0 && (
                            <div className="card-grid">
                                {searchResults.map((collection) => (
                                    <div key={collection.id} className="card" style={{ background: 'rgba(0,0,0,0.35)' }}>
                                        <h3>{collection.name}</h3>
                                        <p style={{ color: '#bbb' }}>{collection.description || t('collection.explore.descriptionFallback')}</p>
                                        <p style={{ fontWeight: 600, color: '#fff' }}>{t('collection.search.imageCount', { count: collection.images.length })}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        {!searchLoading && searchResults.length === 0 && !searchError && searchTerm && (
                            <p style={{ color: '#ccc' }}>{t('collection.search.noResults')}</p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default CardCollection;
