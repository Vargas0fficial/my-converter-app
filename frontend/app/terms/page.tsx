'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function TermsOfService() {
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
        
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="space-y-6 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-3">1. Acceptance of Terms</h2>
            <p>By using Image-PDF Converter, you agree to these terms. If you do not agree, please do not use our service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-3">2. Usage Policy</h2>
            <p>You agree to use this tool only for legal document conversions. You are responsible for the content you upload.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-3">3. Limitation of Liability</h2>
            <p>We provide this service "as is." We are not liable for any data loss or errors during the conversion process.</p>
          </section>
        </div>
      </motion.div>
    </main>
  )
}