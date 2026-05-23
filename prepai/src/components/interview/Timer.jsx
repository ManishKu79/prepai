import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

const Timer = ({ duration = 60, onTimeUp, reset, isActive = true }) => {
  const [timeLeft, setTimeLeft] = useState(duration)

  // Reset timer when reset prop changes or duration changes
  useEffect(() => {
    setTimeLeft(duration)
  }, [duration, reset])

  useEffect(() => {
    if (!isActive) return
    
    if (timeLeft <= 0) {
      onTimeUp?.()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, onTimeUp, isActive])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const getTimerColor = () => {
    if (timeLeft > 30) return 'text-green-500'
    if (timeLeft > 10) return 'text-yellow-500'
    return 'text-red-500 animate-pulse'
  }

  return (
    <div className="flex items-center space-x-2 bg-gray-800 px-3 py-1.5 rounded-lg">
      <Clock className={`h-4 w-4 ${getTimerColor()}`} />
      <span className={`font-mono font-medium ${getTimerColor()}`}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  )
}

export default Timer