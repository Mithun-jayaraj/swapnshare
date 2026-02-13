import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getCurrentPosition } from '../utils/geo';
import api from '../api/axios';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Get user location before login
      toast('📍 Getting your location...', { icon: '⏳' });
      const position = await getCurrentPosition();

      const { data } = await api.post('/login', {
        ...form,
        ...(position || {}),
      });

      login(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name}! 🎉`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-animated px-4 py-12">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="glass rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex w-16 h-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 text-3xl mb-4 shadow-lg shadow-purple-500/30 animate-float">
              🔄
            </div>
            <h1 className="font-display text-3xl font-bold gradient-text">
              Welcome Back
            </h1>
            <p className="text-white/50 text-sm mt-1">Sign in to start swapping</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base mt-2"
            >
              {loading ? '⏳ Signing in...' : '🚀 Sign In'}
            </button>
          </form>

          <p className="text-center text-white/50 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-purple-400 hover:text-purple-300 font-semibold">
              Create one free →
            </Link>
          </p>
        </div>

        {/* Hint */}
        <p className="text-center text-white/30 text-xs mt-4">
          📍 Location is used to show items near you (≤10km)
        </p>
      </div>
    </div>
  );
}
