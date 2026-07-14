import React, { useState, useEffect } from 'react'
import { supabase } from '../../services/supabase'
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'
import toast from 'react-hot-toast'

const MenuManagement = () => {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category_id: '',
    image_url: '',
    is_available: true
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [itemsRes, categoriesRes] = await Promise.all([
        supabase.from('menu_items').select('*, categories(name)'),
        supabase.from('categories').select('*')
      ])
      if (itemsRes.data) setItems(itemsRes.data)
      if (categoriesRes.data) setCategories(categoriesRes.data)
    } catch (error) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingItem) {
        const { error } = await supabase
          .from('menu_items')
          .update(formData)
          .eq('id', editingItem.id)
        if (error) throw error
        toast.success('Item updated successfully!')
      } else {
        const { error } = await supabase
          .from('menu_items')
          .insert([formData])
        if (error) throw error
        toast.success('Item added successfully!')
      }
      fetchData()
      setShowModal(false)
      resetForm()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id)
      if (error) throw error
      toast.success('Item deleted!')
      fetchData()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      category_id: '',
      image_url: '',
      is_available: true
    })
    setEditingItem(null)
  }

  if (loading) return <div className="text-center py-20">Loading...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Menu Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <FaPlus /> Add Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <div key={item.id} className="card">
            <img
              src={item.image_url || `https://picsum.photos/seed/${item.id}/400/300`}
              alt={item.name}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />
            <h3 className="text-xl font-semibold">{item.name}</h3>
            <p className="text-gray-600 text-sm">{item.description}</p>
            <p className="text-2xl font-bold text-primary my-2">${item.price}</p>
            <span className="text-sm text-gray-500">{item.categories?.name}</span>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setEditingItem(item)
                  setFormData(item)
                  setShowModal(true)
                }}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center justify-center gap-2"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Item Name"
                className="input-field"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              <input
                type="number"
                placeholder="Price"
                className="input-field"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
              <textarea
                placeholder="Description"
                className="input-field"
                rows="2"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
              <select
                className="input-field"
                value={formData.category_id}
                onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Image URL"
                className="input-field"
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_available}
                  onChange={(e) => setFormData({...formData, is_available: e.target.checked})}
                />
                <label>Available</label>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1">
                  {editingItem ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default MenuManagement