'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-white p-8 md:p-24 text-[#1a1a1a] font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <Link href="/" className="text-[#002a5c] font-bold text-sm hover:underline mb-8 inline-block">
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="space-y-6 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-3">1. Data Collection</h2>
            <p>We do not store your files. All files uploaded are processed in real-time and are immediately deleted from our temporary memory after conversion.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-3">2. Security</h2>
            <p>We use industry-standard encryption to ensure that your documents are handled securely while being transmitted to our processing server.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-3">3. Third-Party Services</h2>
            <p>We do not sell or share your data with third parties. Your privacy is our top priority.</p>
          </section>
        </div>
      </motion.div>
    </main>
  )
}