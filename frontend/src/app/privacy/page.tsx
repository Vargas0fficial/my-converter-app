'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      {/* ✅ Using Reusable Header */}
      <Header currentPage="privacy" />

      <main className="flex-grow max-w-4xl mx-auto px-4 py-16 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-8 border border-gray-200"
        >
          <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">Privacy Policy</h1>
          <p className="text-gray-500 text-sm mb-8">Last updated: January 2026</p>

          <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-3">1. Introduction</h2>
              <p>ImagePDF Converter ("we" or "us" or "our") operates the website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our service and the choices you have associated with that data.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-3">2. Information Collection and Use</h2>
              <p>We collect several different types of information for various purposes to provide and improve our service to you.</p>
              <h3 className="text-lg font-semibold text-[#1a1a1a] mt-3 mb-2">Types of Data Collected:</h3>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong>Personal Data:</strong> While using our service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include, but is not limited to:
                  <ul className="list-disc list-inside ml-8 mt-2 space-y-1">
                    <li>Email address</li>
                    <li>First name and last name</li>
                    <li>Phone number</li>
                    <li>Address, State, Province, ZIP/Postal code, City</li>
                  </ul>
                </li>
                <li><strong>Usage Data:</strong> We may also collect information about how the service is accessed and used ("Usage Data"), including browser type and version, IP address, pages visited, time and date of visit, and other diagnostic data.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-3">3. Use of Data</h2>
              <p>ImagePDF Converter uses the collected data for various purposes:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>To provide and maintain our service</li>
                <li>To notify you about changes to our service</li>
                <li>To allow you to participate in interactive features of our service when you choose to do so</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information so that we can improve our service</li>
                <li>To monitor the usage of our service</li>
                <li>To detect, prevent and address technical issues</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-3">4. Security of Data</h2>
              <p>The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-3">5. Changes to This Privacy Policy</h2>
              <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-3">6. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@imagepdf.com" className="text-[#002a5c] hover:underline">support@imagepdf.com</a></p>
            </section>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}