import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Medal, Star, TrendingUp } from 'lucide-react'

const LeaderboardTable = () => {
  const [leaderboard, setLeaderboard] = useState([])
  const [userRank, setUserRank] = useState(null)
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
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />
    return <span className="text-gray-500 font-bold">{rank}</span>
  }

  if (loading) {
    return <div className="text-center py-8">Loading leaderboard...</div>
  }

  return (
    <div className="space-y-6">
      {/* User's Rank Card */}
      {userRank && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Your Rank</p>
              <p className="text-4xl font-bold text-white">#{userRank.rank}</p>
              <p className="text-blue-200 text-sm mt-1">out of {userRank.totalUsers} users</p>
            </div>
            <div className="text-right">
              <p className="text-blue-200 text-sm">Total Score</p>
              <p className="text-3xl font-bold text-white">{userRank.userStats?.totalScore || 0}</p>
            </div>
            <TrendingUp className="h-12 w-12 text-white/30" />
          </div>
        </motion.div>
      )}

      {/* Leaderboard Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h3 className="text-white font-semibold">Top Performers</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Interviews</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Problems Solved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {leaderboard.map((user, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getRankIcon(user.rank)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">
                          {user.userName?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <span className="text-white">{user.userName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-yellow-500 font-bold">{user.totalScore}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {user.interviewsCompleted}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {user.codingProblemsSolved}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default LeaderboardTable