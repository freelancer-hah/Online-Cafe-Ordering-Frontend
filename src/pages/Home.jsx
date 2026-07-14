import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaUtensils, FaTruck, FaClock, FaArrowRight } from 'react-icons/fa'

const Home = () => {
  return (
    <div>
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-gradient-to-r from-secondary to-primary rounded-3xl p-12 mb-12"
      >
        <div className="relative z-10">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl font-bold text-white mb-4"
          >
            Delicious Food <br />
            <span className="text-accent">Delivered to You</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/90 text-lg mb-8 max-w-lg"
          >
            Order your favorite meals with real-time tracking and instant delivery.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link to="/menu" className="btn-outline bg-white text-secondary hover:bg-white/90 inline-flex items-center gap-2">
              Order Now <FaArrowRight />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="card text-center">
          <FaUtensils className="text-4xl text-primary mx-auto mb-4" />
          <h3 className="font-bold text-lg">Quality Food</h3>
          <p className="text-gray-600">Fresh ingredients prepared by expert chefs</p>
        </div>
        <div className="card text-center">
          <FaTruck className="text-4xl text-primary mx-auto mb-4" />
          <h3 className="font-bold text-lg">Fast Delivery</h3>
          <p className="text-gray-600">Hot and fresh food delivered to your door</p>
        </div>
        <div className="card text-center">
          <FaClock className="text-4xl text-primary mx-auto mb-4" />
          <h3 className="font-bold text-lg">Real-time Tracking</h3>
          <p className="text-gray-600">Track your order from kitchen to delivery</p>
        </div>
      </section>
    </div>
  )
}

export default Home