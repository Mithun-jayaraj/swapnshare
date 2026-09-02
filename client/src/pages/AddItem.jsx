import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Input from '../components/Input';
import Button from '../components/Button';

function AddItem() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      await api.post('/items', formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const remainingChars = 300 - formData.description.length;

  return (
    <div className="page-wrapper" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="card" style={{ maxWidth: '600px', width: '100%', padding: '40px' }}>
          
          <div className="text-center mb-8">
            <h1 style={{ fontSize: '1.75rem', marginBottom: '8px', color: 'var(--color-primary)' }}>
              Share something with your neighborhood
            </h1>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Give useful items a second life by sharing them with someone nearby.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3" style={{ backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)', borderRadius: 'var(--radius-sm)', border: '1px solid #f5c2be' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              label="Item Title"
              type="text"
              name="title"
              placeholder="e.g. Fresh organic spinach, extra bread loaf..."
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={60}
            />

            <div className="form-group" style={{ marginBottom: '8px' }}>
              <Input
                label="Description"
                type="textarea"
                name="description"
                placeholder="Describe the item — quantity, condition, when it expires, why you're sharing it..."
                value={formData.description}
                onChange={handleChange}
                required
                maxLength={300}
                style={{ marginBottom: 0 }}
              />
            </div>
            
            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: remainingChars < 20 ? 'var(--color-danger)' : 'var(--color-text-muted)', marginBottom: '24px' }}>
              {remainingChars} characters remaining
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--color-border)' }}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
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
