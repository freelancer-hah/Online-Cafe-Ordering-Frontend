import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import AdminDashboard from './pages/AdminDashboard';
import KitchenDisplay from './pages/KitchenDisplay';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/common/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import Register from './pages/Register';  // 👈 Add this import

// In Routes, add:

function App() {
  const location = useLocation();
  const { isAuthenticated, isAdmin, isKitchen } = useAuth();
  
  // Check if current route is admin or kitchen
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isKitchenRoute = location.pathname.startsWith('/kitchen');
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Hide Navbar on admin, kitchen, and auth pages */}
      {!isAdminRoute && !isKitchenRoute && !isAuthRoute && <Navbar />}
      
      <main className={`flex-1 ${!isAdminRoute && !isKitchenRoute && !isAuthRoute ? 'container mx-auto px-4 py-8' : ''}`}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Customer Routes */}
            <Route path="/checkout" element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            } />
            <Route path="/track/:orderId" element={
              <ProtectedRoute>
                <OrderTrackingPage />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes - Only for Admin */}
            <Route path="/admin/*" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            {/* Kitchen Routes - Only for Kitchen Staff */}
            <Route path="/kitchen" element={
              <ProtectedRoute requiredRole="kitchen">
                <KitchenDisplay />
              </ProtectedRoute>
            } />
            
            {/* Fallback Route */}
            <Route path="*" element={
              <div className="text-center py-20">
                <h2 className="text-4xl font-bold text-gray-600 mb-4">404</h2>
                <p className="text-gray-500 mb-8">Page not found</p>
                <a href="/" className="btn-primary inline-block">Go Home</a>
              </div>
            } />
          </Routes>
        </AnimatePresence>
      </main>
      
      {/* Hide Footer on admin, kitchen, and auth pages */}
      {!isAdminRoute && !isKitchenRoute && !isAuthRoute && <Footer />}
    </div>
  );
}

export default App;