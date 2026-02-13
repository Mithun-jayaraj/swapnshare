import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { StatusBadge } from '../utils/categories.jsx';

function RequestCard({ req, type, onUpdate }) {
  const [loading, setLoading] = useState(false);

  const handleAction = async (status) => {
    try {
      setLoading(true);
      await api.put(`/swap/${req._id}`, { status });
      toast.success(status === 'accepted' ? '✅ Request accepted!' : '❌ Request rejected');
      onUpdate();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  const isReceived = type === 'received';
  const otherUser = isReceived ? req.fromUser : req.toUser;
  const item = req.itemId;

  return (
    <div className="card p-5 flex flex-col sm:flex-row gap-4">
      {/* Item image */}
      <div className="w-full sm:w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-purple-900/50 to-blue-900/50 flex-shrink-0 flex items-center justify-center">
        {item?.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <span className="text-2xl">📦</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-display font-bold text-white">
              {item?.title || 'Deleted Item'}
            </h3>
            <p className="text-white/50 text-xs mt-0.5">
              {item?.category && (
                <span className="mr-2">📦 {item.category}</span>
              )}
              {isReceived ? (
                <>
                  From:{' '}
                  <span className="text-purple-300 font-semibold">
                    {otherUser?.name || 'Unknown'}
                  </span>
                </>
              ) : (
                <>
                  To:{' '}
                  <span className="text-cyan-300 font-semibold">
                    {otherUser?.name || 'Unknown'}
                  </span>
                </>
              )}
            </p>
          </div>
          <StatusBadge status={req.status} />
        </div>

        {req.message && (
          <p className="text-white/60 text-sm bg-white/5 rounded-lg px-3 py-2 mb-3 italic">
            "{req.message}"
          </p>
        )}

        <div className="flex items-center justify-between flex-wrap gap-3">
          <span className="text-white/30 text-xs">
            {new Date(req.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric',
            })}
          </span>

          {/* Action buttons – only for received + pending */}
          {isReceived && req.status === 'pending' && (
            <div className="flex gap-2">
              <button
                onClick={() => handleAction('rejected')}
                disabled={loading}
                className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-sm font-semibold px-4 py-1.5 rounded-lg transition-all"
              >
                ❌ Reject
              </button>
              <button
                onClick={() => handleAction('accepted')}
                disabled={loading}
                className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-sm font-semibold px-4 py-1.5 rounded-lg transition-all"
              >
                ✅ Accept
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MyRequests() {
  const [data, setData] = useState({ sent: [], received: [] });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('received');

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data: res } = await api.get('/swap/my');
      setData(res);
    } catch {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const current = data[tab];
  const pendingReceived = data.received.filter((r) => r.status === 'pending').length;

  return (
    <div className="min-h-screen">
      <div className="page-container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-white">
            Swap Requests
          </h1>
          <p className="text-white/60 mt-1">Manage incoming and outgoing swap requests</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['received', 'sent'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                tab === t
                  ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
              }`}
            >
              {t === 'received' ? '📥' : '📤'}
              {t.charAt(0).toUpperCase() + t.slice(1)}
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  t === 'received' && pendingReceived > 0
                    ? 'bg-amber-500 text-white'
                    : 'bg-white/10'
                }`}
              >
                {t === 'received' ? data.received.length : data.sent.length}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-5 h-24 skeleton" />
            ))}
          </div>
        ) : current.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 animate-float inline-block">
              {tab === 'received' ? '📥' : '📤'}
            </div>
            <h2 className="font-display text-2xl font-bold text-white mb-2">
              No {tab} requests
            </h2>
            <p className="text-white/50">
              {tab === 'received'
                ? "When someone wants to swap with you, it'll appear here"
                : "Browse items and send swap requests to get started"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {current.map((req) => (
              <RequestCard
                key={req._id}
                req={req}
                type={tab}
                onUpdate={fetchRequests}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
