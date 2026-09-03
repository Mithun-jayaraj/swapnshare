import React from 'react';
import { getItemImage } from '../utils/imageHelpers';
import Button from './Button';

const ItemCard = ({ item, currentUserId, onSwapRequest, onDelete }) => {
  const isOwner = currentUserId && item.owner._id === currentUserId;
  const imageSrc = getItemImage(item);
  const timeAgo = new Date(item.createdAt).toLocaleDateString(undefined, { 
    month: 'short', 
    day: 'numeric' 
  });
  const ownerLocation = item.owner.location?.city || item.location?.city || '';

  return (
    <div className="glass-card item-card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
      <img 
        src={imageSrc} 
        alt={item.title} 
        className="item-card-image"
        loading="lazy"
      />
      <div className="item-card-content" style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <h3 className="item-card-title" style={{ marginBottom: 0, color: 'white' }}>{item.title}</h3>
          {item.category && (
            <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}>{item.category}</span>
          )}
        </div>
        <p className="item-card-desc" style={{ color: 'rgba(255,255,255,0.85)', flex: 1 }}>{item.description}</p>
        
        <div className="item-card-meta" style={{ borderTop: '1px solid rgba(255,255,255,0.2)', marginTop: '16px', paddingTop: '16px' }}>
          <div className="item-owner" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="avatar" style={{ backgroundColor: 'rgba(255,255,255,0.3)', color: 'white' }}>
                {item.owner.name.charAt(0).toUpperCase()}
              </div>
              <span style={{ color: 'rgba(255,255,255,0.9)' }}>{item.owner.name} • {timeAgo}</span>
            </div>
            
            {(item.distance !== undefined || ownerLocation) && (
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                📍 {ownerLocation ? ownerLocation : ''} {item.distance !== undefined && ownerLocation ? '•' : ''} {item.distance !== undefined ? `${item.distance.toFixed(1)} km away` : ''}
              </div>
            )}
          </div>
          
          {isOwner ? (
            <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>Your Item</span>
          ) : (
            currentUserId && (
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => onSwapRequest(item._id)}
                style={{ backgroundColor: 'var(--color-secondary)', border: 'none' }}
              >
                Request
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
