import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle, Mail } from 'lucide-react'

const faqs = [
  {
    question: "Is PrepAI free to use?",
    answer: "Yes! PrepAI offers a free tier with access to basic mock interviews, resume analysis, and coding practice. Premium features are available for advanced preparation."
  },
  {
    question: "How does the AI mock interview work?",
    answer: "Our AI interviewer uses OpenAI's GPT technology to generate realistic interview questions based on your chosen role and difficulty level."
  },
  {
    question: "What roles are covered?",
    answer: "We cover Frontend, Backend, Full Stack, Data Science, AI/ML, DevOps, and HR/Behavioral interviews."
  },
  {
    question: "Can I practice coding problems?",
    answer: "Absolutely! Our coding practice section includes 50+ DSA problems with real-time code execution and test case validation."
  },
  {
    question: "How is my resume analyzed?",
    answer: "Our resume analyzer checks your resume against ATS standards, extracts keywords, and provides actionable suggestions."
  },
  {
    question: "Can I track my progress?",
    answer: "Your dashboard shows detailed analytics including interview scores, coding accuracy, weekly streaks, and skill breakdowns."
  }
]

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section id="faq" className="py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-blue-500/10 rounded-full px-4 py-1.5 mb-4">
            <HelpCircle className="h-4 w-4 text-blue-500" />
            <span className="text-blue-400 text-sm font-medium">Got Questions?</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Questions</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need to know about PrepAI.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-800/50 transition-colors"
              >
                <span className="text-white font-medium">{faq.question}</span>
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-800"
                  >
                    <div className="px-6 py-4">
                      <p className="text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ