import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { UPLOAD_BASE_URL } from '../config';
import { handleImageError } from '../utils/imageFallback';
import type { CardCollectionSummary, CollectionImage } from '../types/collection';

interface Card {
    id: number;
    name: string;
    description: string;
    rarity: string;
    element: string;
    imageUrl?: string | null;
}

interface CollectionFormState {
    name: string;
    description: string;
}

interface ImageFormState {
    imageUrl: string;
    title: string;
    description: string;
    orderIndex: number;
}

const emptyCollectionForm: CollectionFormState = {
    name: '',
    description: '',
};

const emptyImageForm: ImageFormState = {
    imageUrl: '',
    title: '',
    description: '',
    orderIndex: 0,
};

function resolveImageUrl(imageUrl?: string | null) {
    if (!imageUrl) {
        return '';
    }
    return imageUrl.startsWith('http') ? imageUrl : `${UPLOAD_BASE_URL}${imageUrl}`;
}

function GalleryManager() {
    const { t } = useTranslation();
    const [cards, setCards] = useState<Card[]>([]);
    const [cardsLoading, setCardsLoading] = useState(true);
    const [cardsError, setCardsError] = useState<string | null>(null);

    const [selectedCardId, setSelectedCardId] = useState<number | ''>('');
    const [collections, setCollections] = useState<CardCollectionSummary[]>([]);
    const [collectionsLoading, setCollectionsLoading] = useState(false);
    const [collectionsError, setCollectionsError] = useState<string | null>(null);

    const [collectionForm, setCollectionForm] = useState<CollectionFormState>(emptyCollectionForm);
    const [collectionFormVisible, setCollectionFormVisible] = useState(false);
    const [editingCollectionId, setEditingCollectionId] = useState<number | null>(null);
    const [savingCollection, setSavingCollection] = useState(false);

    const [expandedCollectionId, setExpandedCollectionId] = useState<number | null>(null);
    const [imageFormCollectionId, setImageFormCollectionId] = useState<number | null>(null);
    const [imageForm, setImageForm] = useState<ImageFormState>(emptyImageForm);
    const [editingImageId, setEditingImageId] = useState<number | null>(null);
    const [savingImage, setSavingImage] = useState(false);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                setCardsLoading(true);
                const { data } = await axios.get<Card[]>('http://localhost:8080/api/cards');
                setCards(data);
                setCardsError(null);
            } catch (error) {
                console.error('Failed to load cards', error);
                setCardsError(t('gallery.messages.cardsError'));
            } finally {
                setCardsLoading(false);
            }
        };

        fetchCards();
    }, []);

    useEffect(() => {
        if (!selectedCardId) {
            setCollections([]);
            return;
        }

        fetchCollections(Number(selectedCardId));
    }, [selectedCardId]);

    const selectedCard = useMemo(() => {
        if (!selectedCardId) {
            return undefined;
        }
        return cards.find((card) => card.id === Number(selectedCardId));
    }, [cards, selectedCardId]);

    const fetchCollections = async (cardId: number) => {
        try {
            setCollectionsLoading(true);
            const { data } = await axios.get<CardCollectionSummary[]>(`http://localhost:8080/api/cards/${cardId}/collections`);
            setCollections(data);
            setCollectionsError(null);
        } catch (error) {
            console.error('Failed to load collections', error);
            setCollections([]);
            setCollectionsError(t('gallery.messages.error'));
        } finally {
            setCollectionsLoading(false);
        }
    };

    const resetCollectionForm = () => {
        setCollectionForm(emptyCollectionForm);
        setEditingCollectionId(null);
        setCollectionFormVisible(false);
    };

    const handleCollectionSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!selectedCardId) {
            return;
        }
        try {
            setSavingCollection(true);
            const payload = {
                cardId: Number(selectedCardId),
                name: collectionForm.name.trim(),
                description: collectionForm.description.trim(),
            };

            if (!payload.name) {
                setCollectionsError(t('gallery.messages.requiredName'));
                return;
            }

            if (editingCollectionId) {
                await axios.put(`http://localhost:8080/api/collections/${editingCollectionId}`, payload);
            } else {
                await axios.post(`http://localhost:8080/api/cards/${selectedCardId}/collections`, payload);
            }

            await fetchCollections(Number(selectedCardId));
            resetCollectionForm();
            setCollectionsError(null);
        } catch (error) {
            console.error('Failed to save collection', error);
            setCollectionsError(t('gallery.messages.saveCollection'));
        } finally {
            setSavingCollection(false);
        }
    };

    const handleDeleteCollection = async (collectionId: number) => {
        if (!selectedCardId) {
            return;
        }
        if (!window.confirm(t('common.confirmations.deleteCollection'))) {
            return;
        }
        try {
            await axios.delete(`http://localhost:8080/api/collections/${collectionId}`);
            if (expandedCollectionId === collectionId) {
                setExpandedCollectionId(null);
                setImageFormCollectionId(null);
            }
            await fetchCollections(Number(selectedCardId));
        } catch (error) {
            console.error('Failed to delete collection', error);
            setCollectionsError(t('gallery.messages.cannotDelete'));
        }
    };

    const openCreateCollection = () => {
        setCollectionFormVisible(true);
        setEditingCollectionId(null);
        setCollectionForm(emptyCollectionForm);
    };

    const openEditCollection = (collection: CardCollectionSummary) => {
        setCollectionFormVisible(true);
        setEditingCollectionId(collection.id);
        setCollectionForm({
            name: collection.name,
            description: collection.description ?? '',
        });
    };

    const toggleCollection = (collectionId: number) => {
        if (expandedCollectionId === collectionId) {
            setExpandedCollectionId(null);
            setImageFormCollectionId(null);
            resetImageForm();
            return;
        }
        setExpandedCollectionId(collectionId);
        setImageFormCollectionId(collectionId);
        resetImageForm();
    };

    const resetImageForm = () => {
        setImageForm(emptyImageForm);
        setEditingImageId(null);
    };

    const handleImageSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!imageFormCollectionId) {
            return;
        }

        try {
            setSavingImage(true);
            const payload = {
                collectionId: imageFormCollectionId,
                imageUrl: imageForm.imageUrl.trim(),
                title: imageForm.title.trim(),
                description: imageForm.description.trim(),
                orderIndex: imageForm.orderIndex,
            };

            if (!payload.imageUrl) {
                setCollectionsError(t('gallery.messages.requiredImageUrl'));
                return;
            }

            if (editingImageId) {
                await axios.put(`http://localhost:8080/api/images/${editingImageId}`, payload);
            } else {
                await axios.post(`http://localhost:8080/api/collections/${imageFormCollectionId}/images`, payload);
            }

            if (selectedCardId) {
                await fetchCollections(Number(selectedCardId));
            }
            resetImageForm();
            setCollectionsError(null);
        } catch (error) {
            console.error('Failed to save image', error);
            setCollectionsError(t('gallery.messages.saveImage'));
        } finally {
            setSavingImage(false);
        }
    };

    const handleDeleteImage = async (imageId: number) => {
        if (!window.confirm(t('common.confirmations.deleteImage'))) {
            return;
        }
        try {
            await axios.delete(`http://localhost:8080/api/images/${imageId}`);
            if (selectedCardId) {
                await fetchCollections(Number(selectedCardId));
            }
            if (editingImageId === imageId) {
                resetImageForm();
            }
        } catch (error) {
            console.error('Failed to delete image', error);
            setCollectionsError(t('gallery.messages.cannotDeleteImage'));
        }
    };

    const startEditImage = (collectionId: number, image: CollectionImage) => {
        setImageFormCollectionId(collectionId);
        setExpandedCollectionId(collectionId);
        setEditingImageId(image.id);
        setImageForm({
            imageUrl: image.imageUrl || '',
            title: image.title || '',
            description: image.description || '',
            orderIndex: image.orderIndex ?? 0,
        });
    };

    return (
        <div style={{ color: '#fff' }}>
            <section style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                marginBottom: '2rem',
            }}>
                <label style={{ fontWeight: 600 }}>{t('gallery.selectLabel')}</label>
                <select
                    value={selectedCardId}
                    onChange={(event) => setSelectedCardId(event.target.value ? Number(event.target.value) : '')}
                    disabled={cardsLoading}
                    style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.15)',
                        background: 'rgba(0,0,0,0.2)',
                        color: '#fff',
                        fontSize: '1rem',
                    }}
                >
                    <option value="">{t('gallery.selectPlaceholder')}</option>
                            {cards.map((card) => (
                                <option key={card.id} value={card.id}>
                                    {card.name} ({t('cards.rarity.' + card.rarity)})
                                </option>
                            ))}
                </select>
                {cardsError && <span style={{ color: '#ff9e9e' }}>{cardsError}</span>}
                {selectedCard && (
                    <div style={{
                        display: 'flex',
                        gap: '1.5rem',
                        alignItems: 'center',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '14px',
                        padding: '1rem 1.5rem',
                        flexWrap: 'wrap',
                    }}>
                        {selectedCard.imageUrl && (
                            <img
                                src={resolveImageUrl(selectedCard.imageUrl)}
                                alt={selectedCard.name}
                                style={{ width: '100px', height: '140px', objectFit: 'cover', borderRadius: '8px' }}
                                onError={handleImageError}
                            />
                        )}
                        <div style={{ flex: 1, minWidth: 220 }}>
                            <h3 style={{ margin: 0 }}>{selectedCard.name}</h3>
                            <p style={{ margin: '0.35rem 0', color: 'rgba(255,255,255,0.7)' }}>{selectedCard.description}</p>
                            <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                                <span>{t('gallery.cardInfo.rarity')}: {t('cards.rarity.' + selectedCard.rarity)}</span> {' | '}
                                <span>{t('gallery.cardInfo.element')}: {t('cards.elements.' + selectedCard.element)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap',
                }}>
                    <button
                        type="button"
                        onClick={openCreateCollection}
                        disabled={!selectedCardId}
                        className="btn"
                    >
                        + {t('gallery.actions.create')}
                    </button>
                    {collectionFormVisible && (
                        <button type="button" onClick={resetCollectionForm} className="btn btn-secondary">
                            {t('gallery.actions.cancel')}
                        </button>
                    )}
                </div>

                {collectionFormVisible && (
                    <form onSubmit={handleCollectionSubmit} style={{
                        marginTop: '1.25rem',
                        padding: '1.5rem',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '14px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        display: 'grid',
                        gap: '1rem',
                    }}>
                        <h3 style={{ margin: 0 }}>
                            {editingCollectionId ? t('gallery.form.editTitle') : t('gallery.form.newTitle')}
                        </h3>
                        <input
                            type="text"
                            placeholder={t('gallery.form.namePlaceholder')}
                            value={collectionForm.name}
                            onChange={(event) => setCollectionForm((prev) => ({ ...prev, name: event.target.value }))}
                            required
                            style={{ padding: '0.75rem 1rem', borderRadius: '10px', border: 'none' }}
                        />
                        <textarea
                            placeholder={t('gallery.form.descriptionPlaceholder')}
                            value={collectionForm.description}
                            onChange={(event) => setCollectionForm((prev) => ({ ...prev, description: event.target.value }))}
                            rows={3}
                            style={{ padding: '0.75rem 1rem', borderRadius: '10px', border: 'none' }}
                        />
                        <button type="submit" className="btn" disabled={savingCollection}>
                            {savingCollection ? t('gallery.form.saving') : editingCollectionId ? t('gallery.form.buttonUpdate') : t('gallery.form.buttonCreate')}
                        </button>
                    </form>
                )}
            </section>

            {collectionsError && <div style={{ color: '#ff9e9e', marginBottom: '1rem' }}>{collectionsError}</div>}

            {!selectedCardId && (
                <p style={{ color: 'rgba(255,255,255,0.6)' }}>{t('gallery.messages.selectCard')}</p>
            )}

            {selectedCardId && collectionsLoading && (
                <p style={{ color: 'rgba(255,255,255,0.8)' }}>{t('gallery.messages.loading')}</p>
            )}

            {selectedCardId && !collectionsLoading && collections.length === 0 && (
                <p style={{ color: 'rgba(255,255,255,0.6)' }}>{t('gallery.messages.none')}</p>
            )}

            <div style={{ display: 'grid', gap: '1.25rem' }}>
                {collections.map((collection) => (
                    <div key={collection.id} style={{
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '16px',
                        padding: '1.25rem',
                        background: 'rgba(0,0,0,0.2)',
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: '1rem',
                            flexWrap: 'wrap',
                        }}>
                            <div style={{ flex: 1, minWidth: 240 }}>
                                <h3 style={{ marginTop: 0, marginBottom: '0.35rem' }}>{collection.name}</h3>
                                <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)' }}>
                                    {collection.description || t('common.status.noDescriptionShort')}
                                </p>
                                <p style={{ marginTop: '0.5rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                                    {t('gallery.collection.imagesLabel', { count: collection.images?.length || 0 })}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => toggleCollection(collection.id)}>
                                    {expandedCollectionId === collection.id ? t('gallery.collection.hide') : t('gallery.collection.open')}
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={() => openEditCollection(collection)}>
                                    {t('gallery.collection.edit')}
                                </button>
                                <button type="button" className="btn btn-danger" onClick={() => handleDeleteCollection(collection.id)}>
                                    {t('gallery.collection.delete')}
                                </button>
                            </div>
                        </div>

                        {expandedCollectionId === collection.id && (
                            <div style={{ marginTop: '1.25rem' }}>
                                <div style={{
                                    display: 'grid',
                                    gap: '1rem',
                                    marginBottom: '1.25rem',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                                }}>
                                    {collection.images && collection.images.length > 0 ? (
                                        collection.images.map((image) => (
                                            <div key={image.id} style={{
                                                border: '1px solid rgba(255,255,255,0.08)',
                                                borderRadius: '12px',
                                                padding: '0.75rem',
                                                background: 'rgba(0,0,0,0.25)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '0.5rem',
                                            }}>
                                                {image.imageUrl && (
                                                    <img
                                                        src={resolveImageUrl(image.imageUrl)}
                                                        alt={image.title}
                                                        style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '10px' }}
                                                        onError={handleImageError}
                                                    />
                                                )}
                                                <div>
                                                    <strong>{image.title || 'Untitled image'}</strong>
                                                    <p style={{ margin: '0.25rem 0', color: 'rgba(255,255,255,0.7)' }}>
                                                        {image.description || t('common.status.noDescriptionShort')}
                                                    </p>
                                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                                                        Order: {image.orderIndex}
                                                    </p>
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary"
                                                        onClick={() => startEditImage(collection.id, image)}
                                                    >
                                                        {t('gallery.collection.edit')}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger"
                                                        onClick={() => handleDeleteImage(image.id)}
                                                    >
                                                        {t('gallery.collection.delete')}
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p style={{ gridColumn: '1 / -1', color: 'rgba(255,255,255,0.6)' }}>
                                            {t('common.messages.noImages')}
                                        </p>
                                    )}
                                </div>

                                <form onSubmit={handleImageSubmit} style={{
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    background: 'rgba(255,255,255,0.02)',
                                    display: 'grid',
                                    gap: '0.75rem',
                                }}>
                                    <h4 style={{ margin: 0 }}>
                                        {editingImageId ? t('gallery.imageForm.editTitle') : t('gallery.imageForm.title')}
                                    </h4>
                                    <input
                                        type="url"
                                        placeholder={t('gallery.imageForm.urlPlaceholder')}
                                        value={imageForm.imageUrl}
                                        onChange={(event) => setImageForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
                                        required
                                        style={{ padding: '0.6rem 0.9rem', borderRadius: '10px', border: 'none' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder={t('gallery.imageForm.titlePlaceholder')}
                                        value={imageForm.title}
                                        onChange={(event) => setImageForm((prev) => ({ ...prev, title: event.target.value }))}
                                        style={{ padding: '0.6rem 0.9rem', borderRadius: '10px', border: 'none' }}
                                    />
                                    <textarea
                                        placeholder={t('gallery.imageForm.descriptionPlaceholder')}
                                        value={imageForm.description}
                                        onChange={(event) => setImageForm((prev) => ({ ...prev, description: event.target.value }))}
                                        rows={3}
                                        style={{ padding: '0.6rem 0.9rem', borderRadius: '10px', border: 'none' }}
                                    />
                                    <label style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                                        {t('gallery.imageForm.orderLabel')}
                                        <input
                                            type="number"
                                            value={imageForm.orderIndex}
                                            onChange={(event) => setImageForm((prev) => ({ ...prev, orderIndex: Number(event.target.value) }))}
                                            style={{ marginLeft: '0.75rem', padding: '0.4rem 0.75rem', borderRadius: '8px', border: 'none' }}
                                        />
                                    </label>
                                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                        <button type="submit" className="btn" disabled={savingImage}>
                                            {savingImage ? t('gallery.imageForm.saving') : editingImageId ? t('gallery.imageForm.updateButton') : t('gallery.imageForm.addButton')}
                                        </button>
                                        {editingImageId && (
                                            <button type="button" className="btn btn-secondary" onClick={resetImageForm}>
                                                {t('gallery.imageForm.cancelEdit')}
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GalleryManager;
