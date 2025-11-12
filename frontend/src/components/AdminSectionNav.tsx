import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function AdminSectionNav() {
    const { t } = useTranslation();
    const linkStyle = {
        padding: '0.5rem 1.25rem',
        borderRadius: '999px',
        border: '1px solid rgba(255,255,255,0.2)',
        color: '#fff',
        textDecoration: 'none',
        fontSize: '0.95rem',
        letterSpacing: 0.5,
    };

    const activeStyle = {
        background: 'rgba(255,255,255,0.12)',
        borderColor: 'rgba(255,255,255,0.6)',
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '2rem',
            flexWrap: 'wrap',
        }}>
            <NavLink
                to="/admin/cards"
                style={({ isActive }) => ({
                    ...linkStyle,
                    ...(isActive ? activeStyle : {}),
                })}
            >
                {t('admin.nav.cardManager')}
            </NavLink>
            <NavLink
                to="/admin/galleries"
                style={({ isActive }) => ({
                    ...linkStyle,
                    ...(isActive ? activeStyle : {}),
                })}
            >
                {t('admin.nav.galleryManager')}
            </NavLink>
        </div>
    );
}

export default AdminSectionNav;
