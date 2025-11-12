import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import AppLayout from '../layouts/AppLayout';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../types/user';

function DashboardPage() {
    const { user, updateUser } = useAuth();
    const [userStats, setUserStats] = useState<User | null>(user);
    const { t } = useTranslation();

    useEffect(() => {
        if (!user) {
            return;
        }

        const refreshUserData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/users/' + user.id);
                setUserStats(response.data);
                updateUser(response.data);
            } catch (error) {
                console.error('Error refreshing user data:', error);
            }
        };

        refreshUserData();
    }, [user?.id, updateUser]);

    if (!userStats) {
        return null;
    }

    return (
        <AppLayout>
            <div style={{ padding: '2rem' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '2rem',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    <div className="card" style={{ gridColumn: 'span 2' }}>
                        <h2>{t('dashboard.welcome', { name: userStats.username })}</h2>
                        <p>{t('dashboard.levelStatus', { level: userStats.level, xp: userStats.experiencePoints })}</p>
                        <div style={{ marginTop: '1rem' }}>
                            <div style={{
                                background: '#e9ecef',
                                borderRadius: '10px',
                                padding: '1rem',
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '1rem'
                            }}>
                                <div>
                                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#495057' }}>{t('dashboard.currency.coins')}</h4>
                                    <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#ffc107' }}>
                                        {t('dashboard.currency.coins')} {userStats.coins?.toLocaleString() || 0}
                                    </p>
                                </div>
                                <div>
                                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#495057' }}>{t('dashboard.currency.gems')}</h4>
                                    <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#e91e63' }}>
                                        {t('dashboard.currency.gems')} {userStats.gems?.toLocaleString() || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <h3>{t('dashboard.sections.gacha.title')}</h3>
                        <p>{t('dashboard.sections.gacha.description')}</p>
                        <button className="btn btn-primary" onClick={() => (window.location.href = '/gacha')}>
                            {t('dashboard.sections.gacha.action')}
                        </button>
                    </div>

                    <div className="card">
                        <h3>{t('dashboard.sections.collection.title')}</h3>
                        <p>{t('dashboard.sections.collection.description')}</p>
                        <button className="btn btn-secondary" onClick={() => (window.location.href = '/collection')}>
                            {t('dashboard.sections.collection.action')}
                        </button>
                    </div>

                    <div className="card">
                        <h3>{t('dashboard.sections.battle.title')}</h3>
                        <p>{t('dashboard.sections.battle.description')}</p>
                        <button className="btn btn-success" onClick={() => (window.location.href = '/battle')}>
                            {t('dashboard.sections.battle.action')}
                        </button>
                    </div>

                    <div className="card">
                        <h3>{t('dashboard.sections.stats.title')}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div>{t('dashboard.sections.stats.level', { level: userStats.level })}</div>
                            <div>{t('dashboard.sections.stats.experience', { xp: userStats.experiencePoints })}</div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

export default DashboardPage;
