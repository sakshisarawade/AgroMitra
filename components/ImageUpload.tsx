import React, { useCallback, useState } from 'react';
import { getTranslation } from '../utils/translations';
import { Language } from '../types';

interface ImageUploadProps {
  onImageSelected: (file: File) => void;
  lang: Language;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, lang }) => {
  const [isDragging, setIsDragging] = useState(false);
  const t = getTranslation(lang);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onImageSelected(file);
      } else {
        alert("Please upload an image file.");
      }
    }
  }, [onImageSelected]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelected(e.target.files[0]);
    }
  }, [onImageSelected]);

  return (
    <label
      htmlFor="leaf-image-upload"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer group
        ${isDragging 
          ? 'border-green-600 bg-green-50' 
          : 'border-green-300 hover:border-green-600 hover:bg-green-50'}`}
    >
      <input
        id="leaf-image-upload"
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="sr-only"
      />
      
      <div className="flex flex-col items-center space-y-3 p-6 text-center pointer-events-none">
        <div className={`p-4 rounded-full ${isDragging ? 'bg-green-100 text-green-600' : 'bg-green-50 text-green-400 group-hover:bg-green-100 group-hover:text-green-500'} transition-colors`}>
           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        </div>
        <div>
          <p className="text-lg font-medium text-green-900">
            {isDragging ? t.dropText : t.clickText}
          </p>
          <p className="text-sm text-green-600/70 mt-1">
            {t.fileSupport}
          </p>
        </div>
      </div>
    </label>
  );
};

export default ImageUpload;