import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { createOrder } from '../services/supabase'
import toast from 'react-hot-toast'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const { cartItems, totalAmount, clearCart } = useCart()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const orderData = {
        user_id: user?.id,
        items: cartItems,
        total_amount: totalAmount + 2.99,
        status: 'pending',
        payment_status: 'pending',
        delivery_address: formData.address,
        customer_name: formData.name,
        customer_phone: formData.phone,
        notes: formData.notes
      }

      const order = await createOrder(orderData)
      clearCart()
      toast.success('Order placed successfully! 🎉')
      navigate(`/track/${order.id}`)
    } catch (error) {
      toast.error('Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-secondary mb-8">Checkout</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Delivery Details</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="input-field"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <input
              type="email"
              placeholder="Email"
              className="input-field"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="input-field"
              required
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
            <textarea
              placeholder="Delivery Address"
              className="input-field"
              rows="3"
              required
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
            <textarea
              placeholder="Special Instructions (optional)"
              className="input-field"
              rows="2"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>
        </div>

        <div className="card">
          <h3 className="text-xl font-bold mb-4">Order Summary</h3>
          <div className="space-y-2">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.name} x{item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${(totalAmount + 2.99).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary w-full text-center"
          disabled={loading}
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  )
}

export default CheckoutPage