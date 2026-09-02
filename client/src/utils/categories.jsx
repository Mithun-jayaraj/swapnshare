export const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Books',
  'Furniture',
  'Sports',
  'Toys',
  'Kitchen',
  'Music',
  'Garden',
  'Other',
];

export const CATEGORY_STYLES = {
  Electronics: { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30', emoji: '💻' },
  Clothing:    { bg: 'bg-pink-500/20', text: 'text-pink-300', border: 'border-pink-500/30', emoji: '👕' },
  Books:       { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/30', emoji: '📚' },
  Furniture:   { bg: 'bg-orange-500/20', text: 'text-orange-300', border: 'border-orange-500/30', emoji: '🪑' },
  Sports:      { bg: 'bg-green-500/20', text: 'text-green-300', border: 'border-green-500/30', emoji: '⚽' },
  Toys:        { bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-500/30', emoji: '🧸' },
  Kitchen:     { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500/30', emoji: '🍳' },
  Music:       { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/30', emoji: '🎸' },
  Garden:      { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/30', emoji: '🌱' },
  Other:       { bg: 'bg-gray-500/20', text: 'text-gray-300', border: 'border-gray-500/30', emoji: '📦' },
};

export function getCategoryStyle(category) {
  return CATEGORY_STYLES[category] || CATEGORY_STYLES.Other;
}

export function StatusBadge({ status }) {
  const styles = {
    pending:  { class: 'status-pending', label: '⏳ Pending' },
    accepted: { class: 'status-accepted', label: '✅ Accepted' },
    rejected: { class: 'status-rejected', label: '❌ Rejected' },
  };
  const s = styles[status] || styles.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${s.class}`}>
      {s.label}
    </span>
  );
}
