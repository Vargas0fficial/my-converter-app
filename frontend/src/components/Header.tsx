import Link from 'next/link'
import { motion } from 'framer-motion'

interface HeaderProps {
  currentPage?: 'features' | 'contact' | 'terms' | 'privacy' | 'disclaimer'
}

export default function Header({ currentPage }: HeaderProps) {
  const pages = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/features' },
    { name: 'Contact', href: '/contact' }
  ]

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 shadow-sm">
      <nav className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-[#002a5c] to-blue-600 bg-clip-text text-transparent">
            ImagePDF
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-6 items-center"
        >
          {pages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className={`transition duration-300 ${
                currentPage === page.href.slice(1) || (page.href === '/' && !currentPage)
                  ? 'text-[#002a5c] font-semibold'
                  : 'text-gray-600 hover:text-[#002a5c]'
              }`}
            >
              {page.name}
            </Link>
          ))}
        </motion.div>
      </nav>
    </header>
  )
}