import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ItemCard from '../components/ItemCard';
import { CATEGORIES } from '../utils/categories.jsx';

export default function Home() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      const { data } = await api.get('/items', { params });
      setItems(data);
    } catch {
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const clearFilters = () => {
    setSearch('');
    setSearchInput('');
    setCategory('');
  };

  const hasLocation = user?.latitude && user?.longitude;

  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <div className="relative bg-gradient-to-b from-purple-900/40 to-transparent pb-8">
        <div className="page-container pt-4">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
              Find Items <span className="gradient-text">Near You</span>
            </h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              {hasLocation
                ? `📍 Showing items within 10km of your location`
                : '📍 Enable location for nearby items'}
            </p>
          </div>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="flex gap-3 max-w-2xl mx-auto mb-6"
          >
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                🔍
              </span>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for items..."
                className="input-field pl-10"
              />
            </div>
            <button type="submit" className="btn-primary px-6">
              Search
            </button>
          </form>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 justify-center max-w-3xl mx-auto">
            <button
              onClick={() => setCategory('')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                category === ''
                  ? 'bg-purple-500 text-white border-purple-500'
                  : 'bg-white/5 text-white/60 border-white/20 hover:bg-white/10'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat === category ? '' : cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                  category === cat
                    ? 'bg-purple-500 text-white border-purple-500'
                    : 'bg-white/5 text-white/60 border-white/20 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Active filters */}
          {(search || category) && (
            <div className="flex items-center gap-2 justify-center mt-3">
              <span className="text-white/50 text-sm">Filters:</span>
              {search && (
                <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-semibold">
                  "{search}"
                </span>
              )}
              {category && (
                <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-semibold">
                  {category}
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-white/40 hover:text-white text-xs underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Items grid */}
      <div className="page-container">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card overflow-hidden">
                <div className="skeleton h-48 w-full" />
                <div className="p-4 space-y-3">
                  <div className="skeleton h-4 rounded-full w-20" />
                  <div className="skeleton h-5 rounded-full w-3/4" />
                  <div className="skeleton h-4 rounded-full w-full" />
                  <div className="skeleton h-10 rounded-xl w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 animate-float inline-block">🔍</div>
            <h2 className="font-display text-2xl font-bold text-white mb-2">
              No items found
            </h2>
            <p className="text-white/50">
              {search || category
                ? 'Try clearing your filters'
                : hasLocation
                ? 'No items within 10km yet — be the first to add one!'
                : 'Enable location or add some items to get started'}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-white/60 text-sm font-semibold">
                {items.length} item{items.length !== 1 ? 's' : ''} found
              </p>
              {hasLocation && (
                <span className="text-xs text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full">
                  📍 Within 10km
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {items.map((item) => (
                <ItemCard
                  key={item._id}
                  item={item}
                  onSwapRequest={fetchItems}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
