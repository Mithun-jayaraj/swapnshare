import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCategoryStyle } from '../utils/categories.jsx';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function ItemCard({ item, onSwapRequest, onDelete, showDelete = false }) {
  const { user } = useAuth();
  const [bookmarked, setBookmarked] = useState(
    user?.savedItems?.some((s) => (s._id || s) === item._id) || false
  );
  const [swapping, setSwapping] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');

  const catStyle = getCategoryStyle(item.category);
  const isOwner = user?._id === (item.owner?._id || item.owner);

  const handleBookmark = async () => {
    try {
      setBookmarking(true);
      const { data } = await api.post(`/bookmark/${item._id}`);
      setBookmarked(data.bookmarked);
      toast.success(data.bookmarked ? '🔖 Bookmarked!' : 'Removed from bookmarks');
    } catch {
      toast.error('Failed to update bookmark');
    } finally {
      setBookmarking(false);
    }
  };

  const handleSendRequest = async () => {
    try {
      setSwapping(true);
      await api.post('/swap', { itemId: item._id, message });
      toast.success('🔄 Swap request sent!');
      setShowModal(false);
      setMessage('');
      if (onSwapRequest) onSwapRequest();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request');
    } finally {
      setSwapping(false);
    }
  };

  return (
    <>
      <div className="card flex flex-col overflow-hidden group">
        {/* Image */}
        <div className="relative overflow-hidden h-48 bg-gradient-to-br from-purple-900/50 to-blue-900/50">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">
              {catStyle.emoji}
            </div>
          )}

          {/* Distance badge */}
          {item.distance !== undefined && item.distance !== null && (
            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-full border border-white/20">
              📍 {item.distance === 0 ? 'You' : `${item.distance}km`}
            </div>
          )}

          {/* Bookmark button */}
          {!isOwner && (
            <button
              onClick={handleBookmark}
              disabled={bookmarking}
              className={`absolute top-2 right-2 w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-all ${
                bookmarked
                  ? 'bg-purple-500 text-white'
                  : 'bg-black/60 text-white/70 hover:bg-purple-500/60'
              }`}
            >
              {bookmarked ? '🔖' : '🤍'}
            </button>
          )}

          {/* Unavailable overlay */}
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="bg-rose-500/80 text-white text-sm font-bold px-3 py-1 rounded-full">
                Already Swapped
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1 gap-2">
          {/* Category badge */}
          <span
            className={`self-start inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
          >
            {catStyle.emoji} {item.category}
          </span>

          <h3 className="font-display text-base font-bold text-white leading-tight line-clamp-2">
            {item.title}
          </h3>
          <p className="text-white/50 text-sm line-clamp-2 flex-1">{item.description}</p>

          {/* Owner */}
          <div className="flex items-center gap-2 pt-1">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-xs font-bold">
              {item.owner?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <span className="text-xs text-white/50 truncate">
              {isOwner ? 'You' : item.owner?.name || 'Unknown'}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-1">
            {isOwner && showDelete ? (
              <button
                onClick={() => onDelete && onDelete(item._id)}
                className="btn-danger text-sm py-1.5 flex-1"
              >
                🗑 Delete
              </button>
            ) : !isOwner && item.isAvailable ? (
              <button
                onClick={() => setShowModal(true)}
                className="btn-primary text-sm py-2 flex-1"
              >
                🔄 Request Swap
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Swap Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass rounded-2xl p-6 w-full max-w-md shadow-2xl border border-white/20">
            <h3 className="font-display text-xl font-bold text-white mb-2">
              Request Swap
            </h3>
            <p className="text-white/60 text-sm mb-4">
              Send a swap request for{' '}
              <span className="text-purple-300 font-semibold">"{item.title}"</span>
            </p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a friendly message... (optional)"
              rows={3}
              className="input-field resize-none text-sm mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleSendRequest}
                disabled={swapping}
                className="btn-primary flex-1"
              >
                {swapping ? '⏳ Sending...' : '🔄 Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
