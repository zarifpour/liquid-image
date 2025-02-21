'use client';

import { type ShaderParams, params } from '@/hero/params';
import { NumberInput } from '@/utils/number-input';
import { consoleError } from '@/utils/utils';
import { Slider } from 'radix-ui';

type State = ShaderParams & {
  background: string;
};

interface LiquidImageControlsProps {
  state: State;
  setState: React.Dispatch<React.SetStateAction<State>>;
}

export function LiquidImageControls({ state, setState }: LiquidImageControlsProps) {
  return (
    <div
      style={{
        borderRadius: '8px',
        display: 'grid',
        gridTemplateColumns: 'auto 160px 100px',
        alignItems: 'center',
        gap: '24px 12px',
        padding: '16px',
        outline: '1px solid rgba(255, 255, 255, 0.2)',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div>
        <label style={{ whiteSpace: 'nowrap', paddingRight: '16px', color: 'var(--color-white)' }} htmlFor="background">
          Background
        </label>
      </div>
      <div style={{ gridColumn: 'span 2', display: 'flex', height: '40px', alignItems: 'center', gap: '9px' }}>
        <button
          type="button"
          style={{
            position: 'relative',
            width: '28px',
            height: '28px',
            cursor: 'pointer',
            borderRadius: '9999px',
            fontSize: '0px',
            outline: '1px solid rgba(255, 255, 255, 0.3)',
            background: 'transparent',
            transition: 'all 0.2s ease',
          }}
          onClick={() => setState({ ...state, background: 'transparent' })}
        >
          <svg
            viewBox="0 0 24 24"
            style={{
              position: 'absolute',
              inset: '0',
              margin: 'auto',
              width: '16px',
              height: '16px',
              color: 'red',
            }}
            stroke="red"
            strokeWidth="2"
            fill="none"
          >
            <title>Transparent</title>
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
          <span
            style={{
              position: 'absolute',
              width: '1px',
              height: '1px',
              padding: '0',
              margin: '-1px',
              overflow: 'hidden',
              clip: 'rect(0, 0, 0, 0)',
              whiteSpace: 'nowrap',
              borderWidth: '0',
            }}
          >
            Transparent
          </span>
        </button>
        <button
          type="button"
          style={{
            width: '28px',
            height: '28px',
            cursor: 'pointer',
            borderRadius: '9999px',
            fontSize: '0px',
            background: 'linear-gradient(to bottom, #eee, #b8b8b8)',
            transition: 'all 0.2s ease',
          }}
          onClick={() => setState({ ...state, background: 'metal' })}
        >
          Metal
        </button>

        <button
          type="button"
          style={{
            width: '28px',
            height: '28px',
            cursor: 'pointer',
            borderRadius: '9999px',
            fontSize: '0px',
            background: 'white',
            transition: 'all 0.2s ease',
          }}
          onClick={() => setState({ ...state, background: 'white' })}
        >
          White
        </button>

        <button
          type="button"
          style={{
            width: '28px',
            height: '28px',
            cursor: 'pointer',
            borderRadius: '9999px',
            fontSize: '0px',
            background: 'black',
            outline: '1px solid rgba(255, 255, 255, 0.3)',
            transition: 'all 0.2s ease',
          }}
          onClick={() => setState({ ...state, background: 'black' })}
        >
          Black
        </button>

        <label
          style={{
            width: '28px',
            height: '28px',
            cursor: 'pointer',
            borderRadius: '9999px',
            fontSize: '0px',
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
            transition: 'all 0.2s ease',
          }}
        >
          <input
            style={{ width: '0', height: '0', opacity: 0 }}
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
    </div>
  );
}

interface ControlProps {
  label: string;
  min: number;
  max: number;
  step: number;
  format?: (value: string) => string;
  value: number;
  onValueChange: (value: number) => void;
}

function Control({ label, min, max, step, format, value, onValueChange }: ControlProps) {
  if (value < min || value > max) {
    consoleError(`"${label}" value (${value}) is outside allowed range [${min}, ${max}]`);
  }

  return (
    <>
      <div>
        <label style={{ whiteSpace: 'nowrap', paddingRight: '16px', color: 'var(--color-white)' }} htmlFor={label}>
          {label}
        </label>
      </div>
      <div>
        <Slider.Root
          min={min}
          max={max}
          step={step}
          value={[value]}
          onValueChange={([value]) => onValueChange(value)}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            height: '32px',
            touchAction: 'none',
            userSelect: 'none',
          }}
        >
          <Slider.Track
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              position: 'relative',
              flexGrow: 1,
              height: '6px',
              borderRadius: '9999px',
              overflow: 'hidden',
            }}
          >
            <Slider.Range
              style={{
                position: 'absolute',
                backgroundColor: 'var(--color-blue)',
                height: '100%',
              }}
            />
          </Slider.Track>
          <Slider.Thumb
            style={{
              display: 'block',
              width: '16px',
              height: '16px',
              backgroundColor: 'white',
              borderRadius: '9999px',
              boxShadow: '0 2px 6px -2px rgba(0, 0, 0, 0.3)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
              transform: 'scale(1)',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.transform = 'scale(1)';
            }}
            onMouseDown={(e) => {
              (e.target as HTMLElement).style.transform = 'scale(0.95)';
            }}
            onMouseUp={(e) => {
              (e.target as HTMLElement).style.transform = 'scale(1)';
            }}
          />
        </Slider.Root>
      </div>
      <div>
        <NumberInput
          id={label}
          min={min}
          max={max}
          increments={[step, step * 10]}
          format={format}
          style={{
            borderRadius: '4px',
            height: '40px',
            width: '100%',
            background: 'rgba(255, 255, 255, 0.15)',
            paddingLeft: '12px',
            fontSize: 'var(--text-sm)',
            fontVariantNumeric: 'tabular-nums',
            outline: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'var(--color-white)',
            transition: 'all 0.2s ease',
          }}
          value={value.toString()}
          onValueCommit={(value) => onValueChange(Number.parseFloat(value))}
        />
      </div>
    </>
  );
}
