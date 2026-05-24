import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sparkles, ChevronDown, User, LogOut, Settings, LayoutDashboard } from 'lucide-react'
import useAuthStore from '../../store/authStore'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsOpen(false)
    setShowDropdown(false)
  }

  // FIXED: Better scroll to section with proper centering
  const scrollToSection = (sectionId) => {
    setIsOpen(false)
    const element = document.getElementById(sectionId)
    if (element) {
      const navbarHeight = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight
      
      window.scrollTo({ 
        top: offsetPosition, 
        behavior: 'smooth' 
      })
      
      // Update URL without page reload
      history.pushState(null, null, `#${sectionId}`)
    }
  }

  const navItems = [
    { name: 'Features', id: 'features' },
    { name: 'How it Works', id: 'how-it-works' },
    { name: 'Pricing', id: 'pricing' },
    { name: 'FAQ', id: 'faq' },
    { name: 'Contact', id: 'contact' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-black/95 backdrop-blur-md border-b border-gray-800' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group" onClick={() => setIsOpen(false)}>
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
              <Sparkles className="h-6 w-6 text-blue-500" />
            </motion.div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">
              PrepAI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.id)}
                className="text-gray-300 hover:text-white transition-colors text-sm font-medium cursor-pointer"
              >
                {item.name}
              </button>
            ))}
            
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="text-sm text-white">{user?.name?.split(' ')[0] || 'User'}</span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-xl overflow-hidden z-50"
                    >
                      <Link to="/dashboard" onClick={() => setShowDropdown(false)} className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 transition-colors">
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                      <Link to="/dashboard/settings" onClick={() => setShowDropdown(false)} className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 transition-colors">
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                      <div className="border-t border-gray-800 my-1"></div>
                      <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-2.5 text-sm text-red-400 hover:bg-gray-800 transition-colors w-full text-left">
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <button className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">Sign In</button>
                </Link>
                <Link to="/register">
                  <button className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">Get Started</button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-gray-800 mt-2"
            >
              <div className="py-4 space-y-3">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.id)}
                    className="block text-gray-300 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-gray-800 w-full text-left"
                  >
                    {item.name}
                  </button>
                ))}
                
                {isAuthenticated ? (
                  <>
                    <div className="border-t border-gray-800 pt-3 mt-2">
                      <Link to="/dashboard" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-gray-800" onClick={() => setIsOpen(false)}>
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                      <Link to="/dashboard/settings" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-gray-800" onClick={() => setIsOpen(false)}>
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                      <button onClick={handleLogout} className="flex items-center space-x-3 text-red-400 hover:text-red-300 transition-colors py-2 px-3 rounded-lg hover:bg-gray-800 w-full text-left">
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2 pt-2">
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <button className="w-full text-gray-300 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-gray-800 text-left">Sign In</button>
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)}>
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg transition-colors">Get Started</button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default Navbar