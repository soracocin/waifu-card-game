import { NavLink } from 'react-router-dom';
import type { User } from '../types/user';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

function Header({ user, onLogout }: HeaderProps) {
  return (
    <nav className="navbar">
      <h1>🌸 Waifu Card Game</h1>
      <div className="nav-links">
        <NavLink to="/dashboard" end className={({ isActive }) => (isActive ? 'active' : '')}>
          Trang chủ
        </NavLink>
        <NavLink to="/collection" className={({ isActive }) => (isActive ? 'active' : '')}>
          Bộ sưu tập
        </NavLink>
        <NavLink to="/gacha" className={({ isActive }) => (isActive ? 'active' : '')}>
          Gacha
        </NavLink>
        <NavLink to="/battle" className={({ isActive }) => (isActive ? 'active' : '')}>
          Đấu thẻ
        </NavLink>
      </div>
      <div className="user-info">
        <div className="currency">
          <span>💰 {user.coins?.toLocaleString() || 0}</span>
          <span>💎 {user.gems?.toLocaleString() || 0}</span>
        </div>
        <span>
          Lv.{user.level} {user.username}
        </span>
        <button onClick={onLogout} className="btn" style={{ marginLeft: '1rem' }}>
          Đăng xuất
        </button>
      </div>
    </nav>
  );
}

export default Header;
