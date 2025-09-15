
import React, { useRef } from 'react';
import type { ImageFile } from '../types';
import Icon from './Icon';

interface ImageUploaderProps {
  imageFile: ImageFile | null;
  onImageChange: (file: File | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ imageFile, onImageChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        onImageChange(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-lg font-semibold text-gray-300">Input Image</h2>
      <div 
        className="relative w-full h-64 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center text-gray-500 hover:border-cyan-400 hover:text-cyan-400 transition-colors cursor-pointer"
        onClick={openFileDialog}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        {imageFile ? (
          <img src={imageFile.previewUrl} alt="Preview" className="object-contain w-full h-full rounded-md" />
        ) : (
          <div className="text-center">
            <Icon name="upload" className="mx-auto h-12 w-12" />
            <p>Click to upload or drag & drop</p>
            <p className="text-xs">PNG, JPG, GIF, WEBP</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
