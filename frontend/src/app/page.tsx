'use client'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useFileHandlers } from '@/hooks/useFileHandlers';
import { Thumbnail, ProgressBar, ErrorAlert, SuccessAlert } from '@/components/FileUI';
import { convertFiles } from '@/services/apiService';

export default function Home() {
  const {
    selectedFiles, setSelectedFiles, error, setError, handleFiles, removeFile, reorderFiles,
    draggedItemIndex, setDraggedItemIndex, dragOverIndex, setDragOverIndex,
    touchStartIndex, setTouchStartIndex
  } = useFileHandlers();

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [isMergeMode, setIsMergeMode] = useState(false);
  const [quality, setQuality] = useState(80);

  const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
  const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);

  const handleConvert = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select at least one file');
      return;
    }
    
    setError('');
    setLoading(true);
    setProgress(0);
    setStatus(isMergeMode ? 'Merging Documents...' : 'Processing...');

    try {
      const blob = await convertFiles(selectedFiles, { quality, isMergeMode }, (p) => {
        setProgress(p);
        setStatus(p < 100 ? (isMergeMode ? `Merging... ${p}%` : `Processing... ${p}%`) : '✅ Conversion Complete!');
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      let ext = 'zip';
      if (isMergeMode || (selectedFiles.length === 1 && selectedFiles[0].type !== 'application/pdf')) {
        ext = 'pdf';
      }
      
      a.download = `converted_file_${Date.now()}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setProgress(100);
      
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        setSelectedFiles([]);
        setIsMergeMode(false);
        setProgress(0);
        setStatus('');
        setLoading(false);
      }, 1500);
    } catch (e: any) {
      setError(`❌ ${e.message || 'Conversion failed. Please try again.'}`);
      setProgress(0);
      setStatus('');
      setLoading(false);
    }
  };

  const onDragStart = (index: number) => {
    if (selectedFiles[index].type !== 'application/pdf') {
      setDraggedItemIndex(index);
    }
  };

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedItemIndex === null || draggedItemIndex === index || selectedFiles[draggedItemIndex].type === 'application/pdf') return;
    
    setDragOverIndex(index);
    
    const newFiles = [...selectedFiles];
    const temp = newFiles[draggedItemIndex];
    newFiles[draggedItemIndex] = newFiles[index];
    newFiles[index] = temp;
    
    setDraggedItemIndex(index);
    setSelectedFiles(newFiles);
  };

  const onDragEnd = () => {
    setDraggedItemIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col font-sans">
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-8 sm:p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="w-full max-w-2xl flex flex-col mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-2">Convert & Merge Files</h1>
            <p className="text-sm text-gray-600">Easily convert images to PDF and merge documents ads Free!</p>
          </div>

          {/* Error & Success Alerts */}
          <AnimatePresence>
            {error && <ErrorAlert message={error} onClose={() => setError('')} />}
            {status === '✅ Conversion Complete!' && <SuccessAlert message={status} />}
          </AnimatePresence>

          {/* Upload Box */}
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="relative group mb-6">
            <div 
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleFiles(Array.from(e.dataTransfer.files));
              }}
              onDragOver={(e) => e.preventDefault()}
              className={`border-2 border-dashed rounded-2xl p-6 sm:p-10 flex flex-col items-center justify-center text-center transition-all duration-300 ${
                selectedFiles.length > 0 
                  ? 'bg-gray-50 border-[#002a5c]' 
                  : 'bg-white hover:bg-blue-50/30 border-[#002a5c]'
              }`}
            >
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="mb-4">
                <svg className="w-12 h-12 sm:w-16 sm:h-16 text-[#002a5c] mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </motion.div>
              <div className="mb-4 sm:mb-6">
                <p className="text-sm font-medium mb-1 text-gray-700">Drag files here or click to select</p>
                <p className="text-xs text-gray-500 font-bold uppercase">JPG, PNG, PDF • Max 5MB each</p>
              </div>
              <div className="relative inline-block">
                <input 
                  type="file" 
                  multiple 
                  onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                />
                <motion.button 
                  whileHover={{ backgroundColor: '#f9fafb' }} 
                  className="px-8 py-2 border-2 border-[#002a5c] text-[#002a5c] font-bold rounded-lg transition-colors text-sm sm:text-base"
                >
                  Choose Files
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Quality Slider */}
          <AnimatePresence>
            {selectedFiles.length > 0 && selectedFiles[0].type !== 'application/pdf' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase text-gray-500">Quality: {quality}%</span>
                  <span className="text-xs text-gray-600">Higher = Larger File</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="100" 
                  value={quality} 
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-[#002a5c]" 
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Merge Toggle */}
          <AnimatePresence>
            {selectedFiles.length > 1 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }} 
                className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200 flex items-center space-x-3 cursor-pointer hover:bg-blue-100 transition-colors" 
                onClick={() => setIsMergeMode(!isMergeMode)}
              >
                <input type="checkbox" checked={isMergeMode} readOnly className="w-4 h-4 accent-[#002a5c]" />
                <span className="text-sm font-semibold text-[#002a5c]">
                  {selectedFiles[0].type === 'application/pdf' 
                    ? "Merge into single PDF" 
                    : "Combine into one PDF"}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* File Info */}
          <AnimatePresence>
            {selectedFiles.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="mb-4 p-3 bg-gray-100 rounded-lg text-xs text-gray-700"
              >
                <p><strong>{selectedFiles.length}</strong> file(s) selected • <strong>{totalSizeMB}MB</strong> total</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Convert Button with Progress */}
          <AnimatePresence>
            {selectedFiles.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full"
              >
                <motion.button 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }} 
                  onClick={handleConvert} 
                  disabled={loading} 
                  className="w-full py-3 sm:py-4 bg-[#002a5c] text-white rounded-lg font-bold hover:bg-[#001f44] disabled:opacity-50 transition-all shadow-lg text-sm sm:text-base"
                >
                  {loading ? (
                    <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                      {status}
                    </motion.span>
                  ) : 'Convert & Download'}
                </motion.button>

                {/* Progress Bar */}
                {loading && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="mt-3"
                  >
                    <ProgressBar progress={progress} />
                    <p className="text-xs text-gray-600 text-center mt-2">{progress}% Complete</p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Files Grid */}
          {selectedFiles.length > 0 && (
            <div className="mt-8">
              <p className="text-xs font-bold uppercase text-gray-500 mb-3">Files ({selectedFiles.length})</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                <AnimatePresence mode="popLayout">
                  {selectedFiles.map((file, index) => (
                    <motion.div 
                      key={`${file.name}-${index}`}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ 
                        layout: { duration: 0.15, type: "spring", stiffness: 350, damping: 30 },
                        opacity: { duration: 0.1 }
                      }}
                      draggable={file.type !== 'application/pdf'}
                      onDragStart={() => onDragStart(index)}
                      onDragOver={(e) => onDragOver(e, index)}
                      onDragEnd={onDragEnd}
                      className={`group relative flex flex-col bg-white rounded-lg shadow-sm border-2 transition-all select-none
                        ${file.type === 'application/pdf' ? 'cursor-default' : 'cursor-grab active:cursor-grabbing hover:border-blue-400'}
                        ${draggedItemIndex === index ? 'opacity-0' : 'opacity-100'}
                        ${dragOverIndex === index ? 'border-blue-500 bg-blue-50 scale-105' : 'border-gray-200'}
                      `}
                    >
                      <Thumbnail file={file} />
                      <div className="absolute top-1 left-1 bg-white/90 border border-gray-200 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded">
                        #{index + 1}
                      </div>
                      <button 
                        onClick={() => removeFile(index)} 
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full transition-opacity shadow-sm hover:bg-red-600 text-xs"
                      >
                        ✕
                      </button>
                      <div className="p-2 bg-white rounded-b-md">
                        <p className="text-[10px] text-gray-700 font-semibold truncate text-center">{file.name}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      {/* ✅ IMPROVED Footer */}
      <footer className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white mt-12">
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand Section */}
            <div>
              <h3 className="text-lg font-bold mb-3">ImagePDF</h3>
              <p className="text-sm text-gray-400">Convert images to PDF and merge documents effortlessly.</p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-bold uppercase mb-3 text-gray-300">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
                <li><Link href="/features" className="text-gray-400 hover:text-white transition">Features</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition">Contact</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-bold uppercase mb-3 text-gray-300">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="/disclaimer" className="text-gray-400 hover:text-white transition">Disclaimer</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-sm font-bold uppercase mb-3 text-gray-300">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="mailto:support@imagepdf.com" className="text-gray-400 hover:text-white transition">Email Support</a></li>
                <li><Link href="/faq" className="text-gray-400 hover:text-white transition">FAQ</Link></li>
                <li><Link href="/feedback" className="text-gray-400 hover:text-white transition">Send Feedback</Link></li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 pt-8">
            {/* Bottom Footer */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-400">
                <p>© 2026 ImagePDF Converter. All rights reserved.</p>
              </div>
              
              {/* Creator Credit */}
              <div className="text-sm font-semibold text-gray-300">
                Created by <span className="text-blue-400">Vargas</span>
              </div>

              {/* Social Links */}
              <div className="flex gap-4">
                <a href="#twitter" className="text-gray-400 hover:text-white transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#https://github.com/Vargas0fficial" className="text-gray-400 hover:text-white transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}