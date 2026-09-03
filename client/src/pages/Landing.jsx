import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

function Landing() {
  return (
    <div className="glass-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Simple Transparent Navbar for Landing */}
      <nav style={{ padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="glass-content">
        <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
          <span style={{ color: 'var(--color-secondary)' }}>🌿</span> SwapNShare
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link to="/login">
            <Button variant="secondary" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.4)' }}>
              Log In
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="primary">Sign Up</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="glass-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 20px' }}>
        <h1 style={{ color: 'white', fontSize: '3.5rem', marginBottom: '24px', maxWidth: '800px', lineHeight: 1.2 }}>
          Exchange what you have.<br/>Find what you need.
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.25rem', marginBottom: '40px', maxWidth: '600px' }}>
          SwapNShare is your neighborhood marketplace for sustainable living. Trade electronics, furniture, books, and household essentials locally.
        </p>
        <Link to="/explore">
          <Button variant="primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
            Explore Marketplace
          </Button>
        </Link>
      </div>

      {/* Stats Section in Glass Card */}
      <div className="glass-content" style={{ padding: '40px 20px', display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
        <div className="glass-card" style={{ display: 'flex', gap: '60px', padding: '40px 80px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', margin: 0 }}>2,500+</h2>
            <p style={{ margin: 0, opacity: 0.8 }}>Items Exchanged</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', margin: 0 }}>1,200+</h2>
            <p style={{ margin: 0, opacity: 0.8 }}>Active Neighbors</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', margin: 0 }}>350 kg</h2>
            <p style={{ margin: 0, opacity: 0.8 }}>Waste Prevented</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
