const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

// Register user - manual password hashing
const registerUser = async (req, res) => {
  try {
    console.log('📝 Registration request received for:', req.body.email)
    
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide name, email and password' 
      })
    }

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

    const user = new User({
      name,
      email,
      password: hashedPassword,
    })

    await user.save()

    const token = generateToken(user._id)

    console.log('✅ User registered successfully:', email)

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
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

// Login user
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

    const token = generateToken(user._id)

    console.log('✅ User logged in successfully:', email)

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
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

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    res.json({ success: true, user })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const logoutUser = async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' })
}

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
}