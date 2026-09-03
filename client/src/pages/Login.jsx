import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Input from '../components/Input';
import Button from '../components/Button';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }
    
    setLoading(true);

    try {
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.dispatchEvent(new Event('storage'));
      navigate('/explore');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      
      <div className="glass-content glass-card" style={{ maxWidth: '450px', width: '100%', padding: '40px', borderRadius: 'var(--radius-lg)' }}>
        
        <div className="text-center" style={{ marginBottom: '32px' }}>
          <Link to="/" style={{ display: 'inline-block', marginBottom: '16px', fontSize: '2rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'white' }}>
            <span style={{ color: 'var(--color-secondary)' }}>🌿</span> SwapNShare
          </Link>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>Welcome back</h1>
          <p style={{ opacity: 0.8 }}>Enter your details to access the neighborhood marketplace.</p>
        </div>

        {error && (
          <div className="mb-4 p-3" style={{ backgroundColor: 'var(--color-danger)', color: 'white', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">Email Address</label>
            <input
              className="form-control"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div style={{ position: 'relative', marginBottom: '24px' }}>
            <label className="form-label">Password</label>
            <input
              className="form-control"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ paddingRight: '60px' }}
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '12px', top: '38px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <Button type="submit" variant="primary" block style={{ padding: '12px', fontSize: '1.05rem', backgroundColor: 'var(--color-secondary)', border: 'none' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '32px', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/register" style={{ fontWeight: 600, color: 'white', textDecoration: 'underline' }}>Sign up</Link>
        </p>
      </div>

    </div>
  );
}

export default Login;
