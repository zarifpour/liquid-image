import { useEffect, useState } from 'react'

import { LiquidImageControls } from './LiquidImageControls'
import { Canvas } from '../utils/canvas'
import { consoleError } from '../utils/logger'
import { type ShaderParams, defaultParams } from '../utils/params'

type State = ShaderParams & {
  background: string
  invert: boolean
}

export interface LiquidImageProps {
  src: string
  invert?: boolean
  height?: number
  width?: number
  background?: string
  refraction?: number
  edge?: number
  patternBlur?: number
  liquid?: number
  speed?: number
  patternScale?: number
  showControls?: boolean
  className?: string
}

/**
 * Hero component for the Liquid Logo Generator
 * @param src - The URL of the image to display
 * @param invert - Invert the liquid image
 * @param className - The className of the container
 * @param width - The width of the image, overrides img width if provided
 * @param height - The height of the image, overrides img height if provided
 * @param background - The background color of the image
 * @param refraction - refraction amount `[0, 0.06]`
 * @param edge - Edge thickness `[0, 1]`
 * @param patternBlur - Pattern blur amount `[0, 0.05]`
 * @param liquid - Liquid distortion amount `[0, 1]`
 * @param speed - Animation speed `[0, 1]`
 * @param patternScale - Pattern scale `[1, 10]`
 * @param showControls - Display the controls
 */
export function LiquidImage({
  src,
  invert = false,
  className,
  width,
  height,
  background = 'transparent',
  refraction = 0.015,
  edge = 0.4,
  patternBlur = 0.005,
  liquid = 0.07,
  speed = 0.3,
  patternScale = 2,
  showControls = false
}: LiquidImageProps) {
  const [bitmap, setBitmap] = useState<ImageBitmap | null>(null)
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  const [finalHeight, setFinalHeight] = useState<number | null>(null)
  const [finalWidth, setFinalWidth] = useState<number | null>(null)

  const [state, setState] = useState<State>({
    ...defaultParams,
    background,
    refraction,
    edge,
    patternBlur,
    liquid,
    speed,
    patternScale,
    invert
  })

  const [imageData, setImageData] = useState<ImageData | null>(null)

  useEffect(() => {
    async function updateImageData() {
      try {
        let canvas: HTMLCanvasElement
        if (src.startsWith('http')) {
          // Handle remote URLs
          const res = await fetch(src)
          const blob = await res.blob()
          const bitmap = await createImageBitmap(blob)
          setBitmap(bitmap)
          canvas = document.createElement('canvas')
          canvas.width = width || bitmap.width
          canvas.height = height || bitmap.height
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            throw new Error('Failed to create canvas context')
          }
          ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
          if (state.invert) {
            ctx.globalCompositeOperation = 'difference'
            ctx.fillStyle = 'white'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
          }
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          setImageData(imageData)
        } else {
          // Handle local images
          const img = new Image()
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve()
            img.onerror = () => reject(new Error(`Failed to load local image \`${src}\``))
            img.src = src
          })
          setImg(img)

          const actualWidth = img.width
          const actualHeight = img.height

          canvas = document.createElement('canvas')

          // Calculate dimensions maintaining aspect ratio
          let finalWidth: number | undefined
          let finalHeight: number | undefined

          if (width !== undefined && height !== undefined) {
            // If both width and height are provided, just use them
            finalWidth = width
            finalHeight = height
          } else {
            // Calculate scale factors
            const scaleWidth = width !== undefined ? width / actualWidth : Number.POSITIVE_INFINITY
            const scaleHeight = height !== undefined ? height / actualHeight : Number.POSITIVE_INFINITY

            // Pick the smallest scaling factor to maintain aspect ratio
            const scale = Math.min(scaleWidth, scaleHeight)

            // Apply scale
            finalWidth = actualWidth * scale
            finalHeight = actualHeight * scale
          }
          canvas.width = finalWidth || actualWidth
          canvas.height = finalHeight || actualHeight

          const ctx = canvas.getContext('2d')
          if (!ctx) {
            throw new Error('Failed to create canvas context')
          }

          // Draw the image
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

          // Invert the colors
          if (state.invert) {
            ctx.globalCompositeOperation = 'difference'
            ctx.fillStyle = 'white'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
          }

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          setImageData(imageData)
        }
        setFinalHeight(canvas.height)
        setFinalWidth(canvas.width)
      } catch (error) {
        consoleError(`${error}`)
      }
    }

    updateImageData()
  }, [src, state.invert, width, height])

  return (
    <>
      <div
        className={className}
        style={{
          width: finalWidth || bitmap?.width || img?.width || 400,
          height: finalHeight || bitmap?.height || img?.height || 400,
          aspectRatio: width && !height ? 'auto' : height && !width ? 'auto' : undefined,
          background: state.background === 'metal' ? 'linear-gradient(to bottom, #eee, #b8b8b8)' : state.background
        }}
      >
        {imageData && <Canvas imageData={imageData} params={state} />}
      </div>
      {showControls && (
        <div style={{ marginTop: '2rem' }}>
          <LiquidImageControls state={state} setState={setState} />
        </div>
      )}
    </>
  )
}
