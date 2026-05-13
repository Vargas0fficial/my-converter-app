'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Footer from '@/components/Footer'

export default function Disclaimer() {
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
          <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">Disclaimer</h1>
          <p className="text-gray-500 text-sm mb-8">Last updated: January 2026</p>

          <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-3">1. Service Disclaimer</h2>
              <p>The service is provided on an "as-is" and "as-available" basis. ImagePDF Converter makes no representations or warranties of any kind, express or implied, regarding the operation of the website or the information, content, or materials included on the website.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-3">2. Limitation of Liability</h2>
              <p>In no event shall ImagePDF Converter, its owners, operators, employees, or agents be liable to you or any third party for any direct, indirect, incidental, special, or consequential damages (including lost profits, lost data, or disruption of service) arising from the use of or inability to use the website or service, even if we have been advised of the possibility of such damages.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-3">3. File Content Disclaimer</h2>
              <p>We do not assume any responsibility or liability for the content of uploaded files. Users are solely responsible for any and all content they upload to our service. We reserve the right to refuse service to any user whose content violates our terms or is deemed inappropriate.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-3">4. Conversion Accuracy</h2>
              <p>While we strive to provide accurate and high-quality file conversions, we do not guarantee that all conversions will be perfect or error-free. The quality of the output may depend on the quality of the input file and various other factors.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-3">5. Third-Party Links</h2>
              <p>Our website may contain links to third-party websites. We are not responsible for the content, accuracy, or practices of these external sites. Your use of third-party websites is at your own risk and subject to their terms and conditions.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-3">6. Availability and Downtime</h2>
              <p>While we strive to maintain continuous service availability, we do not guarantee uninterrupted access to our website or service. We may perform maintenance or updates that could result in temporary service disruptions.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-3">7. User Responsibility</h2>
              <p>Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account. Users agree not to use the service for any unlawful purposes or in any way that could damage, disable, or impair the service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-3">8. Changes to Disclaimer</h2>
              <p>We reserve the right to modify this disclaimer at any time. Changes will be effective immediately upon posting to the website. Your continued use of the service following the posting of revised terms means that you accept and agree to the changes.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-3">9. Contact</h2>
              <p>If you have questions about this disclaimer, please contact us at <a href="mailto:support@imagepdf.com" className="text-[#002a5c] hover:underline">support@imagepdf.com</a></p>
            </section>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}