const cron = require('node-cron')
const User = require('../models/User')
const { sendPracticeReminder } = require('./emailService')
const { updateUserScore } = require('../controllers/leaderboardController')

// Run every day at 9 AM
cron.schedule('0 9 * * *', async () => {
  console.log('Running daily practice reminder...')
  
  const users = await User.find()
  
  for (const user of users) {
    // Get user stats
    const stats = {
      interviews: 0,
      coding: 0,
      streak: 0
    }
    
    // Send reminder email
    await sendPracticeReminder(user.email, user.name, stats)
  }
  
  console.log(`Sent reminders to ${users.length} users`)
})

// Update leaderboard every hour
cron.schedule('0 * * * *', async () => {
  console.log('Updating leaderboard scores...')
  
  const users = await User.find()
  
  for (const user of users) {
    await updateUserScore(user._id, user.name)
  }
  
  console.log('Leaderboard updated')
})