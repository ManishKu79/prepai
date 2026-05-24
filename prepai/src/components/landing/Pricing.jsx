import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Sparkles, Zap, Crown, X } from 'lucide-react'
import { Link } from 'react-router-dom'

const plans = [
  {
    name: "Free",
    price: 0,
    period: "forever",
    description: "Perfect for getting started",
    icon: Sparkles,
    color: "from-gray-500 to-gray-600",
    features: [
      { name: "5 Mock Interviews/month", included: true },
      { name: "Basic Resume Analysis", included: true },
      { name: "10 Coding Problems", included: true },
      { name: "Basic Analytics", included: true },
      { name: "AI Question Generation", included: false },
      { name: "Company Specific Prep", included: false },
      { name: "Priority Support", included: false }
    ],
    buttonText: "Get Started",
    buttonVariant: "outline"
  },
  {
    name: "Pro",
    price: 19,
    period: "month",
    description: "Best for serious aspirants",
    icon: Zap,
    color: "from-blue-500 to-cyan-500",
    popular: true,
    features: [
      { name: "Unlimited Mock Interviews", included: true },
      { name: "Advanced Resume Analysis", included: true },
      { name: "100+ Coding Problems", included: true },
      { name: "Advanced Analytics", included: true },
      { name: "AI Question Generation", included: true },
      { name: "Company Specific Prep", included: true },
      { name: "Email Support", included: true }
    ],
    buttonText: "Start Pro Trial",
    buttonVariant: "primary"
  },
  {
    name: "Enterprise",
    price: 49,
    period: "month",
    description: "For teams and organizations",
    icon: Crown,
    color: "from-purple-500 to-pink-500",
    features: [
      { name: "Everything in Pro", included: true },
      { name: "Custom Question Bank", included: true },
      { name: "Team Analytics", included: true },
      { name: "Priority Support", included: true },
      { name: "API Access", included: true },
      { name: "Dedicated Account Manager", included: true }
    ],
    buttonText: "Contact Sales",
    buttonVariant: "outline"
  }
]

const Pricing = () => {
  const [billing, setBilling] = useState('monthly')

  return (
    <section id="pricing" className="py-24 px-4 bg-gray-900/30">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-blue-500/10 rounded-full px-4 py-1.5 mb-4">
            <span className="text-blue-400 text-sm font-medium">Pricing Plans</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Choose the{' '}
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Right Plan
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Start free and upgrade when you're ready. No hidden fees.
          </p>

          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm ${billing === 'monthly' ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
            <button
              onClick={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-14 h-7 bg-gray-700 rounded-full transition-colors"
            >
              <div className={`absolute top-1 w-5 h-5 bg-blue-500 rounded-full transition-transform ${billing === 'yearly' ? 'translate-x-8' : 'translate-x-1'}`} />
            </button>
            <span className={`text-sm ${billing === 'yearly' ? 'text-white' : 'text-gray-500'}`}>
              Yearly
              <span className="ml-1 text-xs text-green-500">Save 20%</span>
            </span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className={`relative bg-gray-900 rounded-2xl overflow-hidden border transition-all ${
                plan.popular ? 'border-blue-500 shadow-lg shadow-blue-500/10' : 'border-gray-800 hover:border-gray-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">Most Popular</div>
              )}
              <div className="p-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${plan.color} flex items-center justify-center mb-4`}>
                  <plan.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <p className="text-gray-400 text-sm mt-1">{plan.description}</p>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold text-white">
                    ${billing === 'yearly' ? Math.round(plan.price * 0.8 * 12) : plan.price}
                  </span>
                  <span className="text-gray-400">/{billing === 'yearly' ? 'year' : plan.period}</span>
                </div>
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2">
                      {feature.included ? (
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-gray-600 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${feature.included ? 'text-gray-300' : 'text-gray-600'}`}>{feature.name}</span>
                    </div>
                  ))}
                </div>
                <Link to="/register">
                  <button className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    plan.buttonVariant === 'primary'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'border border-gray-700 text-gray-300 hover:bg-gray-800'
                  }`}>
                    {plan.buttonText}
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Pricing