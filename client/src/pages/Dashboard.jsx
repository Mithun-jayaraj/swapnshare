import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ItemCard from '../components/ItemCard';

export default function Dashboard() {
  const { user } = useAuth();
  const [myItems, setMyItems] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [swapData, setSwapData] = useState({ sent: [], received: [] });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('items');

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [itemsRes, bookmarksRes, swapRes] = await Promise.all([
        api.get('/items/mine'),
        api.get('/bookmarks'),
        api.get('/swap/my'),
      ]);
      setMyItems(itemsRes.data);
      setBookmarks(bookmarksRes.data);
      setSwapData(swapRes.data);
    } catch {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    try {
      await api.delete(`/items/${id}`);
      toast.success('Item deleted');
      setMyItems((prev) => prev.filter((i) => i._id !== id));
    } catch {
      toast.error('Failed to delete');
    }
  };

  // Stats
  const pendingReceived = swapData.received.filter((r) => r.status === 'pending').length;
  const acceptedCount = swapData.sent.filter((r) => r.status === 'accepted').length;

  const stats = [
    { label: 'My Listings', value: myItems.length, icon: '📦', color: 'from-purple-500 to-violet-600' },
    { label: 'Bookmarked', value: bookmarks.length, icon: '🔖', color: 'from-pink-500 to-rose-600' },
    { label: 'Pending Requests', value: pendingReceived, icon: '⏳', color: 'from-amber-500 to-orange-600' },
    { label: 'Successful Swaps', value: acceptedCount, icon: '✅', color: 'from-emerald-500 to-green-600' },
  ];

  const tabs = [
    { key: 'items', label: '📦 My Items', count: myItems.length },
    { key: 'bookmarks', label: '🔖 Bookmarks', count: bookmarks.length },
  ];

  return (
    <div className="min-h-screen">
      <div className="page-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-4xl font-bold text-white">
              Dashboard
            </h1>
            <p className="text-white/60 mt-1">
              Hello, <span className="text-purple-300 font-semibold">{user?.name}</span>! 👋
            </p>
          </div>
          <Link to="/add" className="btn-primary self-start sm:self-auto">
            ➕ Add New Item
          </Link>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="card p-5">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-xl mb-3 shadow-lg`}
              >
                {stat.icon}
              </div>
              <div className="font-display text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-white/50 text-xs mt-1 font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                tab === t.key
                  ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
              }`}
            >
              {t.label}
              <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{t.count}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card h-64 skeleton" />
            ))}
          </div>
        ) : tab === 'items' ? (
          myItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4 animate-float inline-block">📦</div>
              <h2 className="font-display text-2xl font-bold text-white mb-2">
                No items listed yet
              </h2>
              <p className="text-white/50 mb-6">Start by listing something you want to swap</p>
              <Link to="/add" className="btn-primary">
                ➕ Add Your First Item
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {myItems.map((item) => (
                <ItemCard
                  key={item._id}
                  item={item}
                  showDelete
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 animate-float inline-block">🔖</div>
            <h2 className="font-display text-2xl font-bold text-white mb-2">
              No bookmarks yet
            </h2>
            <p className="text-white/50 mb-6">Save items you're interested in</p>
            <Link to="/" className="btn-primary">
              🏠 Browse Items
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {bookmarks.map((item) => (
              <ItemCard key={item._id} item={item} onSwapRequest={fetchAll} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
