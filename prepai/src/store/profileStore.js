import { create } from 'zustand'

const useProfileStore = create((set, get) => ({
  profile: null,
  loading: false,
  error: null,

  fetchProfile: async () => {
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        set({ profile: data.user, loading: false })
      } else {
        set({ error: data.message, loading: false })
      }
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  updateProfile: async (updates) => {
    set({ loading: true })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      })
      const data = await response.json()
      if (data.success) {
        set({ profile: data.user, loading: false })
        return { success: true }
      }
      return { success: false, error: data.message }
    } catch (error) {
      set({ error: error.message, loading: false })
      return { success: false, error: error.message }
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      })
      const data = await response.json()
      return { success: data.success, message: data.message }
    } catch (error) {
      return { success: false, message: error.message }
    }
  },

  addSkill: async (skill) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/user/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ skill })
      })
      const data = await response.json()
      if (data.success) {
        set({ profile: { ...get().profile, skills: data.skills } })
      }
      return { success: data.success }
    } catch (error) {
      return { success: false }
    }
  },

  removeSkill: async (skill) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/user/skills', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ skill })
      })
      const data = await response.json()
      if (data.success) {
        set({ profile: { ...get().profile, skills: data.skills } })
      }
      return { success: data.success }
    } catch (error) {
      return { success: false }
    }
  }
}))

export default useProfileStore