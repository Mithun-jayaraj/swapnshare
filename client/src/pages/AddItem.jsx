import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Input from '../components/Input';
import Button from '../components/Button';

function AddItem() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '',
    category: 'Other',
    imageUrl: ''
  });
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser');
      return;
    }
    setLocationStatus('Locating...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          city: 'Current Location'
        });
        setLocationStatus('Location found! 📍');
      },
      () => {
        setLocationStatus('Unable to retrieve your location');
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Both title and description are required.');
      return;
    }

    setLoading(true);

    try {
      const payload = { ...formData };
      if (location) {
        payload.location = location;
      }
      await api.post('/items', payload);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const remainingChars = 300 - formData.description.length;

  return (
    <div className="glass-container" style={{ backgroundImage: 'url(/images/bg_add.jpg)', minHeight: 'calc(100vh - 72px)' }}>
      <div className="container glass-content" style={{ display: 'flex', justifyContent: 'center', padding: '40px 20px' }}>
        <div className="glass-card" style={{ maxWidth: '600px', width: '100%', padding: '40px' }}>
          
          <div className="text-center mb-8">
            <h1 style={{ fontSize: '1.75rem', marginBottom: '8px', color: 'white' }}>
              Share something with your neighborhood
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>
              Give useful items a second life by sharing them with someone nearby.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3" style={{ backgroundColor: 'var(--color-danger)', color: 'white', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.2)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" style={{ color: 'white' }}>Item Title</label>
              <input
                className="form-control"
                type="text"
                name="title"
                placeholder="e.g. Fresh organic spinach, extra bread loaf..."
                value={formData.title}
                onChange={handleChange}
                required
                maxLength={60}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: 'white' }}>Category</label>
              <select
                className="form-control"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="Groceries">Groceries</option>
                <option value="Food">Food</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Books">Books</option>
                <option value="Clothing">Clothing</option>
                <option value="Plants">Plants</option>
                <option value="Sports">Sports</option>
                <option value="Household">Household</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: 'white' }}>Image URL (Optional)</label>
              <input
                className="form-control"
                type="text"
                name="imageUrl"
                placeholder="https://example.com/image.jpg"
                value={formData.imageUrl}
                onChange={handleChange}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '8px' }}>
              <label className="form-label" style={{ color: 'white' }}>Description</label>
              <textarea
                className="form-control"
                name="description"
                placeholder="Describe the item — quantity, condition, when it expires, why you're sharing it..."
                value={formData.description}
                onChange={handleChange}
                required
                maxLength={300}
                style={{ marginBottom: 0, minHeight: '100px' }}
              />
            </div>
            
            
            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: remainingChars < 20 ? 'var(--color-danger)' : 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>
              {remainingChars} characters remaining
            </div>

            <div className="form-group" style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <label className="form-label" style={{ color: 'white' }}>Location (Optional)</label>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', marginBottom: '12px' }}>
                Share your approximate location so neighbors nearby can find this item easily.
              </p>
              <Button type="button" variant="secondary" onClick={handleGetLocation} style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.4)' }}>
                📍 Get My Location
              </Button>
              {locationStatus && <span style={{ marginLeft: '12px', fontSize: '0.9rem', color: 'white', fontWeight: 600 }}>{locationStatus}</span>}
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/')}
                disabled={loading}
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: 'none' }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                style={{ backgroundColor: 'var(--color-secondary)', border: 'none' }}
              >
                {loading ? 'Publishing...' : 'Publish Listing'}
              </Button>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  );
}

export default AddItem;
