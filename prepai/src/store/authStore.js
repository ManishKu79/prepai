import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: (userData, token) => {
        set({ 
          user: userData, 
          token, 
          isAuthenticated: true 
        })
      },
      
      logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        })
      },
      
      updateUser: (userData) => {
        set({ user: userData })
        localStorage.setItem('user', JSON.stringify(userData))
      },
    }),
    {
      name: 'prepai-auth',
      getStorage: () => localStorage,
    }
  )
)

export default useAuthStore