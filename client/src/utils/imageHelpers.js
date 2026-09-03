// Image helper for frontend mapping

export const getItemImage = (item) => {
  if (!item) return '/images/category_other.jpg';

  // If user provided an image URL, use it
  if (item.imageUrl && item.imageUrl.trim() !== '') {
    return item.imageUrl;
  }

  // Fallback to category specific images or keywords
  const category = item.category || 'Other';
  const lowerTitle = (item.title || '').toLowerCase();
  
  if (lowerTitle.includes('fridge') || lowerTitle.includes('refrigerator') || lowerTitle.includes('appliance')) {
    return '/images/category_appliances.jpg';
  }

  switch (category) {
    case 'Groceries':
    case 'Food':
      return '/images/category_groceries.jpg';
    case 'Furniture':
      return '/images/category_furniture.jpg';
    case 'Electronics':
      return '/images/category_electronics.jpg';
    case 'Household':
    case 'Kitchen':
      return '/images/category_appliances.jpg';
    default:
      return '/images/category_other.jpg';
  }
};
