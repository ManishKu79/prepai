import axios from 'axios'

// Make sure this matches your backend URL
const API_URL = 'https://prepration-platform-1.onrender.com/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
})

// Add request interceptor for logging (helps debug)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log(`📤 API Request: ${config.method.toUpperCase()} ${config.url}`, config.data)
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log(`📥 API Response: ${response.status} ${response.config.url}`, response.data)
    return response
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message)
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  register: (userData) => {
    console.log('Registering user:', { ...userData, password: '***' })
    return api.post('/auth/register', userData)
  },
  login: (credentials) => {
    console.log('Logging in:', { ...credentials, password: '***' })
    return api.post('/auth/login', credentials)
  },
  getProfile: () => api.get('/auth/profile'),
  logout: () => api.post('/auth/logout'),
}

export default api