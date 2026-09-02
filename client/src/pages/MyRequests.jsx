import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { SkeletonText } from '../components/Skeleton';
import { getItemImage } from '../utils/imageHelpers';

function MyRequests() {
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('received'); // 'received' | 'sent'
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/swap/my');
      setSent(res.data.sent);
      setReceived(res.data.received);
    } catch (err) {
      setError('Something went wrong while loading your requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (requestId, status) => {
    setProcessingId(requestId);
    try {
      await api.put(`/swap/${requestId}`, { status });
      setReceived(received.map((req) =>
        req._id === requestId ? { ...req, status } : req
      ));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update request status.');
    } finally {
      setProcessingId(null);
    }
  };

  const RequestCard = ({ req, isReceived }) => {
    const item = req.itemId || {};
    const otherUser = isReceived ? req.fromUser : req.toUser;
    
    return (
      <div className="card mb-4" style={{ display: 'flex', flexDirection: 'row', gap: '20px', padding: '20px' }}>
        <img 
          src={getItemImage(item)} 
          alt={item.title || 'Deleted item'} 
          style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
        />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '4px', color: 'var(--color-primary)' }}>
                {item.title || 'Deleted item'}
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>
                {isReceived ? 'Requested by ' : 'Requested from '}
                <strong>{otherUser?.name || 'Unknown'}</strong> ({otherUser?.email})
              </p>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                {new Date(req.createdAt).toLocaleDateString(undefined, { 
                  year: 'numeric', month: 'short', day: 'numeric' 
                })}
              </p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
              <StatusBadge status={req.status} />
              
              {isReceived && req.status === 'pending' && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleUpdateStatus(req._id, 'rejected')}
                    disabled={processingId === req._id}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleUpdateStatus(req._id, 'accepted')}
                    disabled={processingId === req._id}
                  >
                    {processingId === req._id ? 'Processing...' : 'Accept'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="page-wrapper container">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ color: 'var(--color-primary)' }}>Swap Requests</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Manage your community exchanges.</p>
      </div>

      {error && (
        <div className="mb-4 p-3" style={{ backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)', borderRadius: 'var(--radius-sm)', border: '1px solid #f5c2be' }}>
          {error}
        </div>
      )}

      {/* TABS */}
      <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--color-border)', marginBottom: '24px' }}>
        <button 
          onClick={() => setActiveTab('received')}
          style={{ 
            background: 'none', border: 'none', padding: '12px 16px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
            borderBottom: activeTab === 'received' ? '3px solid var(--color-primary)' : '3px solid transparent',
            color: activeTab === 'received' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            transition: 'all var(--transition-fast)'
          }}
        >
          Received ({received.length})
        </button>
        <button 
          onClick={() => setActiveTab('sent')}
          style={{ 
            background: 'none', border: 'none', padding: '12px 16px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
            borderBottom: activeTab === 'sent' ? '3px solid var(--color-primary)' : '3px solid transparent',
            color: activeTab === 'sent' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            transition: 'all var(--transition-fast)'
          }}
        >
          Sent ({sent.length})
        </button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div style={{ padding: '20px', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}>
          <SkeletonText height="24px" width="60%" />
          <SkeletonText height="16px" width="40%" />
        </div>
      ) : activeTab === 'received' ? (
        <div>
          {received.length === 0 ? (
            <div className="empty-state">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>You're all caught up.</h3>
              <p>When someone requests your items, they'll appear here.</p>
            </div>
          ) : (
            received.map((req) => (
              <RequestCard key={req._id} req={req} isReceived={true} />
            ))
          )}
        </div>
      ) : (
        <div>
          {sent.length === 0 ? (
            <div className="empty-state">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>You haven't requested a swap yet.</h3>
              <p>Browse items in the marketplace and request what you need.</p>
            </div>
          ) : (
            sent.map((req) => (
              <RequestCard key={req._id} req={req} isReceived={false} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default MyRequests;
