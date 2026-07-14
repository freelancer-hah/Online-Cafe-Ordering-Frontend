import React, { useState, useEffect } from 'react'
import { supabase } from '../../services/supabase'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { FaDownload } from 'react-icons/fa'
import toast from 'react-hot-toast'

const SalesAnalytics = () => {
  const [data, setData] = useState([])
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('week')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('payment_status', 'paid')
      
      if (orders) {
        const grouped = orders.reduce((acc, order) => {
          const date = new Date(order.created_at).toLocaleDateString()
          if (!acc[date]) acc[date] = { date, revenue: 0, orders: 0 }
          acc[date].revenue += order.total_amount
          acc[date].orders += 1
          return acc
        }, {})
        
        const chartData = Object.values(grouped).slice(-7)
        setData(chartData)
        setTotalRevenue(orders.reduce((sum, o) => sum + o.total_amount, 0))
        setTotalOrders(orders.length)
      }
    } catch (error) {
      toast.error('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-20">Loading analytics...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Sales Analytics</h2>
        <div className="flex gap-2">
          <select
            className="input-field w-40"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last Year</option>
          </select>
          <button className="btn-primary flex items-center gap-2">
            <FaDownload /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h4 className="text-gray-500 text-sm">Total Revenue</h4>
          <p className="text-3xl font-bold text-primary">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="card">
          <h4 className="text-gray-500 text-sm">Total Orders</h4>
          <p className="text-3xl font-bold text-secondary">{totalOrders}</p>
        </div>
      </div>

      <div className="card mb-8">
        <h3 className="text-lg font-bold mb-4">Revenue Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#FF6B35" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold mb-4">Order Volume</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="orders" fill="#004E89" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default SalesAnalytics