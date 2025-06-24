import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function BattleArena({ user }) {
    const [searching, setSearching] = useState(false);

    const startMatchmaking = () => {
        setSearching(true);
        // In a real implementation, this would connect to WebSocket
        setTimeout(() => {
            alert('Tính năng đấu thẻ đang được phát triển! Sẽ có trong phiên bản tới.');
            setSearching(false);
        }, 2000);
    };

    return (
        <div>
            <nav className="navbar">
                <h1>⚔️ Đấu Thẻ</h1>
                <div className="nav-links">
                    <Link to="/dashboard">Trang chủ</Link>
                    <Link to="/collection">Bộ sưu tập</Link>
                    <Link to="/gacha">Gacha</Link>
                    <Link to="/battle">Đấu thẻ</Link>
                </div>
            </nav>

            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>

                    <div className="card" style={{ padding: '3rem' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>⚔️</div>
                        <h2>Đấu Thẻ PvP</h2>
                        <p style={{ margin: '2rem 0', fontSize: '1.1rem', color: '#666' }}>
                            Thách đấu với người chơi khác bằng bộ thẻ của bạn!
                            <br />Chức năng này đang được phát triển và sẽ có trong bản cập nhật tới.
                        </p>

                        <button
                            className="btn btn-large"
                            onClick={startMatchmaking}
                            disabled={searching}
                        >
                            {searching ? 'Đang tìm đối thủ...' : 'Tìm Trận Đấu'}
                        </button>
                    </div>

                    <div className="card" style={{ marginTop: '2rem' }}>
                        <h3>🚧 Tính năng sắp ra mắt</h3>
                        <ul style={{ textAlign: 'left', paddingLeft: '2rem', lineHeight: '1.8' }}>
                            <li>Real-time multiplayer battles</li>
                            <li>Turn-based card gameplay</li>
                            <li>Ranking system</li>
                            <li>Battle rewards</li>
                            <li>Deck building strategy</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BattleArena;