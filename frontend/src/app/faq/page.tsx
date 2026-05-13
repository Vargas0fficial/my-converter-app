'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: 'What file formats do you support?',
      answer: 'We support JPG, PNG, and PDF files. You can convert images to PDF, merge multiple documents, and convert PDFs back to images.'
    },
    {
      question: 'What is the maximum file size?',
      answer: 'Each file must not exceed 5MB. If you need to convert larger files, please contact our support team.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes! All files are processed securely on our servers and are automatically deleted after conversion. We do not store or share your files with third parties.'
    },
    {
      question: 'How long does conversion take?',
      answer: 'Conversion is usually completed within seconds to a few minutes, depending on file size and complexity. You can track progress in real-time with our progress bar.'
    },
    {
      question: 'Can I merge multiple PDFs into one?',
      answer: 'Absolutely! You can upload multiple PDF files and merge them into a single PDF document. Our tool will preserve the order you specify.'
    },
    {
      question: 'Do you have a mobile app?',
      answer: 'Our website is fully responsive and works perfectly on mobile devices. No app download needed - just visit our site from your phone or tablet.'
    },
    {
      question: 'What compression quality options are available?',
      answer: 'We offer quality settings from 10% to 100%. Lower quality means smaller file size, while higher quality means better image clarity. Adjust based on your needs.'
    },
    {
      question: 'Do you offer batch processing?',
      answer: 'Yes! You can upload multiple files at once. Select as many files as you need, and we\'ll process them all together.'
    },
    {
      question: 'Is there a limit to how many files I can convert?',
      answer: 'No strict limit! As long as each file is under 5MB and your total upload doesn\'t exceed reasonable sizes, you can convert as many files as needed.'
    },
    {
      question: 'Do you charge for the service?',
      answer: 'ImagePDF Converter is completely free! No hidden fees, no subscriptions. Convert as many files as you want at no cost.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <Header currentPage="features" />

      <main className="flex-grow max-w-4xl mx-auto px-4 py-16 w-full">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-[#1a1a1a] mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600">Find answers to common questions about our service</p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left font-semibold text-[#1a1a1a] hover:bg-gray-50 transition-colors flex justify-between items-center"
              >
                <span>{faq.question}</span>
                <motion.svg
                  className="w-5 h-5 text-[#002a5c]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </motion.svg>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-200 px-6 py-4 bg-gray-50"
                  >
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Still have questions CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-6">Can't find the answer you're looking for? Contact our support team.</p>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/contact"
            className="inline-block bg-[#002a5c] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#001f44] transition"
          >
            Contact Support
          </motion.a>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}