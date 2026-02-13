import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { CATEGORIES, getCategoryStyle } from '../utils/categories.jsx';

export default function AddItem() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: '',
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category) {
      toast.error('Please select a category');
      return;
    }
    setLoading(true);
    try {
      await api.post('/items', form);
      toast.success('🎉 Item listed successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  const catStyle = form.category ? getCategoryStyle(form.category) : null;

  return (
    <div className="min-h-screen">
      <div className="page-container">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-4xl font-bold text-white">
              Add an Item
            </h1>
            <p className="text-white/60 mt-2">
              List something you're ready to swap with your neighbours
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Form */}
            <div className="glass rounded-2xl p-6 border border-white/10">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="label">Item Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. iPhone 12, Vintage Guitar..."
                    required
                    maxLength={100}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label">Category *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map((cat) => {
                      const s = getCategoryStyle(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setForm({ ...form, category: cat })}
                          className={`px-3 py-2 rounded-xl text-sm font-semibold border transition-all flex items-center gap-1.5 ${
                            form.category === cat
                              ? `${s.bg} ${s.text} ${s.border} scale-[1.02]`
                              : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          <span>{s.emoji}</span>
                          <span>{cat}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="label">Description *</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe the item's condition, age, what you'd like in return..."
                    required
                    rows={4}
                    maxLength={500}
                    className="input-field resize-none"
                  />
                  <span className="text-xs text-white/30 float-right mt-1">
                    {form.description.length}/500
                  </span>
                </div>

                <div>
                  <label className="label">Image URL (optional)</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={form.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="input-field"
                  />
                  {form.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setPreview(!preview)}
                      className="text-xs text-purple-400 hover:text-purple-300 mt-1 underline"
                    >
                      {preview ? 'Hide' : 'Preview'} image
                    </button>
                  )}
                  {preview && form.imageUrl && (
                    <img
                      src={form.imageUrl}
                      alt="Preview"
                      className="mt-2 rounded-xl w-full h-32 object-cover"
                      onError={() => toast.error('Image URL not valid')}
                    />
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 text-base"
                >
                  {loading ? '⏳ Listing...' : '✨ List Item'}
                </button>
              </form>
            </div>

            {/* Live Preview Card */}
            <div>
              <p className="text-white/50 text-sm font-semibold mb-3">Live Preview</p>
              <div className="card overflow-hidden opacity-90">
                <div className="h-40 bg-gradient-to-br from-purple-900/50 to-blue-900/50 flex items-center justify-center">
                  {form.imageUrl && preview ? (
                    <img
                      src={form.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <span className="text-5xl">
                      {catStyle ? catStyle.emoji : '📦'}
                    </span>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  {catStyle && (
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                    >
                      {catStyle.emoji} {form.category}
                    </span>
                  )}
                  <h3 className="font-display font-bold text-white text-sm">
                    {form.title || 'Your item title'}
                  </h3>
                  <p className="text-white/50 text-xs line-clamp-3">
                    {form.description || 'Your item description will appear here...'}
                  </p>
                </div>
              </div>

              {/* Tips */}
              <div className="glass rounded-xl p-4 mt-4 border border-white/10">
                <p className="text-white/70 text-sm font-semibold mb-2">💡 Tips for a great listing</p>
                <ul className="text-white/50 text-xs space-y-1">
                  <li>• Be specific about the item's condition</li>
                  <li>• Mention what you'd like in exchange</li>
                  <li>• Use a clear, real photo URL</li>
                  <li>• Items show up to users within 10km</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
