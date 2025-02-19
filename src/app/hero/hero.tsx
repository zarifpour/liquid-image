'use client';

import { Suspense, useEffect, useState } from 'react';
import { ImageUpload } from './image-upload';
import { OutputCanvas, ShaderParams } from './output-canvas';
import { parseLogoImage } from './parse-logo-image';
import { uploadImage } from './upload-image';
import { getInitialParams } from '../controls/params';
import { Controls } from '../controls/controls';
import { useSearchParams } from 'next/navigation';

type HeroProps = {
  initialImageId?: string;
};

export const Hero = ({ initialImageId }: HeroProps) => {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);

  // Get params from URL
  const searchParams = useSearchParams();
  const [params, setParams] = useState<ShaderParams>(getInitialParams(searchParams));

  // Check URL for image ID on mount
  useEffect(() => {
    const loadImageId = initialImageId || '01JMDGK56CHM8EE73V2EQP3EMJ'; // apple logo

    setProcessing(true);
    fetch(`https://p1ljtcp1ptfohfxm.public.blob.vercel-storage.com/${loadImageId}.png`)
      .then((res) => res.blob())
      .then((blob) => new File([blob], 'logo.png', { type: 'image/png' }))
      .then((file) => parseLogoImage(file))
      .then(({ imageData }) => {
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
          // Update the URL for sharing
          if (typeof window !== 'undefined' && typeof imageId === 'string' && imageId.length > 0) {
            window.history.pushState({}, '', `/share/${imageId}`);
          }
        })
        .catch(console.error)
        .finally(() => setProcessing(false));
    });
  }

  return (
    <div>
      <div className="flex items-center justify-center gap-4">
        {processing && (
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-black/80 p-4">
            <div className="text-white">loading...</div>
          </div>
        )}
        <ImageUpload onFileSelect={handleUserUpload} />
        {imageData && <OutputCanvas imageData={imageData} params={params} />}
      </div>
      <Controls params={params} setParams={setParams} />
    </div>
  );
};
