import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function BattleArena() {
    const [searching, setSearching] = useState(false);
    const { t } = useTranslation();

    const startMatchmaking = () => {
        setSearching(true);
        setTimeout(() => {
            alert(t('battle.alert'));
            setSearching(false);
        }, 2000);
    };

    return (
        <div>
            <nav className="navbar">
                <h1>{t('battle.title')}</h1>
                <div className="nav-links">
                    <Link to="/dashboard">{t('nav.dashboard')}</Link>
                    <Link to="/collection">{t('nav.collection')}</Link>
                    <Link to="/gacha">{t('nav.gacha')}</Link>
                    <Link to="/battle">{t('nav.battle')}</Link>
                </div>
            </nav>

            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>

                    <div className="card" style={{ padding: '3rem' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>??</div>
                        <h2>{t('battle.pvpTitle')}</h2>
                        <p style={{ margin: '2rem 0', fontSize: '1.1rem', color: '#666', whiteSpace: 'pre-line' }}>
                            {t('battle.description')}
                        </p>

                        <button
                            className="btn btn-large"
                            onClick={startMatchmaking}
                            disabled={searching}
                        >
                            {searching ? t('battle.button.searching') : t('battle.button.findMatch')}
                        </button>
                    </div>

                    <div className="card" style={{ marginTop: '2rem' }}>
                        <h3>{t('battle.comingSoon.title')}</h3>
                        <ul style={{ textAlign: 'left', paddingLeft: '2rem', lineHeight: '1.8' }}>
                            {(t('battle.comingSoon.items', { returnObjects: true }) as string[]).map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BattleArena;
