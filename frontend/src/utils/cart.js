// src/utils/cart.js
// Cart ka data localStorage mein persist karta hai — Cart page bhi
// isi "cart" key ko use karta hai, isliye yahan se add kiya hua item
// seedha cart page par bhi dikhega.

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