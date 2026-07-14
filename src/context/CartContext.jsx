import React, { createContext, useState, useContext, useEffect } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })

  const [totalAmount, setTotalAmount] = useState(0)

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    setTotalAmount(total)
  }, [cartItems])

  const addToCart = (item, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        toast.success(`Added more ${item.name}`)
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        )
      }
      toast.success(`${item.name} added to cart! 🍽️`)
      return [...prev, { ...item, quantity }]
    })
  }

  const removeFromCart = (id) => {
    const item = cartItems.find(i => i.id === id)
    toast.error(`${item?.name} removed`)
    setCartItems(prev => prev.filter(i => i.id !== id))
  }

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id)
      return
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
    toast.success('Cart cleared')
  }

  return (
    <CartContext.Provider value={{
      cartItems,
      totalAmount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems: cartItems.reduce((sum, i) => sum + i.quantity, 0)
    }}>
      {children}
    </CartContext.Provider>
  )
}