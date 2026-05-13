'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import type { Variants } from 'framer-motion'
import Header from '@/components/Header'
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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      } as any,
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col">
      {/* ✅ Using Reusable Header */}
      <Header currentPage="features" />

      <main className="flex-grow max-w-6xl mx-auto px-4 py-16 w-full">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <motion.h1
            className="text-5xl sm:text-6xl font-bold text-[#1a1a1a] mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Powerful Features
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Everything you need to convert and merge documents
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8 mb-20"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{
                y: -8,
                boxShadow: "0 20px 40px rgba(0, 42, 92, 0.15)",
              }}
              className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-blue-200 transition-all duration-300 cursor-pointer"
            >
              {/* ✅ Centered Icon */}
              <motion.div
                className="text-5xl mb-4 flex justify-center"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-bold mb-2 text-[#1a1a1a] text-center">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed text-center">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ✅ BEAUTIFUL CTA with Animated Gradient */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl"
        >
          {/* Static Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#002a5c] to-blue-600" />

          {/* Animated Blob - Left */}
          <motion.div
            animate={{
              opacity: [0.3, 0.6, 0.3],
              x: [-100, 50, -100],
              y: [0, 20, 0],
            }}
            transition={{
              duration: 4,
              ease: "easeInOut",
              repeat: Infinity,
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-black/20 rounded-full blur-3xl"
          />

          {/* Animated Blob - Right */}
          <motion.div
            animate={{
              opacity: [0.2, 0.5, 0.2],
              x: [100, -50, 100],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 5,
              ease: "easeInOut",
              repeat: Infinity,
              delay: 0.5,
            }}
            className="absolute right-0 bottom-0 w-80 h-80 bg-white/10 rounded-full blur-3xl"
          />

          {/* Content */}
          <div className="relative z-10 px-6 sm:px-12 py-16 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                Ready to get started?
              </h2>
              <p className="text-lg sm:text-xl mb-8 opacity-95 max-w-2xl mx-auto">
                Convert your first document today, absolutely free
              </p>

              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 bg-white text-[#002a5c] font-bold py-4 px-10 rounded-full hover:bg-blue-50 transition-all duration-300 shadow-2xl"
                >
                  <span>Go to Converter</span>
                  <motion.svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </motion.svg>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}