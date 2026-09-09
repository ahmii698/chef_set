// src/utils/wishlist.js
const STORAGE_KEY = "wishlist";

export function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveWishlist(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("wishlist-updated"));
}

export function isInWishlist(id) {
  return getWishlist().some((item) => item.id === id);
}

export function addToWishlist(item) {
  const list = getWishlist();
  // ✅ Check if already in wishlist
  if (list.some((i) => i.id === item.id)) {
    console.log('⚠️ Item already in wishlist:', item.name);
    return list;
  }
  const updated = [...list, item];
  saveWishlist(updated);
  return updated;
}

export function removeFromWishlist(id) {
  const updated = getWishlist().filter((item) => item.id !== id);
  saveWishlist(updated);
  return updated;
}

// ✅ Move item from wishlist to cart
export function moveToCart(id) {
  const list = getWishlist();
  const item = list.find((i) => i.id === id);
  if (!item) return null;
  
  // Remove from wishlist
  const updated = list.filter((i) => i.id !== id);
  saveWishlist(updated);
  
  return item;
}