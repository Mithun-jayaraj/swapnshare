import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ItemCard from '../components/ItemCard';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import { SkeletonCard } from '../components/Skeleton';

function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest'

  // Actions state
  const [requestingId, setRequestingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  
  // Delete modal state
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get current user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = !!user.id;

  // Fetch all items on mount
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await api.get('/items');
      setItems(res.data);
    } catch (err) {
      setError('Something went wrong while loading the marketplace.');
    } finally {
      setLoading(false);
    }
  };

  // Filter and Sort items
  const displayedItems = useMemo(() => {
    let result = [...items];

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(lowerQuery) || 
        item.description.toLowerCase().includes(lowerQuery)
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [items, searchQuery, sortOrder]);

  const handleRequestSwap = async (itemId) => {
    if (!isLoggedIn) {
      setError('Please log in to request a swap.');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    setRequestingId(itemId);
    setSuccessMsg('');
    setError('');

    try {
      await api.post('/swap', { itemId });
      setSuccessMsg('Swap request sent successfully! 🎉');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send swap request.');
      setTimeout(() => setError(''), 4000);
    } finally {
      setRequestingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await api.delete(`/items/${itemToDelete}`);
      setItems(items.filter((item) => item._id !== itemToDelete));
      setItemToDelete(null);
      setSuccessMsg('Item deleted successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete item.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        
        {/* HERO SECTION */}
        <div className="hero">
          <div className="hero-content">
            <h1 className="hero-title">Share more. Waste less. Build your neighborhood.</h1>
            <p className="hero-subtitle">
              Give useful food and household items a second life by sharing them with people in your community.
            </p>
            <div className="hero-actions">
              <Button variant="primary" onClick={() => document.getElementById('marketplace').scrollIntoView({ behavior: 'smooth' })}>
                Browse Items
              </Button>
              <Link to="/add">
                <Button variant="secondary">Share an Item</Button>
              </Link>
            </div>
          </div>
          <img 
            src="/images/hero_community.jpg" 
            alt="Community sharing food" 
            className="hero-image" 
          />
        </div>

        {/* NOTIFICATIONS */}
        {successMsg && (
          <div className="mb-4 p-3" style={{ backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', borderRadius: 'var(--radius-sm)', border: '1px solid #b7e4c7' }}>
            {successMsg}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3" style={{ backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)', borderRadius: 'var(--radius-sm)', border: '1px solid #f5c2be' }}>
            {error}
          </div>
        )}

        {/* MARKETPLACE SECTION */}
        <div id="marketplace" style={{ paddingTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <h2>Neighborhood Marketplace</h2>
            
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ width: '250px' }}>
                <Input 
                  type="text" 
                  placeholder="Search items..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ padding: '8px 12px', margin: 0 }}
                />
              </div>
              <select 
                className="form-control" 
                style={{ width: 'auto', padding: '8px 12px' }}
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {[1, 2, 3, 4, 5, 6].map(n => <SkeletonCard key={n} />)}
            </div>
          ) : displayedItems.length === 0 ? (
            <div className="empty-state">
              <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Nothing shared yet</h3>
              <p>Be the first neighbor to share something useful.</p>
              <Link to="/add">
                <Button variant="primary">Share an Item</Button>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {displayedItems.map((item) => (
                <ItemCard 
                  key={item._id} 
                  item={item} 
                  currentUserId={user.id}
                  onSwapRequest={handleRequestSwap}
                  onDelete={() => setItemToDelete(item._id)}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!itemToDelete}
        onClose={() => !isDeleting && setItemToDelete(null)}
        title="Delete this listing?"
        type="danger"
        footer={
          <>
            <Button variant="secondary" onClick={() => setItemToDelete(null)} disabled={isDeleting}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete listing'}
            </Button>
          </>
        }
      >
        <p>This action cannot be undone. Are you sure you want to remove this item from the marketplace?</p>
      </Modal>

    </div>
  );
}

export default Home;
