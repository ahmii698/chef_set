import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './App.css';

// Common Components
import Header from './common/header';
import Footer from './common/footer';
import ScrollToTop from './components/ScrollToTop';

// Page Components
import Home from './components/home';
import Products from './components/products';
import ProductDetail from './components/productDetail';
import About from './components/about';
import Contact from './components/contact';
import FAQ from './components/faq/faq';
import Cart from './components/cart/cart';
import Wishlist from './components/wishlist/wishlist';
import Profile from './components/profile/profile';
import CheckoutPage from './components/checkout/CheckoutPage';
import TrackOrder from './components/checkout/trackorder';
import Login from './components/login/login';
import CreateAccount from './components/login/create_account';
import ForgotPassword from './components/login/forgotpass';

// Admin Pages
import AdminLogin from './admin/pages/login';
import AdminForgotPassword from './admin/pages/forgot';
import AdminCreateAccount from './admin/pages/create_account';
import AdminDashboard from './admin/pages/dashboard';
import AdminProducts from './admin/pages/Products';
import AdminOrders from './admin/pages/Orders';
import AdminCustomers from './admin/pages/Customers';
import AdminCategories from './admin/pages/category';
import AdminTestimonials from './admin/pages/Testimonials';
import AdminFAQ from './admin/pages/Faq';
import AdminAboutUs from './admin/pages/About_us';
import ProtectedRoute from './admin/components/ProtectedRoute';

// Routes jinke liye Header/Footer NAHI chahiye (standalone pages)
const NO_LAYOUT_ROUTES = ['/login', '/create-account', '/forgot-password'];

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const hideLayout = NO_LAYOUT_ROUTES.includes(location.pathname) || isAdminRoute;

  return (
    <div className="app">
      {!hideLayout && <Header />}
      <main className="main-content">
        <Routes>
          {/* ---------- Public / Store Routes ---------- */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/trackorder" element={<TrackOrder />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* ---------- Admin Routes ---------- */}
          {/* /admin aur /admin/login dono se login page hi khulega */}
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
          <Route path="/admin/create-account" element={<AdminCreateAccount />} />

          {/* Login ke baad yeh saare routes accessible hongay (protected) */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute>
                <AdminProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute>
                <AdminOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/customers"
            element={
              <ProtectedRoute>
                <AdminCustomers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute>
                <AdminCategories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/testimonials"
            element={
              <ProtectedRoute>
                <AdminTestimonials />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/faq"
            element={
              <ProtectedRoute>
                <AdminFAQ />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/about-us"
            element={
              <ProtectedRoute>
                <AdminAboutUs />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;