import { NavLink } from 'react-router-dom';

function AdminSectionNav() {
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
                Card Manager
            </NavLink>
            <NavLink
                to="/admin/galleries"
                style={({ isActive }) => ({
                    ...linkStyle,
                    ...(isActive ? activeStyle : {}),
                })}
            >
                Gallery Manager
            </NavLink>
        </div>
    );
}

export default AdminSectionNav;
