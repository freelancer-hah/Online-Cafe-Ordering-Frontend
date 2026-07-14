import React, { createContext, useState, useContext, useEffect } from 'react'
import { supabase } from '../services/supabase'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user)
        fetchUserRole(session.user.id)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser(session.user)
          await fetchUserRole(session.user.id)
        } else {
          setUser(null)
          setRole(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserRole = async (userId) => {
    const { data } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()
    
    if (data) setRole(data.role)
  }

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email, password
      })
      if (error) throw error
      toast.success('Welcome back! 🎉')
      return { success: true, data }
    } catch (error) {
      toast.error(error.message)
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    toast.success('Logged out')
  }

  return (
    <AuthContext.Provider value={{
      user, role, loading,
      login, logout,
      isAuthenticated: !!user,
      isAdmin: role === 'admin',
      isKitchen: role === 'kitchen'
    }}>
      {children}
    </AuthContext.Provider>
  )
}