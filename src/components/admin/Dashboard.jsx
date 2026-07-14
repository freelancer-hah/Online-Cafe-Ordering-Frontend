import React from 'react'
import { FaShoppingBag, FaDollarSign, FaUsers, FaClock } from 'react-icons/fa'

const Dashboard = ({ stats }) => {
  const cards = [
    { icon: FaShoppingBag, label: 'Total Orders', value: stats.totalOrders, color: 'bg-blue-500' },
    { icon: FaDollarSign, label: 'Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, color: 'bg-green-500' },
    { icon: FaUsers, label: 'Customers', value: stats.totalCustomers, color: 'bg-purple-500' },
    { icon: FaClock, label: 'Pending Orders', value: stats.pendingOrders, color: 'bg-orange-500' },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="card">
            <div className="flex items-center gap-4">
              <div className={`${card.color} p-3 rounded-xl text-white`}>
                <card.icon className="text-2xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard