import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { loginSchema } from '../../utils/validation'
import { authAPI } from '../../services/api'
import useAuthStore from '../../store/authStore'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    setServerError('')
    
    try {
      const response = await authAPI.login(data)
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      login(user, token)
      
      navigate('/dashboard')
    } catch (error) {
      setServerError(error.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg text-sm">
          {serverError}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            {...register('email')}
            type="email"
            className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="you@example.com"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            className="w-full pl-10 pr-10 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-500" />
            ) : (
              <Eye className="h-4 w-4 text-gray-500" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>

      <p className="text-center text-sm text-gray-400">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-500 hover:text-blue-400">
          Sign up
        </Link>
      </p>
    </form>
  )
}

export default LoginForm