import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiHome, FiCreditCard, FiTarget, FiBook, FiLogOut, FiUsers } from 'react-icons/fi'

const CHILD_LINKS = [
  { to: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
  { to: '/wallet',    icon: <FiCreditCard />, label: 'My Wallet' },
  { to: '/missions',  icon: <FiTarget />, label: 'Missions' },
  { to: '/learning',  icon: <FiBook />, label: 'Learning' },
]
const PARENT_LINKS = [
  { to: '/parent', icon: <FiUsers />, label: 'Dashboard' },
]
const ADMIN_LINKS = [
  { to: '/admin', icon: <FiTarget />, label: 'Global Stats' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const links = user?.role === 'admin' ? ADMIN_LINKS : (user?.role === 'parent' ? PARENT_LINKS : CHILD_LINKS)

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">🪙</span>
        <h1>CoinQuest</h1>
      </div>

      <nav className="sidebar-nav">
        {links.map(({ to, icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <span className="nav-icon">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12, fontWeight: 700 }}>
          👋 {user?.name}
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 2 }}>
            {user?.role === 'admin' ? '🛡️ Super Admin' : user?.role === 'parent' ? '👨‍👩‍👧 Parent' : `⭐ Level ${user?.level}`}
          </div>
        </div>
        <button className="btn btn-outline" style={{ width: '100%' }} onClick={handleLogout}>
          <FiLogOut /> Logout
        </button>
      </div>
    </aside>
  )
}
