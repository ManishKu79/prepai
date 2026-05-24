import { NavLink, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  FileText, 
  Mic, 
  Code2, 
  BarChart3, 
  Settings, 
  LogOut,
  Sparkles,
  Users,
  GitBranch,
  Trophy
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
    { path: '/dashboard/code-review', icon: GitBranch, label: 'Code Review' },
    { path: '/dashboard/leaderboard', icon: Users, label: 'Leaderboard' },
    { path: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ]
  
  const handleLogout = () => {
    logout()
    navigate('/')
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
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="text-sm font-medium">{item.label}</span>
            {item.label === 'Leaderboard' && (
              <span className="ml-auto text-xs bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded-full">Top</span>
            )}
            {item.label === 'Code Review' && (
              <span className="ml-auto text-xs bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded-full">New</span>
            )}
          </NavLink>
        ))}
      </nav>
      
      {/* User Stats Preview */}
      <div className="mx-4 mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
        <div className="flex items-center space-x-2 mb-2">
          <Trophy className="h-4 w-4 text-yellow-500" />
          <span className="text-xs text-gray-400">Your Rank</span>
        </div>
        <p className="text-white font-bold text-lg">#42</p>
        <p className="text-xs text-gray-500">Top 15% of users</p>
      </div>
      
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