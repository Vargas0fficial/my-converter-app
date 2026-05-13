'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Footer from '@/components/Footer'

export default function Features() {
  const features = [
    {
      icon: '🖼️',
      title: 'Image to PDF',
      description: 'Convert JPG, PNG images to high-quality PDF documents'
    },
    {
      icon: '📄',
      title: 'Merge Documents',
      description: 'Combine multiple images or PDFs into a single file'
    },
    {
      icon: '⚙️',
      title: 'Quality Control',
      description: 'Adjust compression and quality settings for optimal file size'
    },
    {
      icon: '📱',
      title: 'Mobile Friendly',
      description: 'Works seamlessly on desktop, tablet, and mobile devices'
    },
    {
      icon: '🔒',
      title: 'Secure Processing',
      description: 'Your files are processed securely and deleted automatically'
    },
    {
      icon: '⚡',
      title: 'Fast Conversion',
      description: 'Quick processing with real-time progress tracking'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-50">
        <nav className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#002a5c]">ImagePDF</Link>
          <div className="flex gap-6 items-center">
            <Link href="/" className="text-gray-600 hover:text-[#002a5c] transition">Home</Link>
            <Link href="/features" className="text-[#002a5c] font-semibold">Features</Link>
            <Link href="/contact" className="text-gray-600 hover:text-[#002a5c] transition">Contact</Link>
          </div>
        </nav>
      </header>

      <main className="flex-grow max-w-6xl mx-auto px-4 py-16 w-full">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-[#1a1a1a] mb-4">Powerful Features</h1>
          <p className="text-xl text-gray-600">Everything you need to convert and merge documents</p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-lg p-8 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-[#1a1a1a]">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#002a5c] to-blue-600 rounded-lg p-12 text-white text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-lg mb-6 opacity-90">Convert your first document today, absolutely free</p>
          <Link
            href="/"
            className="inline-block bg-white text-[#002a5c] font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition"
          >
            Go to Converter
          </Link>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}