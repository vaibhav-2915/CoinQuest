import { createContext, useContext, useState, useEffect } from 'react'
import { login as apiLogin, register as apiRegister } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('coinquest_user')
    return stored ? JSON.parse(stored) : null
  })

  const loginUser = async (credentials) => {
    const res = await apiLogin(credentials)
    const { token, user: userData } = res.data
    localStorage.setItem('coinquest_token', token)
    localStorage.setItem('coinquest_user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const registerUser = async (data) => {
    const res = await apiRegister(data)
    const { token, user: userData } = res.data
    localStorage.setItem('coinquest_token', token)
    localStorage.setItem('coinquest_user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const logout = () => {
    localStorage.removeItem('coinquest_token')
    localStorage.removeItem('coinquest_user')
    setUser(null)
  }

  const refreshUser = async () => {
    try {
      const res = await import('../services/api').then(m => m.getMe())
      const latestData = res.data
      const updatedUser = { ...user, ...latestData }
      localStorage.setItem('coinquest_user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      return updatedUser
    } catch (err) {
      console.error('Failed to refresh user', err)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loginUser, registerUser, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
