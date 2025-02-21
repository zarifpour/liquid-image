import { useEffect, useState } from 'react';

import { LiquidImageControls } from '@/components/LiquidImageControls';
import { Canvas } from '@/hero/canvas';
import { type ShaderParams, defaultParams } from '@/hero/params';
import { consoleError } from '@/utils/utils';

type State = ShaderParams & {
  background: string;
};

interface LiquidImageProps {
  src: string;
  height?: number;
  width?: number;
  background?: string;
  refraction?: number;
  edge?: number;
  patternBlur?: number;
  liquid?: number;
  speed?: number;
  patternScale?: number;
  showControls?: boolean;
  className?: string;
}

/**
 * Hero component for the Liquid Logo Generator
 * @param src - The URL of the image to display
 * @param className - The className of the container
 * @param height - The height of the image, overrides img height if provided
 * @param width - The width of the image, overrides img width if provided
 * @param background - The background color of the image
 * @param refraction - Refraction amount `[0, 0.06]`
 * @param edge - Edge thickness `[0, 1]`
 * @param patternBlur - Pattern blur amount `[0, 0.05]`
 * @param liquid - Liquid distortion amount `[0, 1]`
 * @param speed - Animation speed `[0, 1]`
 * @param patternScale - Pattern scale `[1, 10]`
 * @param showControls - Display the controls
 */
export function LiquidImage({
  src,
  className,
  height,
  width,
  background = 'transparent',
  refraction = 0.015,
  edge = 0.4,
  patternBlur = 0.005,
  liquid = 0.07,
  speed = 0.3,
  patternScale = 2,
  showControls = false,
}: LiquidImageProps) {
  const [bitmap, setBitmap] = useState<ImageBitmap | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);

  const [state, setState] = useState<State>({
    ...defaultParams,
    background,
    refraction,
    edge,
    patternBlur,
    liquid,
    speed,
    patternScale,
  });

  const [imageData, setImageData] = useState<ImageData | null>(null);

  useEffect(() => {
    async function updateImageData() {
      try {
        if (src.startsWith('http')) {
          // Handle remote URLs
          const res = await fetch(src);
          const blob = await res.blob();
          const bitmap = await createImageBitmap(blob);
          setBitmap(bitmap);
          const canvas = document.createElement('canvas');
          canvas.width = width || bitmap.width;
          canvas.height = height || bitmap.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Failed to create canvas context');
          }
          ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          setImageData(imageData);
        } else {
          // Handle local images
          const img = new Image();
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error(`Failed to load local image \`${src}\``));
            img.src = src;
          });
          setImg(img);
          const canvas = document.createElement('canvas');
          canvas.width = width || img.width;
          canvas.height = height || img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Failed to create canvas context');
          }

          // Draw the image
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Invert the colors
          ctx.globalCompositeOperation = 'difference';
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          setImageData(imageData);
        }
      } catch (error) {
        consoleError(`${error}`);
      }
    }

    updateImageData();
  }, [src, width, height]);

  return (
    <>
      <div
        className={className}
        style={{
          width: width || bitmap?.width || img?.width || 400,
          height: height || bitmap?.height || img?.height || 400,
          aspectRatio: 'auto',
        }}
      >
        {imageData && <Canvas imageData={imageData} params={state} />}
      </div>
      {showControls && <LiquidImageControls state={state} setState={setState} />}
    </>
  );
}
