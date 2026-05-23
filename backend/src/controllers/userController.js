const User = require('../models/User')
const bcrypt = require('bcryptjs')

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    res.json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Update profile
const updateProfile = async (req, res) => {
  try {
    const { name, email, skills, preferences } = req.body
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (name) user.name = name
    if (email) user.email = email
    if (skills) user.skills = skills
    if (preferences) user.preferences = { ...user.preferences, ...preferences }
    
    user.updatedAt = Date.now()
    await user.save()

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        skills: user.skills,
        preferences: user.preferences
      }
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Change password - FIXED VERSION (no pre-save hooks)
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' })
    }

    // Hash new password manually
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)
    
    // Update password directly
    user.password = hashedPassword
    user.updatedAt = Date.now()
    
    // Save the user
    await user.save()

    res.json({ success: true, message: 'Password changed successfully' })
  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Update avatar
const updateAvatar = async (req, res) => {
  try {
    const avatarUrl = req.body.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(req.user.name)}&background=3b82f6&color=fff`
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarUrl, updatedAt: Date.now() },
      { new: true }
    ).select('-password')

    res.json({
      success: true,
      avatar: user.avatar
    })
  } catch (error) {
    console.error('Update avatar error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Add skill
const addSkill = async (req, res) => {
  try {
    const { skill } = req.body
    const user = await User.findById(req.user._id)

    if (!user.skills.includes(skill)) {
      user.skills.push(skill)
      user.updatedAt = Date.now()
      await user.save()
    }

    res.json({
      success: true,
      skills: user.skills
    })
  } catch (error) {
    console.error('Add skill error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Remove skill
const removeSkill = async (req, res) => {
  try {
    const { skill } = req.body
    const user = await User.findById(req.user._id)
    
    user.skills = user.skills.filter(s => s !== skill)
    user.updatedAt = Date.now()
    await user.save()

    res.json({
      success: true,
      skills: user.skills
    })
  } catch (error) {
    console.error('Remove skill error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Delete account
const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id)
    res.json({ success: true, message: 'Account deleted successfully' })
  } catch (error) {
    console.error('Delete account error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  updateAvatar,
  addSkill,
  removeSkill,
  deleteAccount
}