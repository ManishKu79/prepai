import { motion } from 'framer-motion'
import { UserPlus, FileText, Mic, Code2, BarChart3, Briefcase } from 'lucide-react'

const steps = [
  {
    number: "01",
    title: "Create Account",
    description: "Sign up for free and set up your profile. Choose your target role and preferred difficulty level.",
    icon: UserPlus,
    color: "from-blue-500 to-cyan-500",
    duration: "2 minutes"
  },
  {
    number: "02",
    title: "Upload Resume",
    description: "Upload your resume for AI-powered ATS analysis. Get instant feedback on improvements.",
    icon: FileText,
    color: "from-purple-500 to-pink-500",
    duration: "3 minutes"
  },
  {
    number: "03",
    title: "Practice Interviews",
    description: "Take AI-powered mock interviews with real-time feedback. Practice HR, technical, and behavioral rounds.",
    icon: Mic,
    color: "from-green-500 to-emerald-500",
    duration: "10-20 minutes"
  },
  {
    number: "04",
    title: "Solve Coding Problems",
    description: "Practice DSA problems with our code editor. Get instant test results and performance analysis.",
    icon: Code2,
    color: "from-orange-500 to-red-500",
    duration: "15-30 minutes"
  },
  {
    number: "05",
    title: "Track Progress",
    description: "Monitor your improvement with detailed analytics and performance metrics across all skills.",
    icon: BarChart3,
    color: "from-indigo-500 to-purple-500",
    duration: "Real-time"
  },
  {
    number: "06",
    title: "Get Placed",
    description: "Apply with confidence! Our students have successfully cracked offers at top companies.",
    icon: Briefcase,
    color: "from-rose-500 to-orange-500",
    duration: "Goal achieved!"
  }
]

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 px-4 bg-gray-900/30">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-blue-500/10 rounded-full px-4 py-1.5 mb-4">
            <span className="text-blue-400 text-sm font-medium">Simple Process</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How{' '}
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              PrepAI Works
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            From signup to success - follow these simple steps to ace your placement interviews
          </p>
        </motion.div>

        <div className="space-y-8">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-2xl group-hover:scale-110 transition-transform`}>
                  {step.number}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{step.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">⏱️ {step.duration}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks