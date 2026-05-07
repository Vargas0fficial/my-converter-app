'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link' 

export default function Home() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [isMergeMode, setIsMergeMode] = useState(false)
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const handleExternalDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)])
      e.dataTransfer.clearData()
    }
  }

  const onDragStart = (index: number) => setDraggedItemIndex(index)
  const onDragEnd = () => setDraggedItemIndex(null)

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedItemIndex === null || draggedItemIndex === index) return
    const newFiles = [...selectedFiles]
    const itemToMove = newFiles[draggedItemIndex]
    newFiles.splice(draggedItemIndex, 1)
    newFiles.splice(index, 0, itemToMove)
    setDraggedItemIndex(index)
    setSelectedFiles(newFiles)
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleConvert = async () => {
    if (selectedFiles.length === 0) return alert("Pumili muna ng files!")
    setLoading(true)
    setStatus(isMergeMode ? 'Merging PDFs...' : 'Processing...')

    const formData = new FormData()
    const isPDF = selectedFiles[0].type === 'application/pdf'
    let endpoint = isPDF && isMergeMode ? 'merge-pdfs' : (isPDF ? 'pdf-to-images' : 'images-to-pdf')
    
    selectedFiles.forEach(file => formData.append('files', file))

    try {
      const response = await fetch(`http://localhost:8000/convert/${endpoint}`, {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) throw new Error('Action failed')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = isPDF && isMergeMode ? "merged_document.pdf" : (isPDF ? "converted_images.zip" : "converted_pdfs.zip")
      document.body.appendChild(a)
      a.click()
      
      // I-reset ang UI pagkatapos ng download
      setTimeout(() => { 
        window.URL.revokeObjectURL(url)
        a.remove()
        
        // Paglilinis ng state para bumalik sa main page look
        setSelectedFiles([])
        setIsMergeMode(false)
        setStatus('Success!')
      }, 1500) 

    } catch (error: any) {
      setStatus(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <main className="flex-grow flex flex-col items-center justify-center p-6 text-[#1a1a1a]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl flex flex-col"
        >
          <h2 className="text-4xl font-bold mb-8 text-left md:text-center tracking-tight">Drag and drop</h2>
          
          <motion.div 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="relative group"
          >
            <div 
              onDrop={handleExternalDrop}
              onDragOver={(e) => e.preventDefault()}
              className={`border-2 border-dashed border-[#002a5c] rounded-lg p-12 flex flex-col items-center justify-center text-center transition-all duration-300 ${selectedFiles.length > 0 ? 'bg-gray-50 border-solid' : 'bg-white hover:bg-blue-50/30'}`}
            >
              <motion.div 
                animate={{ y: [0, -5, 0] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="mb-4"
              >
                <svg className="w-16 h-16 text-[#002a5c]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="12" y1="18" x2="12" y2="12"></line>
                  <line x1="9" y1="15" x2="15" y2="15"></line>
                </svg>
              </motion.div>

              <div className="mb-6">
                <p className="text-sm font-medium mb-1 text-gray-700">Drag and drop files into this box or use the button below.</p>
                <p className="text-[12px] text-gray-500 font-bold uppercase tracking-tight">FORMATS ACCEPTED: JPG, PDF, PNG</p>
                <p className="text-[12px] text-gray-400">File size must not exceed 5 MB.</p>
              </div>

              <div className="relative inline-block">
                <input type="file" multiple onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <motion.button 
                  whileHover={{ backgroundColor: '#f9fafb' }}
                  className="px-8 py-2 border-2 border-[#002a5c] text-[#002a5c] font-bold rounded-md transition-colors"
                >
                  Select files
                </motion.button>
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {selectedFiles.length > 1 && selectedFiles[0].type === 'application/pdf' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-center space-x-3 cursor-pointer" 
                onClick={() => setIsMergeMode(!isMergeMode)}
              >
                <input type="checkbox" checked={isMergeMode} readOnly className="w-4 h-4 accent-[#002a5c]" />
                <span className="text-sm font-semibold text-[#002a5c]">Merge documents into a single PDF?</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {selectedFiles.length > 0 && (
              <motion.button 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConvert}
                disabled={loading}
                className="mt-4 w-full py-3 bg-[#002a5c] text-white rounded-md font-bold hover:bg-[#001f44] disabled:opacity-50 transition-all shadow-md relative overflow-hidden"
              >
                {loading ? (
                  <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                    Processing...
                  </motion.span>
                ) : 'Start Upload & Convert'}
              </motion.button>
            )}
          </AnimatePresence>

          <div className="mt-6 space-y-2">
            {selectedFiles.length > 0 && (
              <p className="text-[10px] font-bold uppercase text-gray-400">Order of documents (Drag to reorder):</p>
            )}
            <AnimatePresence mode="popLayout">
              {selectedFiles.map((file, index) => (
                <motion.div 
                  key={`${file.name}-${index}`}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  draggable
                  onDragStart={() => onDragStart(index)}
                  onDragOver={(e) => onDragOver(e, index)}
                  onDragEnd={onDragEnd}
                  className={`flex items-center justify-between p-3 bg-white border border-gray-200 rounded shadow-sm cursor-grab active:cursor-grabbing hover:border-blue-300 transition-shadow ${draggedItemIndex === index ? 'opacity-30' : 'opacity-100'}`}
                >
                  <div className="flex items-center text-xs font-semibold">
                    <span className="text-gray-300 mr-3 italic"># {index + 1}</span>
                    <span className="truncate max-w-[300px]">{file.name}</span>
                  </div>
                  <button onClick={() => removeFile(index)} className="text-gray-400 hover:text-red-500 text-sm p-1 transition-colors">
                    ✕
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {status && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-center text-xs font-mono text-blue-600 italic font-bold"
            >
              Status: {status}
            </motion.p>
          )}
        </motion.div>
      </main>

      <footer className="w-full py-6 border-t border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-gray-400 text-[11px] font-bold uppercase tracking-widest">
          <div className="mb-4 md:mb-0 flex items-center space-x-4">
            <Link href="/terms" className="hover:text-[#002a5c] cursor-pointer transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-[#002a5c] cursor-pointer transition-colors">
              Privacy Policy
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <span>© 2026 Image-PDF Converter</span>
            <span className="text-gray-200">|</span>
            <span className="text-[#002a5c]">Created By: Vargas</span>
          </div>
        </div>
      </footer>
    </div>
  )
}