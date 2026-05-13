'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Footer from '@/components/Footer'

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-50">
        <nav className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#002a5c]">ImagePDF</Link>
          <div className="flex gap-6 items-center">
            <Link href="/" className="text-gray-600 hover:text-[#002a5c] transition">Home</Link>
            <Link href="/features" className="text-gray-600 hover:text-[#002a5c] transition">Features</Link>
            <Link href="/contact" className="text-gray-600 hover:text-[#002a5c] transition">Contact</Link>
          </div>
        </nav>
      </header>

      <main className="flex-grow max-w-4xl mx-auto px-4 py-16 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-8 border border-gray-200"
        >
          <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">Terms of Service</h1>
          <p className="text-gray-500 text-sm mb-8">Last updated: January 2026</p>

          <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-3">1. Acceptance of Terms</h2>
              <p>By accessing and using ImagePDF Converter, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-3">2. Use License</h2>
              <p>Permission is granted to temporarily download one copy of the materials (information or software) on ImagePDF Converter for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
              <ul className="list-disc list-inside ml-4 space-y-2 mt-3">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to decompile or reverse engineer any software contained on the service</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-3">3. Disclaimer</h2>
              <p>The materials on ImagePDF Converter are provided on an 'as is' basis. ImagePDF makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-3">4. Limitations</h2>
              <p>In no event shall ImagePDF or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on ImagePDF Converter, even if ImagePDF or an authorized representative has been notified orally or in writing of the possibility of such damage.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-3">5. Accuracy of Materials</h2>
              <p>The materials appearing on ImagePDF Converter could include technical, typographical, or photographic errors. ImagePDF does not warrant that any of the materials on its website are accurate, complete, or current. ImagePDF may make changes to the materials contained on its website at any time without notice.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-3">6. Links</h2>
              <p>ImagePDF has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by ImagePDF of the site. Use of any such linked website is at the user's own risk.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-3">7. Modifications</h2>
              <p>ImagePDF may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-3">8. Governing Law</h2>
              <p>These terms and conditions are governed by and construed in accordance with the laws of your jurisdiction and you irrevocably submit to the exclusive jurisdiction of the courts located in that location.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-3">Contact Us</h2>
              <p>If you have any questions about these Terms of Service, please contact us at <a href="mailto:support@imagepdf.com" className="text-[#002a5c] hover:underline">support@imagepdf.com</a></p>
            </section>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}