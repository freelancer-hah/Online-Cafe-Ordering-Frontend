import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { 
  FaShoppingCart, 
  FaUser, 
  FaUtensils, 
  FaHome,
  FaSignOutAlt,
  FaUserCircle,
  FaChevronDown
} from 'react-icons/fa';

const Navbar = () => {
  const { totalItems } = useCart();
  const { user, isAuthenticated, isAdmin, isKitchen, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setShowDropdown(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
            🍽️ FoodHub
          </Link>
          
          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <FaHome className="text-lg" />
              <span className="hidden md:inline">Home</span>
            </Link>
            
            <Link to="/menu" className="hover:text-primary transition-colors flex items-center gap-1">
              <FaUtensils className="text-lg" />
              <span className="hidden md:inline">Menu</span>
            </Link>
            
            <Link to="/cart" className="relative hover:text-primary transition-colors flex items-center gap-1">
              <FaShoppingCart className="text-lg" />
              <span className="hidden md:inline">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce-slow">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <FaUserCircle className="text-2xl" />
                  <span className="hidden md:inline text-sm font-medium">
                    {user?.email?.split('@')[0]}
                  </span>
                  <FaChevronDown className={`text-xs transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 border border-gray-100">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-secondary">{user?.email}</p>
                      <p className="text-xs text-gray-500 capitalize">{isAdmin ? 'Admin' : isKitchen ? 'Kitchen Staff' : 'Customer'}</p>
                    </div>
                    
                    {isAdmin && (
                      <Link 
                        to="/admin" 
                        className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    
                    {isKitchen && (
                      <Link 
                        to="/kitchen" 
                        className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        Kitchen Display
                      </Link>
                    )}
                    
                    <Link 
                      to="/orders" 
                      className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      My Orders
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-red-500 flex items-center gap-2 border-t border-gray-100 mt-2 pt-2"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login" 
                className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
              >
                <FaUser /> Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;