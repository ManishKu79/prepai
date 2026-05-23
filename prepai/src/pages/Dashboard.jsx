import useAuthStore from '../store/authStore'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="border-t border-gray-800 pt-4">
              <h2 className="text-lg font-semibold text-white mb-2">User Information</h2>
              <p className="text-gray-400">Name: {user?.name || 'Not set'}</p>
              <p className="text-gray-400">Email: {user?.email || 'Not set'}</p>
            </div>
            
            <div className="border-t border-gray-800 pt-4">
              <p className="text-gray-500 text-sm">
                🚀 More features coming soon!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard