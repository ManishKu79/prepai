const express = require('express')
const router = express.Router()
const {
  getLeaderboard,
  getUserRank,
  updateStats
} = require('../controllers/leaderboardController')
const { protect } = require('../middleware/auth')

router.get('/', protect, getLeaderboard)
router.get('/my-rank', protect, getUserRank)
router.post('/update-stats', protect, updateStats)

module.exports = router