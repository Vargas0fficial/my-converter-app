'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Feedback() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedbackType: 'suggestion',
    message: '',
    rating: 5
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Feedback submitted:', formData)
    setSubmitted(true)
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        feedbackType: 'suggestion',
        message: '',
        rating: 5
      })
      setSubmitted(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <Header currentPage="contact" />

      <main className="flex-grow max-w-4xl mx-auto px-4 py-16 w-full">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-[#1a1a1a] mb-4">Send Us Feedback</h1>
          <p className="text-xl text-gray-600">Help us improve by sharing your thoughts and suggestions</p>
        </motion.div>

        {/* Feedback Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-8 border border-gray-200 shadow-lg"
        >
          {submitted ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8"
            >
              <div className="text-6xl mb-4">🙏</div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">Thank you for your feedback!</h3>
              <p className="text-gray-600">We really appreciate your input and will use it to improve our service.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#002a5c]"
                  placeholder="Your name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#002a5c]"
                  placeholder="your@email.com"
                />
              </div>

              {/* Feedback Type */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Feedback Type</label>
                <select
                  value={formData.feedbackType}
                  onChange={(e) => setFormData({ ...formData, feedbackType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#002a5c]"
                >
                  <option value="suggestion">💡 Suggestion</option>
                  <option value="bug">🐛 Bug Report</option>
                  <option value="feature">✨ Feature Request</option>
                  <option value="compliment">⭐ Compliment</option>
                  <option value="other">📝 Other</option>
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">How would you rate our service?</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      type="button"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className={`text-4xl transition-colors ${
                        star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Your Feedback</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#002a5c]"
                  placeholder="Tell us what you think... What can we improve? What do you love about our service?"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-[#002a5c] text-white font-bold py-3 rounded-lg hover:bg-[#001f44] transition"
              >
                Send Feedback
              </motion.button>
            </form>
          )}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 grid md:grid-cols-3 gap-8"
        >
          <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
            <div className="text-4xl mb-3">📧</div>
            <h3 className="font-bold mb-2">Email us directly</h3>
            <a href="mailto:feedback@imagepdf.com" className="text-[#002a5c] hover:underline text-sm">
              feedback@imagepdf.com
            </a>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="font-bold mb-2">Live Chat</h3>
            <p className="text-sm text-gray-600">Chat with our team during business hours</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
            <div className="text-4xl mb-3">🚀</div>
            <h3 className="font-bold mb-2">Feature Requests</h3>
            <p className="text-sm text-gray-600">Vote on features you'd like to see</p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}