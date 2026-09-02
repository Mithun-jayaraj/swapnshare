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

  return (
    <div className="card item-card card-hover">
      <img 
        src={imageSrc} 
        alt={item.title} 
        className="item-card-image"
        loading="lazy"
      />
      <div className="item-card-content">
        <h3 className="item-card-title">{item.title}</h3>
        <p className="item-card-desc">{item.description}</p>
        
        <div className="item-card-meta">
          <div className="item-owner">
            <div className="avatar">
              {item.owner.name.charAt(0).toUpperCase()}
            </div>
            <span>{item.owner.name} • {timeAgo}</span>
          </div>
          
          {isOwner ? (
            <span className="badge badge-neutral">Your Item</span>
          ) : (
            currentUserId && (
              <Button 
                variant="accent" 
                size="sm" 
                onClick={() => onSwapRequest(item._id)}
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
