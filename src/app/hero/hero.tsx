'use client';

import { useEffect, useState } from 'react';
import { ImageUpload } from './image-upload';
import { OutputCanvas, ShaderParams } from './output-canvas';
import { parseLogoImage } from './parse-logo-image';
import { uploadImage } from './upload-image';
import { useControls } from 'leva';

type HeroProps = {
  initialImageId?: string;
};

export const Hero = ({ initialImageId }: HeroProps) => {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);

  const params: ShaderParams = useControls({
    refraction: { value: 0.015, min: 0, max: 0.1, step: 0.001 },
    edgeBlur: { value: 0.1, min: 0, max: 1, step: 0.01 },
    patternBlur: { value: 0.005, min: 0, max: 0.1, step: 0.001 },
    liquid: { value: 0.0, min: 0, max: 1, step: 0.01 },
    speed: { value: 0.3, min: 0, max: 1, step: 0.01 },
    patternScale: { value: 2, min: 0, max: 10, step: 0.1 },
  });

  // Check URL for image ID on mount
  useEffect(() => {
    const loadImageId = initialImageId || '01JMDGK56CHM8EE73V2EQP3EMJ'; // apple logo

    setProcessing(true);
    fetch(`https://p1ljtcp1ptfohfxm.public.blob.vercel-storage.com/${loadImageId}.png`)
      .then((res) => res.blob())
      .then((blob) => new File([blob], 'logo.png', { type: 'image/png' }))
      .then((file) => parseLogoImage(file))
      .then(({ imageData }) => {
        console.log('imageData', imageData);
        setImageData(imageData);
      })
      .catch(console.error)
      .finally(() => setProcessing(false));
  }, [initialImageId]); // Empty dependency array means it only runs on mount

  function handleUserUpload(file: File) {
    setProcessing(true);
    parseLogoImage(file).then(({ imageData, pngBlob }) => {
      // Set the image data for the shader to pick up
      setImageData(imageData);
      setProcessing(false);

      // Upload the image
      uploadImage(pngBlob)
        .then((imageId) => {
          console.log('imageId', imageId);
          // Update the URL for sharing
          if (typeof imageId === 'string' && imageId.length > 0) {
            window.history.pushState({}, '', `/share/${imageId}`);
          }
        })
        .catch(console.error)
        .finally(() => setProcessing(false));
    });
  }

  return (
    <div className="flex items-center justify-center gap-4">
      {processing && (
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-black/80 p-4">
          <div className="text-white">loading...</div>
        </div>
      )}
      <ImageUpload onFileSelect={handleUserUpload} />
      {imageData && <OutputCanvas imageData={imageData} params={params} />}
    </div>
  );
};
