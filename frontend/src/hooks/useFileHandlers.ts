import { useState } from 'react';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function useFileHandlers() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState('');
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [touchStartIndex, setTouchStartIndex] = useState<number | null>(null);

  const validateFiles = (files: File[]) => {
    const errors: string[] = [];
    const valid: File[] = [];
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

    files.forEach((file) => {
      if (!validTypes.includes(file.type)) {
        errors.push(`${file.name}: Invalid file type.`);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: Too large (Max 5MB).`);
        return;
      }
      valid.push(file);
    });
    return { valid, errors };
  };

  const handleFiles = (files: File[]) => {
    const { valid, errors } = validateFiles(files);
    if (errors.length > 0) setError(errors.join(' | '));
    else {
      setError('');
      setSelectedFiles(prev => [...prev, ...valid]);
    }
  };

  const reorderFiles = (from: number, to: number) => {
    const newFiles = [...selectedFiles];
    const [movedItem] = newFiles.splice(from, 1);
    newFiles.splice(to, 0, movedItem);
    setSelectedFiles(newFiles);
  };

  const removeFile = (index: number) => setSelectedFiles(prev => prev.filter((_, i) => i !== index));

  return {
    selectedFiles, setSelectedFiles, error, setError,
    handleFiles, removeFile, reorderFiles,
    draggedItemIndex, setDraggedItemIndex, dragOverIndex, setDragOverIndex,
    touchStartIndex, setTouchStartIndex
  };
}