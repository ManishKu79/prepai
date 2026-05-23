import { Navigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  
  if (!isAuthenticated) {
    // Redirect to home page (landing page) instead of login
    return <Navigate to="/" replace />
  }
  
  return children
}

export default ProtectedRoute