import React, { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { 
  FaHome, FaUtensils, FaShoppingBag, FaChartBar, 
  FaUsers, FaCog, FaSignOutAlt 
} from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import OrderBoard from '../components/admin/OrderBoard'
import MenuManagement from '../components/admin/MenuManagement'
import SalesAnalytics from '../components/admin/SalesAnalytics'
import Dashboard from '../components/admin/Dashboard'

const AdminDashboard = () => {
  const { logout } = useAuth()
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    pendingOrders: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    const { data: orders } = await supabase.from('orders').select('*')
    if (orders) {
      const total = orders.length
      const revenue = orders.reduce((sum, o) => sum + o.total_amount, 0)
      const pending = orders.filter(o => o.status === 'pending').length
      setStats({
        totalOrders: total,
        totalRevenue: revenue,
        totalCustomers: 0,
        pendingOrders: pending
      })
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-secondary text-white p-6">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <nav className="space-y-2">
          <Link to="/admin" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors">
            <FaHome /> Dashboard
          </Link>
          <Link to="/admin/orders" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors">
            <FaShoppingBag /> Orders
          </Link>
          <Link to="/admin/menu" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors">
            <FaUtensils /> Menu
          </Link>
          <Link to="/admin/analytics" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors">
            <FaChartBar /> Analytics
          </Link>
          <Link to="/admin/customers" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors">
            <FaUsers /> Customers
          </Link>
          <Link to="/admin/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors">
            <FaCog /> Settings
          </Link>
          <button 
            onClick={logout}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-500/20 transition-colors w-full text-left mt-8"
          >
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <Routes>
          <Route path="/" element={<Dashboard stats={stats} />} />
          <Route path="/orders" element={<OrderBoard />} />
          <Route path="/menu" element={<MenuManagement />} />
          <Route path="/analytics" element={<SalesAnalytics />} />
        </Routes>
      </div>
    </div>
  )
}

export default AdminDashboard