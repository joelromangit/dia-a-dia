import { createContext, useContext, useState, useCallback } from 'react'

const AdminContext = createContext()

const ADMIN_PASSWORD = 'Padel-123'
const STORAGE_KEY = 'grindset-admin'

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  })

  const login = useCallback((password) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true)
      localStorage.setItem(STORAGE_KEY, 'true')
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setIsAdmin(false)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider')
  return ctx
}
