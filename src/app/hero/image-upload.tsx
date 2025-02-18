'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { parseLogoImage } from './parse-logo-image';

interface FileUploadProps {
  onFileSelect?: (file: File) => void;
  className?: string;
}

export const ImageUpload: React.FC<FileUploadProps> = ({ onFileSelect, className }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    handleFiles(files);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(files);
    }
  }, []);

  const handleFiles = async (files: FileList) => {
    if (files.length > 0) {
      const file = files[0];
      const fileType = file.type;

      // Check file size (4.5MB = 4.5 * 1024 * 1024 bytes)
      const maxSize = 4.5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error('File size must be less than 4.5MB');
        return;
      }

      // Check if file is an image or SVG
      if (fileType.startsWith('image/') || fileType === 'image/svg+xml') {
        if (onFileSelect) {
          onFileSelect(file);
        }
      } else {
        toast.error('Please upload only images or SVG files');
      }
    }
  };

  return (
    <div
      className={`upload-container ${isDragging ? 'dragging' : ''} ${className || ''}`}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="upload-content">
        <p>Drag and drop an image or SVG here, or</p>
        <input type="file" accept="image/*,.svg" onChange={handleFileInput} id="file-input" className="file-input" />
        <label htmlFor="file-input" className="upload-button">
          Choose File
        </label>
      </div>

      <style jsx>{`
        .upload-container {
          border: 2px dashed #ccc;
          border-radius: 4px;
          padding: 20px;
          text-align: center;
          transition: all 0.3s ease;
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .upload-container.dragging {
          border-color: #2196f3;
          background-color: rgba(33, 150, 243, 0.1);
        }

        .upload-content {
          width: 100%;
        }

        .file-input {
          display: none;
        }

        .upload-button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #2196f3;
          color: white;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 10px;
        }

        .upload-button:hover {
          background-color: #1976d2;
        }

        .preview-image {
          max-width: 100%;
          max-height: 300px;
          object-fit: contain;
        }
      `}</style>
    </div>
  );
};
