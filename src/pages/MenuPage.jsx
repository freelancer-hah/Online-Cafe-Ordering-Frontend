import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { supabase } from '../services/supabase'
import { FaSearch, FaPlus, FaMinus } from 'react-icons/fa'
import toast from 'react-hot-toast'

const MenuPage = () => {
  const { addToCart } = useCart()
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [quantities, setQuantities] = useState({})

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [itemsRes, categoriesRes] = await Promise.all([
        supabase.from('menu_items').select('*, categories(name)').eq('is_available', true),
        supabase.from('categories').select('*').order('name')
      ])
      if (itemsRes.data) setItems(itemsRes.data)
      if (categoriesRes.data) setCategories(categoriesRes.data)
    } catch (error) {
      toast.error('Failed to load menu')
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category_id === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleQuantityChange = (id, change) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + change)
    }))
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-4xl font-bold text-secondary">Our Menu</h1>
        <div className="relative w-full md:w-64">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search dishes..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          className={`px-4 py-2 rounded-full transition-all ${
            selectedCategory === 'All' ? 'bg-primary text-white shadow-lg' : 'bg-gray-200 hover:bg-gray-300'
          }`}
          onClick={() => setSelectedCategory('All')}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`px-4 py-2 rounded-full transition-all ${
              selectedCategory === cat.id ? 'bg-primary text-white shadow-lg' : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card"
            >
              <img
                src={item.image_url || `https://picsum.photos/seed/${item.id}/400/300`}
                alt={item.name}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
              <h3 className="text-xl font-semibold">{item.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{item.description}</p>
              <p className="text-2xl font-bold text-primary mb-4">${item.price}</p>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(item.id, -1)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <FaMinus />
                  </button>
                  <span className="w-8 text-center font-bold">{quantities[item.id] || 1}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, 1)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <FaPlus />
                  </button>
                </div>
                <button
                  onClick={() => addToCart(item, quantities[item.id] || 1)}
                  className="btn-primary flex-1 text-sm py-2"
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MenuPage