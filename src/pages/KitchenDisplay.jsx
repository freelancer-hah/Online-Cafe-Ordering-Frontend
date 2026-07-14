import React, { useState, useEffect } from 'react'
import { supabase, updateOrderStatus } from '../services/supabase'
import { useSocket } from '../context/SocketContext'
import { FaClock, FaCheck, FaUtensils, FaBell } from 'react-icons/fa'
import toast from 'react-hot-toast'

const KitchenDisplay = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { socket } = useSocket()

  useEffect(() => {
    fetchOrders()
    
    // Listen for new orders
    if (socket) {
      socket.on('new-order', (order) => {
        setOrders(prev => [...prev, order])
        toast.success(`New order #${order.id} received!`)
        // Play sound
        const audio = new Audio('/notification.mp3')
        audio.play()
      })
    }

    return () => {
      if (socket) {
        socket.off('new-order')
      }
    }
  }, [socket])

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .in('status', ['pending', 'preparing'])
      .order('created_at', { ascending: true })
    
    if (data) {
      setOrders(data)
    }
    setLoading(false)
  }

  const handleStatusUpdate = async (orderId, status) => {
    await updateOrderStatus(orderId, status)
    setOrders(prev => prev.filter(order => order.id !== orderId))
    toast.success(`Order #${orderId} updated to ${status}`)
    
    if (socket) {
      socket.emit('order-status-update', { orderId, status })
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'preparing': return 'bg-blue-100 text-blue-700'
      case 'ready': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) {
    return <div className="text-center py-20">Loading orders...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-secondary">Kitchen Display</h1>
        <div className="flex items-center gap-4">
          <span className="bg-primary text-white px-4 py-2 rounded-full flex items-center gap-2">
            <FaBell /> {orders.length} Active Orders
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map(order => (
          <div key={order.id} className="card border-l-4 border-primary">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">Order #{order.id.slice(0, 8)}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleTimeString()}
                </p>
              </div>
              <span className={`badge ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span className="text-gray-600">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Table: {order.table_number || 'N/A'}</span>
              <span>${order.total_amount}</span>
            </div>

            <div className="flex gap-2 mt-4">
              {order.status === 'pending' && (
                <button
                  onClick={() => handleStatusUpdate(order.id, 'preparing')}
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <FaUtensils /> Start Preparing
                </button>
              )}
              {order.status === 'preparing' && (
                <button
                  onClick={() => handleStatusUpdate(order.id, 'ready')}
                  className="flex-1 bg-success text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <FaCheck /> Ready
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-20">
          <FaClock className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-500">No Active Orders</h2>
          <p className="text-gray-400">Waiting for new orders...</p>
        </div>
      )}
    </div>
  )
}

export default KitchenDisplay