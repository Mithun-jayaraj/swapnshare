import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getCurrentPosition } from '../utils/geo';
import api from '../api/axios';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      toast('📍 Getting your location...', { icon: '⏳' });
      const position = await getCurrentPosition();

      const { data } = await api.post('/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        ...(position || {}),
      });

      login(data.token, data.user);
      toast.success(`Welcome to SwapnShare, ${data.user.name}! 🎉`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-animated px-4 py-12">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -left-32 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="glass rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex w-16 h-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 text-3xl mb-4 shadow-lg shadow-pink-500/30 animate-float">
              ✨
            </div>
            <h1 className="font-display text-3xl font-bold gradient-text">
              Join SwapnShare
            </h1>
            <p className="text-white/50 text-sm mt-1">
              Swap items, save money, help the planet
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
                className="input-field"
              />
            </div>
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
                placeholder="Min. 6 characters"
                required
                minLength={6}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
                required
                className="input-field"
              />
            </div>

            {/* Features highlights */}
            <div className="bg-white/5 rounded-xl p-3 grid grid-cols-2 gap-2 text-xs text-white/60">
              {['📍 Local items only', '🔄 Easy swapping', '🔖 Bookmark items', '💚 Eco-friendly'].map(f => (
                <span key={f} className="flex items-center gap-1">{f}</span>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base"
            >
              {loading ? '⏳ Creating account...' : '🚀 Create Account'}
            </button>
          </form>

          <p className="text-center text-white/50 text-sm mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold">
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
