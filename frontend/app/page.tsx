'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link' 

// Thumbnail component: Ibinalik sa w-full para mag-fit sa Grid box
const Thumbnail = ({ file }: { file: File }) => {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

  if (file.type === 'application/pdf') {
    return (
      <div className="w-full aspect-[3/4] bg-red-50 flex flex-col items-center justify-center border-b border-red-100">
        <svg className="w-10 h-10 text-red-500 mb-1" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
        </svg>
        <span className="text-[10px] font-black text-red-600 uppercase">PDF</span>
      </div>
    );
  }

  return (
    <div className="w-full aspect-[3/4] bg-gray-50 overflow-hidden border-b border-gray-100">
      {preview ? (
        <img src={preview} alt="preview" className="w-full h-full object-contain p-1" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

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
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/convert/${endpoint}`, {
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
      
      setTimeout(() => { 
        window.URL.revokeObjectURL(url)
        a.remove()
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
          className="w-full max-w-xl flex flex-col mx-auto"
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
                {/* DITO PINALITAN ANG ICON PARA MAGING KAMUKHA NG NASA IMAGE MO */}
                <svg className="w-16 h-16 text-[#002a5c]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 16V2M12 2L7 7M12 2L17 7" />
                  <path d="M20 12V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V12" />
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

          {/* Merge Mode Toggle */}
          <AnimatePresence>
            {selectedFiles.length > 1 && selectedFiles[0].type === 'application/pdf' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-center space-x-3 cursor-pointer shadow-sm" 
                onClick={() => setIsMergeMode(!isMergeMode)}
              >
                <input type="checkbox" checked={isMergeMode} readOnly className="w-4 h-4 accent-[#002a5c]" />
                <span className="text-sm font-semibold text-[#002a5c]">Merge documents into a single PDF?</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Button */}
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
                className="mt-6 w-full py-4 bg-[#002a5c] text-white rounded-md font-bold hover:bg-[#001f44] disabled:opacity-50 transition-all shadow-md relative overflow-hidden"
              >
                {loading ? (
                  <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                    Processing...
                  </motion.span>
                ) : 'Start Upload & Convert'}
              </motion.button>
            )}
          </AnimatePresence>

          {/* GRID LAYOUT - Dito binago ang listahan para maging Gallery style */}
          <div className="mt-8">
            {selectedFiles.length > 0 && (
              <p className="text-[11px] font-bold uppercase text-gray-400 tracking-wider mb-4">Order of documents (Drag to reorder):</p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <AnimatePresence mode="popLayout">
                {selectedFiles.map((file, index) => (
                  <motion.div 
                    key={`${file.name}-${index}`}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    draggable
                    onDragStart={() => onDragStart(index)}
                    onDragOver={(e) => onDragOver(e, index)}
                    onDragEnd={onDragEnd}
                    className={`group relative flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:border-blue-400 transition-all ${draggedItemIndex === index ? 'opacity-0' : 'opacity-100'}`}
                  >
                    {/* Image Area */}
                    <Thumbnail file={file} />

                    {/* Badge & Remove Button */}
                    <div className="absolute top-1 left-1 bg-white/90 border border-gray-200 text-gray-500 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                      #{index + 1}
                    </div>
                    <button 
                      onClick={() => removeFile(index)} 
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full transition-opacity shadow-sm"
                    >
                      <span className="text-[10px]">✕</span>
                    </button>

                    {/* File Name Label */}
                    <div className="p-2 bg-white rounded-b-lg">
                      <p className="text-[10px] text-gray-700 font-semibold truncate text-center">
                        {file.name}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {status && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 text-center text-xs font-mono text-blue-600 italic font-bold"
            >
              Status: {status}
            </motion.p>
          )}
        </motion.div>
      </main>

      <footer className="w-full py-8 border-t border-gray-100 bg-white mt-10">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-gray-400 text-[11px] font-bold uppercase tracking-widest">
          <div className="mb-4 md:mb-0 flex items-center space-x-6">
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