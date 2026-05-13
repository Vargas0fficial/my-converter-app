// src/services/apiService.ts
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const convertFiles = async (
  files: File[], 
  options: { quality: number; isMergeMode: boolean },
  onProgress: (p: number) => void
) => {
  const formData = new FormData();
  
  // Tukuyin ang endpoint base sa file type ng unang file
  const isPDF = files[0].type === 'application/pdf';
  let endpoint = isPDF 
    ? (options.isMergeMode ? 'merge-pdfs' : 'pdf-to-images') 
    : 'images-to-pdf';

  files.forEach((file) => formData.append('files', file));
  formData.append('quality', options.quality.toString());
  
  // Kung images-to-pdf, kailangan nating sabihin kung i-me-merge ba
  if (endpoint === 'images-to-pdf') {
    formData.append('merge', options.isMergeMode.toString());
  }

  onProgress(40); // Simulang mag-process

  const response = await fetch(`${BACKEND_URL}/convert/${endpoint}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Conversion failed: ${response.statusText}`);
  }

  onProgress(85); // Downloading na ang blob
  return await response.blob();
};