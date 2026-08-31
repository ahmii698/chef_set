// src/utils/wishlist.js
// Wishlist ka data localStorage mein persist karta hai (jaise cart already
// hoti hai), taake Products page aur Wishlist page dono ka data sync rahe.

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
  if (list.some((i) => i.id === item.id)) return list;
  const updated = [...list, item];
  saveWishlist(updated);
  return updated;
}

export function removeFromWishlist(id) {
  const updated = getWishlist().filter((item) => item.id !== id);
  saveWishlist(updated);
  return updated;
}