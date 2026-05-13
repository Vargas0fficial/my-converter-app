'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'
import Footer from '@/components/Footer'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formData)
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' })
      setSubmitted(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-50">
        <nav className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#002a5c]">ImagePDF</Link>
          <div className="flex gap-6 items-center">
            <Link href="/" className="text-gray-600 hover:text-[#002a5c] transition">Home</Link>
            <Link href="/features" className="text-gray-600 hover:text-[#002a5c] transition">Features</Link>
            <Link href="/contact" className="text-[#002a5c] font-semibold">Contact</Link>
          </div>
        </nav>
      </header>

      <main className="flex-grow max-w-4xl mx-auto px-4 py-16 w-full">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-[#1a1a1a] mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600">Have questions or feedback? We'd love to hear from you</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Email */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-8 border border-gray-200 text-center"
          >
            <div className="text-4xl mb-4">📧</div>
            <h3 className="font-bold mb-2">Email</h3>
            <a href="mailto:support@imagepdf.com" className="text-[#002a5c] hover:underline">
              support@imagepdf.com
            </a>
          </motion.div>

          {/* Response Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg p-8 border border-gray-200 text-center"
          >
            <div className="text-4xl mb-4">⏱️</div>
            <h3 className="font-bold mb-2">Response Time</h3>
            <p className="text-gray-600">Usually within 24 hours</p>
          </motion.div>

          {/* Availability */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg p-8 border border-gray-200 text-center"
          >
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="font-bold mb-2">Available</h3>
            <p className="text-gray-600">24/7 Support</p>
          </motion.div>
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-8 border border-gray-200 shadow-lg"
        >
          {submitted ? (
            <div className="text-center">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">Thank you!</h3>
              <p className="text-gray-600">We've received your message and will get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
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

              <div className="mb-6">
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

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-700">Message</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#002a5c]"
                  placeholder="Tell us how we can help..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#002a5c] text-white font-bold py-3 rounded-lg hover:bg-[#001f44] transition"
              >
                Send Message
              </button>
            </form>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}