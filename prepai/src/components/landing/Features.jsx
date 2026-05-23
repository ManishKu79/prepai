import { motion } from 'framer-motion'
import { 
  Brain, 
  FileSearch, 
  Code2, 
  Users, 
  BarChart3, 
  Target,
  Sparkles,
  Clock,
  Trophy,
  Shield,
  Zap,
  Globe
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: "AI Mock Interviews",
    description: "Practice with advanced AI that simulates real HR and technical interviews. Get instant, personalized feedback on your responses.",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    iconColor: "text-blue-500",
    features: ["Real-time feedback", "Multiple roles", "Unlimited practice"]
  },
  {
    icon: FileSearch,
    title: "Resume Analyzer",
    description: "Get ATS-friendly suggestions and improve your resume to stand out to recruiters. Score your resume against industry standards.",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
    iconColor: "text-purple-500",
    features: ["ATS score", "Keyword extraction", "Improvement tips"]
  },
  {
    icon: Code2,
    title: "Coding Practice",
    description: "Solve DSA problems with real-time code execution and test case validation. Practice with 50+ coding challenges.",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
    iconColor: "text-green-500",
    features: ["Multiple languages", "Test cases", "Performance metrics"]
  },
  {
    icon: Users,
    title: "HR Interview Prep",
    description: "Master behavioral questions and communication skills with scenario-based practice. Build confidence for real interviews.",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-500/10",
    iconColor: "text-orange-500",
    features: ["STAR method", "Common questions", "Feedback analysis"]
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Track your progress with detailed analytics and improvement suggestions. Visualize your growth over time.",
    color: "from-indigo-500 to-purple-500",
    bgColor: "bg-indigo-500/10",
    iconColor: "text-indigo-500",
    features: ["Progress tracking", "Skill breakdown", "Streak monitoring"]
  },
  {
    icon: Target,
    title: "Placement Focused",
    description: "Content designed specifically for campus placements and entry-level positions. Learn what recruiters actually look for.",
    color: "from-rose-500 to-orange-500",
    bgColor: "bg-rose-500/10",
    iconColor: "text-rose-500",
    features: ["Company specific", "Role based", "Real scenarios"]
  }
]

const stats = [
  { value: "50K+", label: "Interviews Conducted", icon: Brain },
  { value: "10K+", label: "Students Placed", icon: Trophy },
  { value: "500+", label: "Partner Companies", icon: Globe },
  { value: "95%", label: "Success Rate", icon: Shield }
]

const Features = () => {
  return (
    <section id="features" className="py-24 px-4 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-transparent pointer-events-none" />
      
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-blue-500/10 rounded-full px-4 py-1.5 mb-4">
            <Sparkles className="h-4 w-4 text-blue-500" />
            <span className="text-blue-400 text-sm font-medium">Why Choose PrepAI</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              succeed
            </span>
          </h2>
          
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Comprehensive preparation tools designed by placement experts to help you crack your dream job
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group relative bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all duration-300"
            >
              {/* Gradient Hover Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
              
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`h-7 w-7 ${feature.iconColor}`} />
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                {feature.title}
              </h3>
              
              {/* Description */}
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                {feature.description}
              </p>
              
              {/* Feature Tags */}
              <div className="flex flex-wrap gap-2">
                {feature.features.map((tag, tagIdx) => (
                  <span key={tagIdx} className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-400">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-gray-800"
        >
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center group">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="flex justify-center items-center gap-8 mt-12 pt-8 flex-wrap"
        >
          <p className="text-gray-500 text-sm">Trusted by students from</p>
          <div className="flex gap-6 flex-wrap justify-center">
            {["IITs", "NITs", "IIITs", "BITS", "VIT", "SRM"].map((college, idx) => (
              <span key={idx} className="text-gray-400 text-sm font-medium hover:text-white transition-colors">
                {college}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Features