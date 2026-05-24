import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Trophy, Medal, Star, TrendingUp, Award, 
  Target, Brain, Code2, Users, Calendar,
  Loader2, Crown, Sparkles
} from 'lucide-react'

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([])
  const [userRank, setUserRank] = useState(null)
  const [timeFrame, setTimeFrame] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
    fetchUserRank()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/leaderboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setLeaderboard(data.leaderboard)
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserRank = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/leaderboard/my-rank', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setUserRank(data)
      }
    } catch (error) {
      console.error('Error fetching user rank:', error)
    }
  }

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-500" />
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />
    if (rank === 3) return <Medal className="h-6 w-6 text-amber-600" />
    return <span className="text-2xl font-bold text-gray-500">#{rank}</span>
  }

  const getRankBg = (rank) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/30'
    if (rank === 2) return 'bg-gradient-to-r from-gray-500/20 to-gray-600/20 border-gray-500/30'
    if (rank === 3) return 'bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600/30'
    return 'bg-gray-900 border-gray-800'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 bg-yellow-500/10 rounded-full px-4 py-1.5 mb-4">
          <Trophy className="h-4 w-4 text-yellow-500" />
          <span className="text-yellow-400 text-sm font-medium">Competition Leaderboard</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Top{' '}
          <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
            Performers
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Climb the ranks by completing interviews and solving coding challenges
        </p>
      </motion.div>

      {/* User's Rank Card */}
      {userRank && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
          
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-blue-200 text-sm">Your Global Rank</p>
                <p className="text-4xl font-bold text-white">#{userRank.rank}</p>
                <p className="text-blue-200 text-sm mt-1">out of {userRank.totalUsers} developers</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-blue-200 text-sm">Total Score</p>
              <p className="text-4xl font-bold text-white">{userRank.userStats?.totalScore || 0}</p>
              <div className="flex items-center gap-2 mt-1 justify-end">
                <Target className="h-3 w-3 text-blue-200" />
                <span className="text-blue-200 text-xs">Top {Math.round((userRank.rank / userRank.totalUsers) * 100)}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
          <Brain className="h-6 w-6 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{userRank?.userStats?.interviewsCompleted || 0}</p>
          <p className="text-xs text-gray-400">Interviews</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
          <Code2 className="h-6 w-6 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{userRank?.userStats?.codingProblemsSolved || 0}</p>
          <p className="text-xs text-gray-400">Problems Solved</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
          <TrendingUp className="h-6 w-6 text-purple-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{userRank?.userStats?.averageScore || 0}%</p>
          <p className="text-xs text-gray-400">Avg Score</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
          <Award className="h-6 w-6 text-orange-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{userRank?.userStats?.streak || 0}</p>
          <p className="text-xs text-gray-400">Day Streak</p>
        </div>
      </div>

      {/* Leaderboard Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Users className="h-4 w-4" />
            Top Contributors
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setTimeFrame('weekly')}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${timeFrame === 'weekly' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimeFrame('monthly')}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${timeFrame === 'monthly' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setTimeFrame('all')}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${timeFrame === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
            >
              All Time
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Developer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Interviews</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Problems</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Avg Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {leaderboard.slice(0, 50).map((user, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className={`hover:bg-gray-800/50 transition-colors ${getRankBg(user.rank)}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getRankIcon(user.rank)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        user.rank === 1 ? 'bg-yellow-500' : user.rank === 2 ? 'bg-gray-400' : user.rank === 3 ? 'bg-amber-600' : 'bg-blue-600'
                      }`}>
                        <span className="text-sm font-bold text-white">
                          {user.userName?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.userName}</p>
                        {user.rank === 1 && <p className="text-xs text-yellow-500">🌟 Top Performer</p>}
                        {user.rank === 2 && <p className="text-xs text-gray-400">🥈 Runner Up</p>}
                        {user.rank === 3 && <p className="text-xs text-amber-600">🥉 Bronze</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-xl font-bold ${
                      user.rank === 1 ? 'text-yellow-500' : user.rank === 2 ? 'text-gray-400' : user.rank === 3 ? 'text-amber-600' : 'text-white'
                    }`}>
                      {user.totalScore}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {user.interviewsCompleted}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {user.codingProblemsSolved}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-700 rounded-full h-1.5">
                        <div 
                          className="h-1.5 rounded-full bg-green-500"
                          style={{ width: `${user.averageScore}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-300">{user.averageScore}%</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Motivational Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center py-8"
      >
        <Sparkles className="h-8 w-8 text-blue-500 mx-auto mb-3" />
        <p className="text-gray-400 italic">
          "The only way to do great work is to love what you do. Keep practicing and climb the ranks!"
        </p>
        <p className="text-gray-500 text-sm mt-2">— Complete more interviews to improve your rank</p>
      </motion.div>
    </div>
  )
}

export default LeaderboardPage