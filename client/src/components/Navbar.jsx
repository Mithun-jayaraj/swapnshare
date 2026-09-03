import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Button from './Button';
import ProfileModal from './ProfileModal';

function Navbar() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Get user info from localStorage
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = !!token && !!user.name;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar glass-card" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', zIndex: 1000, position: 'sticky', top: 0 }}>
      <div className="container">
        {/* Brand */}
        <Link to="/" className="nav-brand" style={{ color: 'white' }}>
          <span className="nav-brand-leaf">🌿</span> SwapNShare
        </Link>

        {/* Desktop Nav Links */}
        <div className="nav-menu">
          <NavLink to="/explore" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
            Explore
          </NavLink>
          
          {isLoggedIn ? (
            <>
              <NavLink to="/add" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Add Item
              </NavLink>
              <NavLink to="/my-requests" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                My Requests
              </NavLink>
              <div className="nav-user">
                <div 
                  className="avatar" 
                  style={{ cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.3)', color: 'white' }}
                  title="Profile Settings"
                  onClick={() => setIsProfileModalOpen(true)}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <Button variant="secondary" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="secondary" size="sm">Log In</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>

      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />
    </nav>
  );
}

export default Navbar;
