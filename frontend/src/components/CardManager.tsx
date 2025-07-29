import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

    const rarities = ['COMMON', 'RARE', 'EPIC', 'LEGENDARY'];
    const elements = ['FIRE', 'WATER', 'EARTH', 'AIR', 'LIGHT', 'DARK'];

    useEffect(() => {
        loadCards();
    }, []);

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
            // Tạo URL tạm thời để xem trước ảnh
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
                                                src={imagePreview} 
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

            <div className="cards-table-container">
                <table className="cards-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Rarity</th>
                            <th>Element</th>
                            <th>Attack</th>
                            <th>Defense</th>
                            <th>Cost</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cards.map(card => (
                            <tr key={card.id}>
                                <td>{card.id}</td>
                                <td>
                                    {card.imageUrl ? (
                                        <img 
                                            // URL trả về từ backend đã bao gồm http://localhost:8080/....
                                            // nên không cần nối chuỗi nữa
                                            src={card.imageUrl} 
                                            alt={card.name}
                                            className="card-thumbnail"
                                        />
                                    ) : (
                                        <div className="no-image">No Image</div>
                                    )}
                                </td>
                                <td className="card-name">{card.name}</td>
                                <td>
                                    <span 
                                        className="rarity-badge"
                                        style={{ backgroundColor: getRarityColor(card.rarity) }}
                                    >
                                        {card.rarity}
                                    </span>
                                </td>
                                <td>
                                    <span className="element-badge">
                                        {getElementEmoji(card.element)} {card.element}
                                    </span>
                                </td>
                                <td className="stat-value">{card.attack}</td>
                                <td className="stat-value">{card.defense}</td>
                                <td className="stat-value">{card.cost}</td>
                                <td className="actions">
                                    <button 
                                        className="btn-edit"
                                        onClick={() => handleEdit(card)}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="btn-delete"
                                        onClick={() => handleDelete(card.id!)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {cards.length === 0 && (
                    <div className="no-cards">
                        No cards found. Create your first card!
                    </div>
                )}
            </div>
        </div>
    );
};

export default CardManager;
