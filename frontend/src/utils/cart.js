// src/utils/cart.js
// Cart ka data localStorage mein persist karta hai — Header aur Cart page
// dono isi "cart" key ko use karte hain, isliye har jagah sync rehta hai.

const STORAGE_KEY = "cart";

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
}

export function addToCart(item, qty = 1) {
  const cart = getCart();
  const existing = cart.find((c) => c.id === item.id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ ...item, qty });
  }
  saveCart(cart);
  return cart;
}

export function updateCartQty(id, qty) {
  const cart = getCart();
  const updated = cart.map((item) =>
    item.id === id ? { ...item, qty: Math.max(1, qty) } : item
  );
  saveCart(updated);
  return updated;
}

export function removeFromCart(id) {
  const cart = getCart();
  const updated = cart.filter((item) => item.id !== id);
  saveCart(updated);
  return updated;
}