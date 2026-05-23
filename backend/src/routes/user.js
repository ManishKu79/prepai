const express = require('express')
const router = express.Router()
const {
  getProfile,
  updateProfile,
  changePassword,
  updateAvatar,
  addSkill,
  removeSkill,
  deleteAccount
} = require('../controllers/userController')
const { protect } = require('../middleware/auth')

// All routes are protected
router.get('/profile', protect, getProfile)
router.put('/profile', protect, updateProfile)
router.put('/change-password', protect, changePassword)
router.put('/avatar', protect, updateAvatar)
router.post('/skills', protect, addSkill)
router.delete('/skills', protect, removeSkill)
router.delete('/account', protect, deleteAccount)

module.exports = router