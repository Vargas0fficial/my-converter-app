import { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';

export const Thumbnail = memo(({ file }: { file: File }) => {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (file && file.type.startsWith('image/')) {
      const timer = setTimeout(() => {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
      }, 50);
      return () => clearTimeout(timer);
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
});

Thumbnail.displayName = 'Thumbnail';

export const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 0.3 }}
      className="h-full bg-gradient-to-r from-blue-500 to-[#002a5c]"
    />
  </div>
);

export const ErrorAlert = ({ message, onClose }: { message: string; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
  >
    <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
    <div className="flex-1">
      <p className="text-sm font-semibold text-red-800">{message}</p>
    </div>
    <button onClick={onClose} className="text-red-600 hover:text-red-800">
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </button>
  </motion.div>
);

export const SuccessAlert = ({ message }: { message: string }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3"
  >
    <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
    <p className="text-sm font-semibold text-green-800">{message}</p>
  </motion.div>
);