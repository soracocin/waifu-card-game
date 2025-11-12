import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import type { User } from '../types/user';

interface HeaderProps {
    user: User;
    onLogout: () => void;
}

function Header({ user, onLogout }: HeaderProps) {
    const { t } = useTranslation();
    const coinAmount = user.coins?.toLocaleString() ?? '0';
    const gemAmount = user.gems?.toLocaleString() ?? '0';

    return (
        <nav className="navbar">
            <h1>{t('header.title')}</h1>
            <div className="nav-links">
                <NavLink to="/dashboard" end className={({ isActive }) => (isActive ? 'active' : '')}>
                    {t('nav.dashboard')}
                </NavLink>
                <NavLink to="/collection" className={({ isActive }) => (isActive ? 'active' : '')}>
                    {t('nav.collection')}
                </NavLink>
                <NavLink to="/gacha" className={({ isActive }) => (isActive ? 'active' : '')}>
                    {t('nav.gacha')}
                </NavLink>
                <NavLink to="/battle" className={({ isActive }) => (isActive ? 'active' : '')}>
                    {t('nav.battle')}
                </NavLink>
            </div>
            <div className="user-info">
                <div className="currency">
                    <span>💰 {t('header.coinsLabel', { amount: coinAmount })}</span>
                    <span>💎 {t('header.gemsLabel', { amount: gemAmount })}</span>
                </div>
                <span>
                    {t('header.level', { level: user.level, username: user.username })}
                </span>
                <button onClick={onLogout} className="btn" style={{ marginLeft: '1rem' }}>
                    {t('header.logout')}
                </button>
                <LanguageSwitcher className="language-switcher" />
            </div>
        </nav>
    );
}

export default Header;
