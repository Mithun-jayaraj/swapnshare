import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { getCurrentPosition } from '../utils/geo';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [refreshingLocation, setRefreshingLocation] = useState(false);

  const handleRefreshLocation = async () => {
    try {
      setRefreshingLocation(true);
      toast('📍 Getting your location...', { icon: '⏳' });
      const position = await getCurrentPosition();

      if (!position) {
        toast.error('Location permission denied. Please enable it in your browser.');
        return;
      }

      const { data } = await api.put('/me', position);
      updateUser({ latitude: data.latitude, longitude: data.longitude });
      toast.success('📍 Location updated!');
    } catch {
      toast.error('Failed to update location');
    } finally {
      setRefreshingLocation(false);
    }
  };

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??';

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', {
        month: 'long',
        year: 'numeric',
      })
    : 'Recently';

  return (
    <div className="min-h-screen">
      <div className="page-container">
        <div className="max-w-xl mx-auto">
          <h1 className="font-display text-4xl font-bold text-white mb-8">Profile</h1>

          {/* Profile Card */}
          <div className="glass rounded-2xl p-8 border border-white/10 mb-6">
            {/* Avatar */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-display text-3xl font-bold text-white shadow-2xl shadow-purple-500/30 mb-4">
                {initials}
              </div>
              <h2 className="font-display text-2xl font-bold text-white">{user?.name}</h2>
              <p className="text-white/50">{user?.email}</p>
              <p className="text-white/30 text-xs mt-1">Member since {memberSince}</p>
            </div>

            {/* Info rows */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-4 py-3 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-xl">👤</span>
                  <div>
                    <p className="text-xs text-white/40 font-semibold">Name</p>
                    <p className="text-white font-semibold">{user?.name}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-4 py-3 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📧</span>
                  <div>
                    <p className="text-xs text-white/40 font-semibold">Email</p>
                    <p className="text-white font-semibold">{user?.email}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-4 py-3 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📍</span>
                  <div>
                    <p className="text-xs text-white/40 font-semibold">Location</p>
                    <p className="text-white font-semibold">
                      {user?.latitude && user?.longitude
                        ? `${user.latitude.toFixed(4)}, ${user.longitude.toFixed(4)}`
                        : 'Not set'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRefreshLocation}
                  disabled={refreshingLocation}
                  className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                >
                  {refreshingLocation ? '⏳' : '🔄 Update'}
                </button>
              </div>

              <div className="flex items-center px-4 py-3 bg-white/5 rounded-xl border border-white/10 gap-3">
                <span className="text-xl">🔖</span>
                <div>
                  <p className="text-xs text-white/40 font-semibold">Bookmarked Items</p>
                  <p className="text-white font-semibold">
                    {user?.savedItems?.length || 0} items
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Location info box */}
          <div className="glass rounded-xl p-5 border border-white/10">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-lg flex-shrink-0">
                📍
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">How location works</h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  SwapnShare uses your browser's location to show you items within{' '}
                  <span className="text-cyan-300 font-semibold">10 kilometres</span>. Your exact
                  coordinates are never shown to other users. Update your location anytime if
                  you move or want fresher results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
