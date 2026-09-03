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
  
  // New Filters
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [distanceFilter, setDistanceFilter] = useState('any'); // '1', '5', '10', '25', '50', 'any'
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('');

  // Actions state
  const [requestingId, setRequestingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  
  // Delete modal state
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get current user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = !!user.id;

  // Fetch all items on mount and when filters change
  useEffect(() => {
    fetchItems();
  }, [categoryFilter, distanceFilter, userLocation]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      let url = '/items?';
      if (categoryFilter !== 'All') url += `category=${categoryFilter}&`;
      if (userLocation && userLocation.latitude) {
        url += `lat=${userLocation.latitude}&lng=${userLocation.longitude}&`;
        if (distanceFilter !== 'any') {
           url += `radius=${distanceFilter}&`;
        }
      }
      const res = await api.get(url);
      setItems(res.data);
    } catch (err) {
      setError('Something went wrong while loading the marketplace.');
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation not supported');
      return;
    }
    setLocationStatus('Locating...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setLocationStatus('📍 Location Set');
      },
      () => {
        setLocationStatus('Unable to get location');
      }
    );
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
    <div className="glass-container" style={{ backgroundImage: 'url(/images/bg_explore.jpg)', minHeight: 'calc(100vh - 72px)', display: 'flex', flexDirection: 'column' }}>
      
      {successMsg && (
        <div className="mb-4 p-3 glass-content" style={{ backgroundColor: 'var(--color-success)', color: 'white', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.2)', margin: '20px' }}>
          {successMsg}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 glass-content" style={{ backgroundColor: 'var(--color-danger)', color: 'white', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.2)', margin: '20px' }}>
          {error}
        </div>
      )}

      <div className="container glass-content" style={{ flex: 1, padding: '40px 20px' }}>
        {/* MARKETPLACE SECTION */}
        <div id="marketplace">
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <h2>Neighborhood Marketplace</h2>
              
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ width: '200px' }}>
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
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="All">All Categories</option>
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

            {/* Distance Filter Bar */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 600 }}>Distance:</span>
              <select 
                className="form-control" 
                style={{ width: 'auto', padding: '6px 12px' }}
                value={distanceFilter}
                onChange={(e) => setDistanceFilter(e.target.value)}
                disabled={!userLocation}
              >
                <option value="any">Any distance</option>
                <option value="1">Within 1 km</option>
                <option value="5">Within 5 km</option>
                <option value="10">Within 10 km</option>
                <option value="25">Within 25 km</option>
                <option value="50">Within 50 km</option>
              </select>
              {!userLocation ? (
                <Button variant="secondary" size="sm" onClick={handleGetLocation}>
                  📍 Set my location to filter
                </Button>
              ) : (
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                  {locationStatus}
                </span>
              )}
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {[1, 2, 3, 4, 5, 6].map(n => <SkeletonCard key={n} />)}
            </div>
          ) : displayedItems.length === 0 ? (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
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
