import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Input from '../components/Input';
import Button from '../components/Button';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    
    setLoading(true);

    try {
      const res = await api.post('/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.dispatchEvent(new Event('storage'));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--color-bg)' }}>
      {/* Left side - Image */}
      <div style={{ flex: 1, display: 'none', '@media (minWidth: 768px)': { display: 'block' } }} className="auth-image-container">
        <img 
          src="/images/vegetables.jpg" 
          alt="Fresh vegetables" 
          style={{ width: '100%', height: '100vh', objectFit: 'cover' }}
        />
      </div>

      {/* Right side - Form */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
        <div style={{ maxWidth: '400px', width: '100%' }}>
          
          <div className="text-center" style={{ marginBottom: '40px' }}>
            <Link to="/" style={{ display: 'inline-block', marginBottom: '24px', fontSize: '2rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-primary)' }}>
              <span style={{ color: 'var(--color-secondary)' }}>🌿</span> SwapNShare
            </Link>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>Join the community</h1>
            <p style={{ color: 'var(--color-text-muted)' }}>Create an account to start sharing with your neighbors.</p>
          </div>

          {error && (
            <div className="mb-4 p-3" style={{ backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)', borderRadius: 'var(--radius-sm)', border: '1px solid #f5c2be' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              label="Full Name"
              type="text"
              name="name"
              placeholder="Jane Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
            
            <div style={{ position: 'relative' }}>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '38px', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <Button type="submit" variant="primary" block style={{ marginTop: '24px', padding: '12px' }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '32px', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Already have an account? <Link to="/login" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Sign in</Link>
          </p>
        </div>
      </div>
      
      <style>{`
        @media (max-width: 768px) {
          .auth-image-container { display: none !important; }
        }
      `}</style>
    </div>
  );
}

export default Register;
