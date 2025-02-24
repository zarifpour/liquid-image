import type * as react_jsx_runtime from 'react/jsx-runtime'

interface LiquidImageProps {
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
 * Liquid metal image component
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
declare function LiquidImage({
  src,
  invert,
  className,
  width,
  height,
  background,
  refraction,
  edge,
  patternBlur,
  liquid,
  speed,
  patternScale,
  showControls
}: LiquidImageProps): react_jsx_runtime.JSX.Element

export { LiquidImage, type LiquidImageProps }
