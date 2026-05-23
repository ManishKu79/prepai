import { NavLink, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  FileText, 
  Mic, 
  Code2, 
  BarChart3, 
  Settings, 
  LogOut,
  Sparkles 
} from 'lucide-react'
import useAuthStore from '../../store/authStore'

const Sidebar = () => {
  const { logout } = useAuthStore()
  const navigate = useNavigate()
  
  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/dashboard/resume-analyzer', icon: FileText, label: 'Resume Analyzer' },
    { path: '/dashboard/mock-interview', icon: Mic, label: 'Mock Interview' },
    { path: '/dashboard/coding-practice', icon: Code2, label: 'Coding Practice' },
    { path: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ]
  
  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="flex items-center space-x-2 px-6 py-6 border-b border-gray-800">
        <Sparkles className="h-6 w-6 text-blue-500" />
        <span className="font-bold text-xl bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">
          PrepAI
        </span>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      {/* Logout Button */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-3 py-2 w-full rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar