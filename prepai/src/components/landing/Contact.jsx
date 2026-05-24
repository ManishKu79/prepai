import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setSubmitted(true)
      setLoading(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setSubmitted(false), 5000)
    }, 1000)
  }

  const contactInfo = [
    { icon: Mail, title: "Email", details: "support@prepai.com", link: "mailto:support@prepai.com", color: "text-blue-500" },
    { icon: Phone, title: "Phone", details: "+91 98765 43210", link: "tel:+919876543210", color: "text-green-500" },
    { icon: MapPin, title: "Office", details: "Bengaluru, India", link: "https://maps.google.com", color: "text-red-500" }
  ]

  return (
    <section id="contact" className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-blue-500/10 rounded-full px-4 py-1.5 mb-4">
            <Mail className="h-4 w-4 text-blue-500" />
            <span className="text-blue-400 text-sm font-medium">Get in Touch</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Let's <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Connect</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond within 24 hours.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Your Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Subject</label>
                <input type="text" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Message</label>
                <textarea rows="5" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 resize-none" required />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                {loading ? "Sending..." : <><Send className="h-4 w-4" /> Send Message</>}
              </button>
              {submitted && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-500/10 border border-green-500 rounded-lg p-3 text-center">
                  <p className="text-green-500 text-sm">✓ Message sent successfully! We'll get back to you soon.</p>
                </motion.div>
              )}
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h3 className="text-xl font-semibold text-white mb-6">Contact Information</h3>
              <div className="space-y-4">
                {contactInfo.map((info, idx) => (
                  <a key={idx} href={info.link} target={info.title === "Office" ? "_blank" : "_self"} rel={info.title === "Office" ? "noopener noreferrer" : ""} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 transition-colors group">
                    <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                      <info.icon className={`h-5 w-5 ${info.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">{info.title}</p>
                      <p className="text-white font-medium">{info.details}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-500/20">
              <h3 className="text-lg font-semibold text-white mb-2">Office Hours</h3>
              <p className="text-gray-400 text-sm">Monday - Friday: 9:00 AM - 6:00 PM IST</p>
              <p className="text-gray-400 text-sm mt-1">Saturday: 10:00 AM - 2:00 PM IST</p>
              <p className="text-gray-400 text-sm mt-1">Sunday: Closed</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact