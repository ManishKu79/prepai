# 🚀 PrepAI - AI-Powered Interview Preparation Platform

[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-brightgreen.svg)](https://mongodb.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-API-orange.svg)](https://openai.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Practice interviews before your placement rounds.**  
> An AI-powered platform to help students crack their dream placements with mock interviews, resume analysis, coding practice, and more.

---

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**PrepAI** is a comprehensive interview preparation platform designed specifically for college students preparing for campus placements. It leverages AI to provide personalized mock interviews, resume analysis, coding practice, and performance tracking.

### Key Highlights
- 🤖 **AI-Powered Mock Interviews** with OpenAI GPT
- 📄 **Resume Analyzer** with ATS scoring
- 💻 **Coding Practice** with 50+ DSA problems
- 👥 **Peer Code Review** system
- 🏆 **Leaderboard** to compete with peers
- 📊 **Performance Analytics** dashboard
- ✉️ **Email Notifications** for practice reminders

---

## ✨ Features

### 1. Authentication System
- Secure JWT-based authentication
- User registration and login
- Password reset with email verification
- Protected routes for authenticated users

### 2. Dashboard
- Real-time statistics (interviews completed, coding accuracy, weekly streak)
- Interactive progress charts
- Recent activity feed
- Skills breakdown visualization
- Quick action buttons

### 3. AI Mock Interview
- Role-based interviews (Frontend, Backend, Full Stack, HR)
- 3 difficulty levels (Beginner, Intermediate, Advanced)
- Configurable question count (3, 5, or 10 questions)
- 60-second timer per question
- AI-generated questions using OpenAI
- Instant feedback and scoring
- Detailed performance analysis

### 4. Resume Analyzer
- PDF resume upload with drag-and-drop
- ATS (Applicant Tracking System) score calculation
- Skills extraction and keyword detection
- Personalized improvement suggestions
- Resume optimization tips

### 5. Coding Practice
- 50+ DSA problems with categories
- Difficulty filtering (Easy, Medium, Hard)
- Built-in code editor
- Test case validation
- AI problem generator for custom problems
- Submission history tracking

### 6. Peer Code Review
- Share code solutions with community
- Comment and feedback system
- Like/unlike functionality
- Code snippet viewing

### 7. Leaderboard
- Global ranking of top performers
- Score based on interviews and coding
- User rank tracking
- Top contributors showcase

### 8. Profile & Settings
- Edit profile information
- Manage skills
- Change password
- Email notification preferences
- Dark mode toggle

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| Vite | Build tool |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Zustand | State Management |
| React Router DOM | Navigation |
| Axios | API calls |
| Recharts | Charts & graphs |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | Web framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password hashing |
| OpenAI API | AI integration |
| Nodemailer | Email service |
| Multer | File upload |

---

## 📸 Screenshots

### Landing Page
![Landing Page](./screenshots/landing.png)
*Hero section with tagline and CTA buttons*

### Dashboard
![Dashboard](./screenshots/dashboard.png)
*User dashboard with stats, charts, and activity feed*

### AI Mock Interview
![Mock Interview](./screenshots/mock-interview.png)
*AI-powered interview with timer and feedback*

### Resume Analyzer
![Resume Analyzer](./screenshots/resume-analyzer.png)
*ATS score, skills extraction, and suggestions*

### Coding Practice
![Coding Practice](./screenshots/coding-practice.png)
*Code editor with problem description and test cases*

### Leaderboard
![Leaderboard](./screenshots/leaderboard.png)
*Global ranking of top performers*

### Code Review
![Code Review](./screenshots/code-review.png)
*Peer code review system*

### Settings
![Settings](./screenshots/settings.png)
*Profile management and preferences*

---

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- OpenAI API key

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/prepai.git
cd prepai
