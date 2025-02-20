'use client';

import { type ShaderParams, params } from '@/hero/params';
import { consoleError } from '@/hero/utils';
import { NumberInput } from '@/utils/number-input';
import { Slider } from 'radix-ui';

type State = ShaderParams & {
  background: string;
};

interface LiquidImageControlsProps {
  state: State;
  setState: React.Dispatch<React.SetStateAction<State>>;
  onFileInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function LiquidImageControls({ state, setState, onFileInput }: LiquidImageControlsProps) {
  return (
    <div className="grid grid-cols-[auto_160px_100px] items-center gap-x-24 gap-y-12 rounded-8 p-16 outline outline-white/20">
      <div>
        <label className="pr-16 text-nowrap" htmlFor="background">
          Background
        </label>
      </div>
      <div className="col-span-2 flex h-40 items-center gap-9">
        <button
          type="button"
          className="size-28 cursor-pointer rounded-full text-[0px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          style={{ background: 'linear-gradient(to bottom, #eee, #b8b8b8)' }}
          onClick={() => setState({ ...state, background: 'metal' })}
        >
          Metal
        </button>

        <button
          type="button"
          className="size-28 cursor-pointer rounded-full bg-white text-[0px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          onClick={() => setState({ ...state, background: 'white' })}
        >
          White
        </button>

        <button
          type="button"
          className="size-28 cursor-pointer rounded-full bg-black text-[0px] outline outline-white/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          onClick={() => setState({ ...state, background: 'black' })}
        >
          Black
        </button>

        <label
          className="size-28 cursor-pointer rounded-full text-[0px] focus-within:cursor-default [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-focus"
          style={{
            background: `
              radial-gradient(circle, white, transparent 65%),
              conic-gradient(
                in oklch,
                oklch(63.2% 0.254 30),
                oklch(79% 0.171 70),
                oklch(96.7% 0.211 110),
                oklch(87.4% 0.241 150),
                oklch(90.2% 0.156 190),
                oklch(76.2% 0.152 230),
                oklch(46.5% 0.305 270),
                oklch(59.5% 0.301 310),
                oklch(65.9% 0.275 350),
                oklch(63.2% 0.254 30)
              )
            `,
          }}
        >
          <input
            className="h-0 w-0"
            type="color"
            onChange={(event) => setState({ ...state, background: event.currentTarget.value })}
          />
          Custom
        </label>
      </div>

      <Control
        label="Refraction"
        value={state.refraction}
        min={params.refraction.min}
        max={params.refraction.max}
        step={params.refraction.step}
        onValueChange={(value) => setState((state) => ({ ...state, refraction: value }))}
      />
      <Control
        label="Edge"
        value={state.edge}
        min={params.edge.min}
        max={params.edge.max}
        step={params.edge.step}
        onValueChange={(value) => setState((state) => ({ ...state, edge: value }))}
      />
      <Control
        label="Pattern Blur"
        value={state.patternBlur}
        min={params.patternBlur.min}
        max={params.patternBlur.max}
        step={params.patternBlur.step}
        onValueChange={(value) => setState((state) => ({ ...state, patternBlur: value }))}
      />
      <Control
        label="Liquify"
        value={state.liquid}
        min={params.liquid.min}
        max={params.liquid.max}
        step={params.liquid.step}
        onValueChange={(value) => setState((state) => ({ ...state, liquid: value }))}
      />
      <Control
        label="Speed"
        value={state.speed}
        min={params.speed.min}
        max={params.speed.max}
        step={params.speed.step}
        onValueChange={(value) => setState((state) => ({ ...state, speed: value }))}
      />
      <Control
        label="Pattern Scale"
        value={state.patternScale}
        min={params.patternScale.min}
        max={params.patternScale.max}
        step={params.patternScale.step}
        format={(value) => (value === '0' || value === '10' ? value : Number.parseFloat(value).toFixed(1))}
        onValueChange={(value) => setState((state) => ({ ...state, patternScale: value }))}
      />

      <div className="col-span-3 mt-12">
        <label
          htmlFor="file-input"
          className="mb-16 flex h-40 cursor-pointer items-center justify-center rounded-4 bg-button font-medium select-none"
        >
          <input type="file" accept="image/*,.svg" onChange={onFileInput} id="file-input" className="hidden" />
          Upload image
        </label>
        <p className="w-fill text-sm text-white/80">
          Tips: transparent or white background is required. Shapes work better than words. Use an SVG or a
          high-resolution image.
        </p>
      </div>
    </div>
  );
}

interface ControlProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  format?: (value: string) => string;
  onValueChange: (value: number) => void;
}

function Control({ label, min, max, step, format, value, onValueChange }: ControlProps) {
  if (value < min || value > max) {
    consoleError(`"${label}" value (${value}) is outside allowed range [${min}, ${max}]`);
  }

  return (
    <>
      <div>
        <label className="pr-16 text-nowrap" htmlFor={label}>
          {label}
        </label>
      </div>
      <div>
        <Slider.Root min={min} max={max} step={step} value={[value]} onValueChange={([value]) => onValueChange(value)}>
          <Slider.Track className="relative flex h-32 w-full touch-none items-center rounded-full select-none">
            <span inert className="absolute inset-x-0 h-6 rounded-full bg-white/20" />
            <Slider.Range className="absolute h-6 rounded-full bg-blue select-none" />
            <Slider.Thumb
              tabIndex={-1}
              className="block size-16 rounded-full bg-white outline-focus select-none focus-visible:outline-2"
              style={{ boxShadow: '0 2px 6px -2px black' }}
            />
          </Slider.Track>
        </Slider.Root>
      </div>
      <div>
        <NumberInput
          id={label}
          min={min}
          max={max}
          increments={[step, step * 10]}
          format={format}
          className="h-40 w-full rounded-4 bg-white/15 pl-12 text-sm tabular-nums outline-white/20 focus:outline-2 focus:-outline-offset-1 focus:outline-blue"
          value={value.toString()}
          onValueCommit={(value) => onValueChange(Number.parseFloat(value))}
        />
      </div>
    </>
  );
}
