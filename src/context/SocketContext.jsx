import React, { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const SocketContext = createContext()

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) throw new Error('useSocket must be used within SocketProvider')
  return context
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect()
        setSocket(null)
        setIsConnected(false)
      }
      return
    }

    const socketInstance = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { userId: user.id },
      transports: ['websocket'],
    })

    socketInstance.on('connect', () => {
      setIsConnected(true)
      console.log('Socket connected')
    })

    socketInstance.on('disconnect', () => {
      setIsConnected(false)
    })

    socketInstance.on('order-updated', (data) => {
      toast.custom((t) => (
        <div className="bg-white rounded-xl shadow-2xl p-4 border-l-4 border-primary max-w-md">
          <h4 className="font-bold text-secondary">Order Update</h4>
          <p className="text-gray-600">Order #{data.orderId} status: {data.status}</p>
        </div>
      ))
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
      setSocket(null)
      setIsConnected(false)
    }
  }, [user])

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}