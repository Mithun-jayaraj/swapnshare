import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('See you soon! 👋');
    navigate('/login');
  };

  const navItems = user
    ? [
        { to: '/', label: '🏠 Browse' },
        { to: '/add', label: '➕ Add Item' },
        { to: '/requests', label: '🔄 Requests' },
        { to: '/dashboard', label: '📊 Dashboard' },
      ]
    : [];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-blue-900/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-purple-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-lg shadow-lg group-hover:scale-110 transition-transform">
              🔄
            </div>
            <span className="font-display text-xl font-bold bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent tracking-wide hidden sm:block">
              SwapnShare
            </span>
          </Link>

          {/* Desktop Nav */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/20 text-sm font-semibold"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-sm">
                    {user.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <span className="text-white/90">{user.name?.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden sm:block bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-sm font-semibold px-4 py-2 rounded-xl transition-all"
                >
                  Logout
                </button>
                {/* Mobile menu btn */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                >
                  {menuOpen ? '✕' : '☰'}
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                  Join Free
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && user && (
        <div className="md:hidden glass border-t border-white/10 px-4 py-3 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Link
            to="/profile"
            onClick={() => setMenuOpen(false)}
            className="px-4 py-3 rounded-xl text-sm font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-all"
          >
            👤 Profile
          </Link>
          <button
            onClick={() => { setMenuOpen(false); handleLogout(); }}
            className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-rose-300 hover:bg-rose-500/10 transition-all"
          >
            🚪 Logout
          </button>
        </div>
      )}
    </nav>
  );
}
