import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Sparkles } from 'lucide-react'
import { Button } from '../ui/button'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-blue-500" />
            <span className="font-bold text-xl bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">
              PrepAI
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How it Works</a>
            <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a>
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-white"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col space-y-3">
              <a href="#features" className="text-gray-400 hover:text-white py-2">Features</a>
              <a href="#how-it-works" className="text-gray-400 hover:text-white py-2">How it Works</a>
              <a href="#pricing" className="text-gray-400 hover:text-white py-2">Pricing</a>
              <div className="flex flex-col space-y-2 pt-2">
                <Link to="/login"><Button variant="ghost" className="w-full">Sign In</Button></Link>
                <Link to="/register"><Button className="w-full">Get Started</Button></Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar