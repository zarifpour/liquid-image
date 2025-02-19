import { ShaderParams } from './output-canvas';

// Add default values as a constant
export const DEFAULT_VALUES: ShaderParams = {
  refraction: 0.015,
  edgeBlur: 0.4,
  patternBlur: 0.005,
  liquid: 0.0,
  speed: 0.3,
  patternScale: 2,
};

export function getInitialParamValues(url: URL) {
  return {
    refraction: {
      value: parseFloat(url.searchParams.get('refraction') ?? DEFAULT_VALUES.refraction.toString()),
      min: 0,
      max: 1,
      step: 0.001,
    },
    edgeBlur: {
      value: parseFloat(url.searchParams.get('edgeBlur') ?? DEFAULT_VALUES.edgeBlur.toString()),
      min: 0,
      max: 1,
      step: 0.01,
    },
    patternBlur: {
      value: parseFloat(url.searchParams.get('patternBlur') ?? DEFAULT_VALUES.patternBlur.toString()),
      min: 0,
      max: 1,
      step: 0.001,
    },
    liquid: {
      value: parseFloat(url.searchParams.get('liquid') ?? DEFAULT_VALUES.liquid.toString()),
      min: 0,
      max: 1,
      step: 0.01,
    },
    speed: {
      value: parseFloat(url.searchParams.get('speed') ?? DEFAULT_VALUES.speed.toString()),
      min: 0,
      max: 1,
      step: 0.01,
    },
    patternScale: {
      value: parseFloat(url.searchParams.get('patternScale') ?? DEFAULT_VALUES.patternScale.toString()),
      min: 0,
      max: 10,
      step: 0.1,
    },
  };
}
