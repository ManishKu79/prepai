const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: null,
  },
  skills: [String],
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    darkMode: { type: Boolean, default: true },
    practiceReminders: { type: Boolean, default: true },
  },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
  lastActive: { type: Date, default: Date.now },
  stats: {
    totalInterviews: { type: Number, default: 0 },
    totalCodingSubmissions: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// NO PRE-SAVE HOOKS - handle password hashing in controllers

// Compare password method
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User', userSchema)