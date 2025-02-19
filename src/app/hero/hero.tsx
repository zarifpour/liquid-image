'use client';

import { useEffect, useState } from 'react';
import { ImageUpload } from './image-upload';
import { OutputCanvas, ShaderParams } from './output-canvas';
import { parseLogoImage } from './parse-logo-image';
import { uploadImage } from './upload-image';
import { getInitialParams } from '../controls/params';
import { Controls } from '../controls/controls';
import { useSearchParams } from 'next/navigation';
import { CopyShareLink } from './copy-share-link';

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
      .then((blob) => createImageBitmap(blob))
      .then((bitmap) => {
        // Create a temporary canvas to turn the image back into imageData for the shader
        const canvas = document.createElement('canvas');
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(bitmap, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
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
      <ImageUpload onFileSelect={handleUserUpload} />
      {imageData && <OutputCanvas imageData={imageData} params={params} processing={processing} />}

      {/* <CopyShareLink /> */}

      <Controls params={params} setParams={setParams} />
    </div>
  );
};
