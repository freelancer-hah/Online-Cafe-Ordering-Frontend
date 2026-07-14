import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-secondary text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">FoodHub</h3>
            <p className="text-white/70">Delicious food delivered to your door</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-white/70">
              <li><Link to="/menu" className="hover:text-white">Menu</Link></li>
              <li><Link to="/cart" className="hover:text-white">Cart</Link></li>
              <li><Link to="/login" className="hover:text-white">Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-white/70">Email: info@foodhub.com</p>
            <p className="text-white/70">Phone: +1 234 567 890</p>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/50">
          © 2024 FoodHub. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer