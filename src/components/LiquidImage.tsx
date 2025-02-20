import { LiquidImageControls } from '@/components/LiquidImageControls';
import { Canvas } from '@/hero/canvas';
import { type ShaderParams, defaultParams } from '@/hero/params';
import { parseLogoImage } from '@/hero/parse-logo-image';
import { consoleError, msg } from '@/hero/utils';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
type State = ShaderParams & {
  background: string;
};

interface LiquidImageProps {
  src: string;
  refraction?: number;
  edge?: number;
  patternBlur?: number;
  liquid?: number;
  speed?: number;
  patternScale?: number;
  showControls?: boolean;
}

const defaultState = { ...defaultParams, background: 'metal' };

/**
 * Hero component for the Liquid Logo Generator
 * @param src - The URL of the image to display
 * @param refraction - Refraction amount `[0, 0.06]`
 * @param edge - Edge thickness `[0, 1]`
 * @param patternBlur - Pattern blur amount `[0, 0.05]`
 * @param liquid - Liquid distortion amount `[0, 1]`
 * @param speed - Animation speed `[0, 1]`
 * @param patternScale - Pattern scale `[1, 10]`
 */
export function LiquidImage({
  src,
  refraction = 0.015,
  edge = 0.4,
  patternBlur = 0.005,
  liquid = 0.07,
  speed = 0.3,
  patternScale = 2,
  showControls = true,
}: LiquidImageProps) {
  const [state, setState] = useState<State>({
    ...defaultState,
    refraction,
    edge,
    patternBlur,
    liquid,
    speed,
    patternScale,
  });
  const [dragging, setDragging] = useState(false);

  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [processing, setProcessing] = useState<boolean>(true);

  useEffect(() => {
    setProcessing(true);

    async function updateImageData() {
      try {
        const res = await fetch(src);
        const blob = await res.blob();
        const bitmap = await createImageBitmap(blob);

        // Create a temporary canvas to turn the image back into imageData for the shader
        const canvas = document.createElement('canvas');
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error(msg('Failed to create canvas context'));
        }
        ctx.drawImage(bitmap, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setImageData(imageData);
      } catch (error) {
        consoleError('Failed to load image.');
      }

      setProcessing(false);
    }

    updateImageData();
  }, [src]);

  const handleFileInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
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
        setProcessing(true);
        parseLogoImage(file).then(({ imageData }) => {
          // Set the image data for the shader to pick up
          setImageData(imageData);
          setProcessing(false);
        });
      } else {
        toast.error('Please upload only images or SVG files');
      }
    }
  };

  return (
    <div
      className="flex flex-col items-stretch gap-24 px-32 max-md:max-w-564 md:grid md:grid-cols-[500px_500px] md:gap-32"
      onDragEnter={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragging(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragging(false);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onDrop={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragging(false);
        const files = event.dataTransfer.files;
        handleFiles(files);
      }}
    >
      <div
        className="flex aspect-square w-full items-center justify-center rounded-10"
        style={{
          background: (() => {
            switch (state.background) {
              case 'metal':
                return 'linear-gradient(to bottom, #eee, #b8b8b8)';
            }
            return state.background;
          })(),
        }}
      >
        <div className="aspect-square w-400">{imageData && <Canvas imageData={imageData} params={state} />}</div>
      </div>

      <LiquidImageControls state={state} setState={setState} onFileInput={handleFileInput} />
    </div>
  );
}
