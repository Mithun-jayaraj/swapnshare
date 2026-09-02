// Image helper for frontend mapping

export const getItemImage = (item) => {
  if (!item || !item.title) return '/images/default_item.jpg';

  const lowerTitle = item.title.toLowerCase();
  const lowerDesc = item.description ? item.description.toLowerCase() : '';

  // Simple keyword matching for images
  if (lowerTitle.includes('vegetable') || lowerTitle.includes('spinach') || lowerDesc.includes('vegetable') || lowerTitle.includes('tomato')) {
    return '/images/vegetables.jpg';
  }
  
  if (lowerTitle.includes('fruit') || lowerTitle.includes('apple') || lowerTitle.includes('orange') || lowerTitle.includes('banana') || lowerDesc.includes('fruit')) {
    return '/images/fruits.jpg';
  }
  
  if (lowerTitle.includes('book') || lowerTitle.includes('plant') || lowerTitle.includes('kitchen') || lowerTitle.includes('household') || lowerDesc.includes('book')) {
    return '/images/household.jpg';
  }

  // Fallback generic marketplace image
  return '/images/default_item.jpg';
};
