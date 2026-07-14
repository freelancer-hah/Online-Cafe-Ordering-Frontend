import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { FaTrash, FaPlus, FaMinus, FaShoppingBag } from 'react-icons/fa'

const CartPage = () => {
  const { cartItems, totalAmount, updateQuantity, removeFromCart, clearCart } = useCart()

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-16">
        <FaShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-8">Browse our menu and add some delicious items!</p>
        <Link to="/menu" className="btn-primary inline-block">
          Browse Menu
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-secondary mb-8">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cartItems.map((item) => (
            <div key={item.id} className="card flex items-center gap-4 mb-4">
              <img
                src={item.image_url || `https://picsum.photos/seed/${item.id}/100/100`}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-primary font-bold">${item.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <FaMinus />
                </button>
                <span className="w-8 text-center font-bold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <FaPlus />
                </button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
          
          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-700 mt-4"
          >
            Clear Cart
          </button>
        </div>

        <div className="lg:col-span-1">
          <div className="card sticky top-20">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
            <div className="space-y-2 border-b pb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>$2.99</span>
              </div>
            </div>
            <div className="flex justify-between font-bold text-lg mt-4">
              <span>Total</span>
              <span>${(totalAmount + 2.99).toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              className="btn-primary w-full text-center block mt-4"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage