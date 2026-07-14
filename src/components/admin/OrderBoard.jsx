import React, { useState, useEffect } from 'react'
import { supabase, updateOrderStatus } from '../../services/supabase'
import { useSocket } from '../../context/SocketContext'
import { FaCheck, FaClock, FaUtensils, FaTruck } from 'react-icons/fa'
import toast from 'react-hot-toast'

const OrderBoard = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { socket } = useSocket()

  useEffect(() => {
    fetchOrders()
    
    if (socket) {
      socket.on('new-order', () => fetchOrders())
      socket.on('order-updated', () => fetchOrders())
    }

    return () => {
      if (socket) {
        socket.off('new-order')
        socket.off('order-updated')
      }
    }
  }, [socket])

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setOrders(data)
    setLoading(false)
  }

  const handleStatusUpdate = async (orderId, status) => {
    await updateOrderStatus(orderId, status)
    toast.success(`Order #${orderId.slice(0, 8)} updated`)
    fetchOrders()
    
    if (socket) {
      socket.emit('order-status-update', { orderId, status })
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      preparing: 'bg-blue-100 text-blue-700',
      ready: 'bg-green-100 text-green-700',
      delivered: 'bg-gray-100 text-gray-700'
    }
    return styles[status] || styles.pending
  }

  if (loading) return <div className="text-center py-20">Loading orders...</div>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Order Management</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Order ID</th>
              <th className="px-6 py-3 text-left">Customer</th>
              <th className="px-6 py-3 text-left">Total</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-mono">#{order.id.slice(0, 8)}</td>
                <td className="px-6 py-4">{order.customer_name || 'Guest'}</td>
                <td className="px-6 py-4 font-bold">${order.total_amount}</td>
                <td className="px-6 py-4">
                  <span className={`badge ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'preparing')}
                        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                      >
                        <FaUtensils />
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'ready')}
                        className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
                      >
                        <FaCheck />
                      </button>
                    )}
                    {order.status === 'ready' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'delivered')}
                        className="bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600"
                      >
                        <FaTruck />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default OrderBoard