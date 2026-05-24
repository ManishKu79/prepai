const nodemailer = require('nodemailer')

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// Send welcome email
const sendWelcomeEmail = async (email, name) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to PrepAI! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #3b82f6;">Welcome to PrepAI, ${name}! 🚀</h1>
          <p>Thank you for joining PrepAI - your AI-powered interview preparation platform.</p>
          <h3>Getting Started:</h3>
          <ul>
            <li>📝 Upload your resume for ATS analysis</li>
            <li>🎤 Practice with AI mock interviews</li>
            <li>💻 Solve coding challenges</li>
            <li>📊 Track your progress</li>
          </ul>
          <p>Start your placement preparation journey today!</p>
          <a href="http://localhost:3000/dashboard" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Dashboard</a>
          <p style="margin-top: 20px; color: #666;">Best regards,<br>PrepAI Team</p>
        </div>
      `
    }
    await transporter.sendMail(mailOptions)
    console.log(`Welcome email sent to ${email}`)
  } catch (error) {
    console.error('Email send error:', error)
  }
}

// Send daily practice reminder
const sendPracticeReminder = async (email, name, stats) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '⏰ Daily Practice Reminder - PrepAI',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #3b82f6;">Practice Reminder, ${name}! 💪</h1>
          <p>Don't let your preparation streak break!</p>
          <h3>Your Stats:</h3>
          <ul>
            <li>📊 Interviews Completed: ${stats.interviews || 0}</li>
            <li>💻 Coding Problems: ${stats.coding || 0}</li>
            <li>🔥 Current Streak: ${stats.streak || 0} days</li>
          </ul>
          <p>Ready to improve today?</p>
          <a href="http://localhost:3000/dashboard" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Start Practicing</a>
          <p style="margin-top: 20px; color: #666;">Keep up the great work!<br>PrepAI Team</p>
        </div>
      `
    }
    await transporter.sendMail(mailOptions)
    console.log(`Reminder email sent to ${email}`)
  } catch (error) {
    console.error('Email send error:', error)
  }
}

// Send code review notification
const sendCodeReviewNotification = async (email, name, reviewData) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '📝 New Code Review Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #3b82f6;">New Code Review! 👨‍💻</h1>
          <p><strong>${reviewData.authorName}</strong> has submitted code for review.</p>
          <h3>Problem: ${reviewData.problemTitle}</h3>
          <p>Help improve the code by providing feedback!</p>
          <a href="http://localhost:3000/dashboard/code-review/${reviewData.reviewId}" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Code</a>
          <p style="margin-top: 20px; color: #666;">Your feedback helps the community grow!<br>PrepAI Team</p>
        </div>
      `
    }
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('Email send error:', error)
  }
}

module.exports = {
  sendWelcomeEmail,
  sendPracticeReminder,
  sendCodeReviewNotification
}