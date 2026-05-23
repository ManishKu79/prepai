import { Link } from 'react-router-dom'
import RegisterForm from '../components/auth/RegisterForm'
import { Sparkles } from 'lucide-react'

const Register = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Link to="/" className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-blue-500" />
              <span className="font-bold text-2xl bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">
                PrepAI
              </span>
            </Link>
          </div>
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <p className="mt-2 text-sm text-gray-400">
            Start your placement preparation journey
          </p>
        </div>

        <RegisterForm />
      </div>
    </div>
  )
}

export default Register