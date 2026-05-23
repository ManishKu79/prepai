import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-800 bg-gray-900/50 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1">
            <div className="mb-4">
              <span className="font-bold text-xl text-white">PrepAI</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              AI-powered interview preparation platform helping students crack their dream placements.
            </p>
            <div className="flex space-x-3 text-sm">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">GitHub</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">Twitter</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">LinkedIn</a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-sm text-gray-400 hover:text-white">Features</a></li>
              <li><a href="#pricing" className="text-sm text-gray-400 hover:text-white">Pricing</a></li>
              <li><a href="#faq" className="text-sm text-gray-400 hover:text-white">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-gray-400 hover:text-white">About</Link></li>
              <li><Link to="/blog" className="text-sm text-gray-400 hover:text-white">Blog</Link></li>
              <li><Link to="/careers" className="text-sm text-gray-400 hover:text-white">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/docs" className="text-sm text-gray-400 hover:text-white">Documentation</Link></li>
              <li><Link to="/support" className="text-sm text-gray-400 hover:text-white">Support</Link></li>
              <li><Link to="/privacy" className="text-sm text-gray-400 hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>© {currentYear} PrepAI. All rights reserved.</p>
          <p className="mt-1">Made with ❤️ for placement preparation</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer