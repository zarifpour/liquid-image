'use client';

import { useState } from 'react';
import { ImageUpload } from './image-upload';
import { OutputCanvas } from './output-canvas';
import { parseLogoImage } from './parse-logo-image';

export const Hero = () => {
  const [imageData, setImageData] = useState<ImageData | null>(null);

  function handleImageData(file: File) {
    parseLogoImage(file).then((imageData) => {
      setImageData(imageData);
    });
  }

  return (
    <div className="flex items-center justify-center gap-4">
      <ImageUpload onFileSelect={handleImageData} />
      {imageData && <OutputCanvas imageData={imageData} />}
    </div>
  );
};
