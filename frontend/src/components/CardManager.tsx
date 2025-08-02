import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UPLOAD_BASE_URL } from "../config";
interface Card {
    id?: number;
    name: string;
    description: string;
    attack: number;
    defense: number;
    cost: number;
    rarity: string;
    element: string;
    imageUrl: string;
}

interface CardManagerProps {
    user: any;
}

const CardManager: React.FC<CardManagerProps> = ({ user }) => {
    const [cards, setCards] = useState<Card[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingCard, setEditingCard] = useState<Card | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null); 
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [formData, setFormData] = useState<Card>({
        name: '',
        description: '',
        attack: 1,
        defense: 0,
        cost: 1,
        rarity: 'COMMON',
        element: 'FIRE',
        imageUrl: ''
    });
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const [startDrag, setStartDrag] = useState<{ x: number; y: number } | null>(null);

    const rarities = ['COMMON', 'RARE', 'EPIC', 'LEGENDARY'];
    const elements = ['FIRE', 'WATER', 'EARTH', 'AIR', 'LIGHT', 'DARK'];

    useEffect(() => {
        loadCards();
    }, []);

    useEffect(() => {
        if (!previewImageUrl) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setPreviewImageUrl(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [previewImageUrl]);

    const loadCards = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/api/cards');
            setCards(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to load cards');
            console.error('Error loading cards:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Sử dụng FormData để gửi cả file và dữ liệu JSON
        const data = new FormData();

        // 1. Thêm file nếu có
        if (selectedFile) {
            data.append('file', selectedFile);
        }

        // 2. Thêm object card data (dưới dạng chuỗi JSON)
        // Spring sẽ tự động parse chuỗi này thành CardDTO
        const cardData = { ...formData };
        if (editingCard && !selectedFile) {
             // Khi edit mà không chọn ảnh mới, giữ nguyên imageUrl cũ
             cardData.imageUrl = editingCard.imageUrl;
        } else {
            // Khi tạo mới hoặc edit và chọn ảnh mới, imageUrl sẽ do backend quyết định
            // Ta có thể xóa nó đi để tránh nhầm lẫn
            delete cardData.imageUrl;
        }
        data.append('card', new Blob([JSON.stringify(cardData)], { type: 'application/json' }));
        
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            if (editingCard) {
                await axios.put(`http://localhost:8080/api/cards/${editingCard.id}`, data, config);
            } else {
                await axios.post('http://localhost:8080/api/cards', data, config);
            }
            
            resetForm();
            loadCards();
            setError(null);
        } catch (err) {
            setError(editingCard ? 'Failed to update card' : 'Failed to create card');
            console.error('Error saving card:', err);
        }
    };

    const handleEdit = (card: Card) => {
        setEditingCard(card);
        setFormData({ ...card });
        setImagePreview(card.imageUrl || null); // Hiển thị ảnh cũ khi edit
        setShowForm(true);
    };

    const handleDelete = async (cardId: number) => {
        if (window.confirm('Are you sure you want to delete this card?')) {
            try {
                await axios.delete(`http://localhost:8080/api/cards/${cardId}`);
                loadCards();
                setError(null);
            } catch (err) {
                setError('Failed to delete card');
                console.error('Error deleting card:', err);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            attack: 1,
            defense: 0,
            cost: 1,
            rarity: 'COMMON',
            element: 'FIRE',
            imageUrl: ''
        });
        setEditingCard(null);
        setSelectedFile(null); // <-- RESET FILE
        setImagePreview(null); // <-- RESET PREVIEW
        setShowForm(false);
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            // Tạo URL tạm thởi để xem trước ảnh
            setImagePreview(URL.createObjectURL(file));
        }
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'attack' || name === 'defense' || name === 'cost' 
                ? parseInt(value) || 0 
                : value
        }));
    };

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case 'COMMON': return '#9ca3af';
            case 'RARE': return '#3b82f6';
            case 'EPIC': return '#8b5cf6';
            case 'LEGENDARY': return '#f59e0b';
            default: return '#9ca3af';
        }
    };

    const getElementEmoji = (element: string) => {
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

    const cardGridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        padding: '1.5rem',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
    };
    const cardItemStyle: React.CSSProperties = {
        background: 'rgba(255,255,255,0.08)',
        borderRadius: '12px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '340px',
        transition: 'box-shadow 0.2s',
        overflow: 'hidden',
    };
    const adminCardImageStyle: React.CSSProperties = {
        width: '100%',
        maxWidth: '180px',
        maxHeight: '180px',
        objectFit: 'cover',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.14)',
        marginBottom: '1rem',
        background: '#eee',
    };

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        e.preventDefault();
        setZoom(z => Math.max(0.3, Math.min(3, z - e.deltaY * 0.001)));
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setDragging(true);
        setStartDrag({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!dragging || !startDrag) return;
        setOffset({ x: e.clientX - startDrag.x, y: e.clientY - startDrag.y });
    };
    const handleMouseUp = () => {
        setDragging(false);
        setStartDrag(null);
    };
    const handleModalClose = () => {
        setPreviewImageUrl(null);
        setZoom(1);
        setOffset({ x: 0, y: 0 });
    };

    if (loading) {
        return <div className="loading">Loading cards...</div>;
    }

    return (
        <div className="card-manager">
            <div className="card-manager-header">
                <h2>Card Management</h2>
                <button 
                    className="btn-primary"
                    onClick={() => setShowForm(true)}
                >
                    Add New Card
                </button>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{editingCard ? 'Edit Card' : 'Create New Card'}</h3>
                            <button className="close-btn" onClick={resetForm}>×</button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="card-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">Name *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        maxLength={100}
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="imageFile">Card Image</label>
                                    <input
                                        type="file"
                                        id="imageFile"
                                        name="imageFile"
                                        onChange={handleFileChange}
                                        accept="image/png, image/jpeg, image/gif" // Giới hạn loại file
                                    />
                                    {imagePreview && (
                                        <div className="image-preview mt-2">
                                            <p>Image Preview:</p>
                                            <img 
                                                src={UPLOAD_BASE_URL + imagePreview} 
                                                alt="Preview" 
                                                style={{ maxWidth: '150px', maxHeight: '200px', objectFit: 'cover' }} 
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={3}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="rarity">Rarity *</label>
                                    <select
                                        id="rarity"
                                        name="rarity"
                                        value={formData.rarity}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        {rarities.map(rarity => (
                                            <option key={rarity} value={rarity}>
                                                {rarity}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="element">Element *</label>
                                    <select
                                        id="element"
                                        name="element"
                                        value={formData.element}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        {elements.map(element => (
                                            <option key={element} value={element}>
                                                {getElementEmoji(element)} {element}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="attack">Attack *</label>
                                    <input
                                        type="number"
                                        id="attack"
                                        name="attack"
                                        value={formData.attack}
                                        onChange={handleInputChange}
                                        min="1"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="defense">Defense *</label>
                                    <input
                                        type="number"
                                        id="defense"
                                        name="defense"
                                        value={formData.defense}
                                        onChange={handleInputChange}
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="cost">Cost *</label>
                                    <input
                                        type="number"
                                        id="cost"
                                        name="cost"
                                        value={formData.cost}
                                        onChange={handleInputChange}
                                        min="1"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn-secondary" onClick={resetForm}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editingCard ? 'Update Card' : 'Create Card'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div style={cardGridStyle}>
                {cards.map(card => (
                    <div key={card.id} style={cardItemStyle}>
                        <img
                            src={UPLOAD_BASE_URL + card.imageUrl}
                            alt={card.name}
                            style={adminCardImageStyle}
                            onClick={() => {
                                setPreviewImageUrl(UPLOAD_BASE_URL + card.imageUrl);
                                setZoom(1);
                                setOffset({ x: 0, y: 0 });
                            }}
                            onError={e => (e.currentTarget.src = '/default-card.png')}
                            className="card-image-clickable"
                        />
                        <h3 style={{margin: '0.5rem 0 0.2rem 0'}}>{card.name}</h3>
                        <div style={{fontSize: '0.95rem', color: '#bbb', marginBottom: '0.5rem'}}>
                            {getElementEmoji(card.element)} {card.element} | {card.rarity}
                        </div>
                        <p style={{fontSize: '0.95rem', marginBottom: '0.5rem', textAlign: 'center', minHeight: '48px'}}>{card.description}</p>
                        <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.95rem', marginBottom: '0.5rem'}}>
                            <span>ATK: <b>{card.attack}</b></span>
                            <span>DEF: <b>{card.defense}</b></span>
                            <span>Cost: <b>{card.cost}</b></span>
                        </div>
                        <div style={{display: 'flex', gap: '0.5rem', marginTop: 'auto'}}>
                            <button className="btn btn-secondary" onClick={() => handleEdit(card)}>Sửa</button>
                            <button className="btn btn-danger" onClick={() => handleDelete(card.id!)}>Xóa</button>
                        </div>
                    </div>
                ))}
            </div>

            {cards.length === 0 && (
                <div className="no-cards">
                    No cards found. Create your first card!
                </div>
            )}

            {previewImageUrl && (
                <div
                    className="image-preview-modal"
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.8)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: dragging ? 'grabbing' : 'zoom-in',
                        transition: 'background 0.2s',
                    }}
                    onClick={handleModalClose}
                    onWheel={handleWheel}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    <div
                        style={{
                            position: 'relative',
                            maxWidth: '90vw',
                            maxHeight: '90vh',
                            overflow: 'hidden',
                            background: 'transparent',
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <img
                            src={previewImageUrl}
                            alt="Preview"
                            style={{
                                transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
                                transition: dragging ? 'none' : 'transform 0.2s',
                                maxWidth: '100%',
                                maxHeight: '80vh',
                                borderRadius: '12px',
                                boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
                                cursor: dragging ? 'grabbing' : 'grab',
                                userSelect: 'none',
                            }}
                            draggable={false}
                            onMouseDown={handleMouseDown}
                        />
                        <div style={{
                            position: 'absolute',
                            top: 10, right: 10,
                            display: 'flex', gap: 8,
                            zIndex: 2,
                        }}>
                            <button
                                style={{
                                    background: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px', fontSize: 18, cursor: 'pointer', opacity: 0.9
                                }}
                                onClick={() => setZoom(z => Math.min(3, z + 0.2))}
                                type="button"
                            >+
                            </button>
                            <button
                                style={{
                                    background: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px', fontSize: 18, cursor: 'pointer', opacity: 0.9
                                }}
                                onClick={() => setZoom(z => Math.max(0.3, z - 0.2))}
                                type="button"
                            >-
                            </button>
                            <button
                                style={{
                                    background: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px', fontSize: 18, cursor: 'pointer', opacity: 0.9
                                }}
                                onClick={handleModalClose}
                                type="button"
                            >×
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CardManager;
