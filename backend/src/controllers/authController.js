const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { sendWelcomeEmail } = require('../services/emailService')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    console.log('📝 Registration request received for:', req.body.email)
    
    const { name, email, password } = req.body

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide name, email and password' 
      })
    }

    // Check if user already exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists with this email' 
      })
    }

    // Hash password manually
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      updatedAt: new Date()
    })

    await user.save()

    // Generate token
    const token = generateToken(user._id)

    console.log('✅ User registered successfully:', email)

    // Send welcome email (don't block response)
    try {
      await sendWelcomeEmail(email, name)
      console.log('📧 Welcome email sent to:', email)
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
    }

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || null,
        skills: user.skills || [],
        preferences: user.preferences || { emailNotifications: true, darkMode: true }
      },
    })
  } catch (error) {
    console.error('❌ Registration error:', error)
    res.status(500).json({ 
      success: false,
      message: 'Server error during registration', 
      error: error.message 
    })
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    console.log('🔐 Login request received for:', req.body.email)
    
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide email and password' 
      })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      })
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      })
    }

    // Update last active
    user.lastActive = new Date()
    user.updatedAt = new Date()
    await user.save()

    const token = generateToken(user._id)

    console.log('✅ User logged in successfully:', email)

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || null,
        skills: user.skills || [],
        preferences: user.preferences || { emailNotifications: true, darkMode: true }
      },
    })
  } catch (error) {
    console.error('❌ Login error:', error)
    res.status(500).json({ 
      success: false,
      message: 'Server error during login', 
      error: error.message 
    })
  }
}

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      })
    }
    
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        skills: user.skills,
        preferences: user.preferences,
        stats: user.stats,
        createdAt: user.createdAt
      },
    })
  } catch (error) {
    console.error('❌ Profile error:', error)
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    })
  }
}

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = async (req, res) => {
  try {
    // Update last active
    await User.findByIdAndUpdate(req.user._id, { 
      lastActive: new Date(),
      updatedAt: new Date()
    })
    
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (error) {
    console.error('❌ Logout error:', error)
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    })
  }
}

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
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
    
    user.updatedAt = new Date()
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

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
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

    // Hash new password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)
    
    user.password = hashedPassword
    user.updatedAt = new Date()
    await user.save()

    res.json({ success: true, message: 'Password changed successfully' })
  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Generate reset token (6-digit code)
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString()
    user.resetPasswordToken = resetCode
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000 // 10 minutes
    await user.save()

    console.log(`Password reset code for ${email}: ${resetCode}`)
    
    res.json({ 
      success: true, 
      message: 'Reset code sent to your email' 
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body
    const user = await User.findOne({ 
      email,
      resetPasswordToken: code,
      resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset code' })
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    user.updatedAt = new Date()
    await user.save()

    res.json({ 
      success: true, 
      message: 'Password reset successful' 
    })
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// @desc    Update notification preferences
// @route   PUT /api/auth/notifications
// @access  Private
const updateNotifications = async (req, res) => {
  try {
    const { emailNotifications, practiceReminders } = req.body
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    user.preferences = {
      ...user.preferences,
      emailNotifications: emailNotifications !== undefined ? emailNotifications : user.preferences?.emailNotifications,
      practiceReminders: practiceReminders !== undefined ? practiceReminders : user.preferences?.practiceReminders
    }
    user.updatedAt = new Date()
    await user.save()

    res.json({ 
      success: true, 
      message: 'Notification preferences updated',
      preferences: user.preferences
    })
  } catch (error) {
    console.error('Update notifications error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  updateNotifications
}