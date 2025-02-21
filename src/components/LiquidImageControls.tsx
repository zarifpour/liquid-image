import { consoleError } from '../utils/logger'
import { NumberInput } from '../utils/number-input'
import { type ShaderParams, params } from '../utils/params'

type State = ShaderParams & {
  background: string
  invert: boolean
}

interface LiquidImageControlsProps {
  state: State
  setState: React.Dispatch<React.SetStateAction<State>>
}

export function LiquidImageControls({ state, setState }: LiquidImageControlsProps) {
  return (
    <div
      style={{
        borderRadius: '12px',
        display: 'grid',
        gridTemplateColumns: 'auto 120px auto',
        alignItems: 'center',
        gap: '12px',
        padding: '16px',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(12px)',
        color: 'white',
        fontFamily: 'system-ui, sans-serif',
        width: 'fit-content'
      }}
    >
      <div>
        <label style={{ fontSize: '13px', fontWeight: 500 }} htmlFor="background">
          Background
        </label>
      </div>
      <div
        style={{
          gridColumn: 'span 2',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <button
          type="button"
          style={{
            position: 'relative',
            width: '24px',
            height: '24px',
            cursor: 'pointer',
            borderRadius: '9999px',
            fontSize: '0px',
            border: '2px solid rgba(255, 255, 255, 0.15)',
            background: 'transparent',
            transition: 'all 0.2s ease'
          }}
          onClick={() =>
            setState((prevState) => ({
              ...prevState,
              background: 'transparent'
            }))
          }
        >
          <svg
            viewBox="0 0 24 24"
            style={{
              position: 'absolute',
              inset: '0',
              margin: 'auto',
              width: '12px',
              height: '12px',
              color: 'white'
            }}
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          >
            <title>Transparent</title>
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        {['metal', 'white', 'black'].map((color) => (
          <button
            key={color}
            type="button"
            style={{
              width: '24px',
              height: '24px',
              cursor: 'pointer',
              borderRadius: '9999px',
              fontSize: '0px',
              border: '2px solid rgba(255, 255, 255, 0.15)',
              background: color === 'metal' ? 'linear-gradient(to bottom, #eee, #b8b8b8)' : color,
              transition: 'all 0.2s ease'
            }}
            onClick={() => setState((prevState) => ({ ...prevState, background: color }))}
          >
            {color}
          </button>
        ))}
        <label
          style={{
            width: '24px',
            height: '24px',
            cursor: 'pointer',
            borderRadius: '9999px',
            fontSize: '0px',
            border: '2px solid white',
            background: `
              conic-gradient(
                from 90deg,
                hsl(0 100% 50%),
                hsl(30 100% 50%),
                hsl(60 100% 50%),
                hsl(90 100% 50%),
                hsl(120 100% 50%),
                hsl(150 100% 50%),
                hsl(180 100% 50%),
                hsl(210 100% 50%),
                hsl(240 100% 50%),
                hsl(270 100% 50%),
                hsl(300 100% 50%),
                hsl(330 100% 50%),
                hsl(360 100% 50%)
              )
            `,
            position: 'relative',
            transition: 'all 0.2s ease'
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '9999px',
              background: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)'
            }}
          />
          <input
            style={{ width: '0', height: '0', opacity: 0 }}
            type="color"
            onChange={(event) =>
              setState((prevState) => ({
                ...prevState,
                background: event.currentTarget.value
              }))
            }
          />
          Custom
        </label>
      </div>

      <div>
        <label style={{ fontSize: '13px', fontWeight: 500 }} htmlFor="invert">
          Invert
        </label>
      </div>
      <div
        style={{
          gridColumn: 'span 2',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <label
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
        >
          <input
            type="checkbox"
            id="invert"
            checked={state.invert}
            onChange={(e) =>
              setState((prevState) => ({
                ...prevState,
                invert: e.target.checked
              }))
            }
            style={{
              appearance: 'none',
              width: '24px',
              height: '24px',
              borderRadius: '4px',
              border: '2px solid rgba(255, 255, 255, 0.15)',
              background: state.invert ? 'rgba(93, 188, 255, 0.8)' : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              margin: 0,
              padding: 0,
              display: 'grid',
              placeContent: 'center'
            }}
          />
          <svg
            viewBox="0 0 24 24"
            style={{
              position: 'absolute',
              left: '6px',
              width: '12px',
              height: '12px',
              color: 'white',
              opacity: state.invert ? 1 : 0,
              transition: 'opacity 0.2s ease',
              pointerEvents: 'none'
            }}
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
          >
            <title>Invert colors</title>
            <path d="M20 6L9 17l-5-5" />
          </svg>
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

      <div
        style={{
          gridColumn: 'span 3',
          fontSize: '13px',
          opacity: 0.8,
          marginTop: '8px',
          maxWidth: '300px',
          lineHeight: '1.4'
        }}
      >
        💡 Tip: transparent or white background is required. Shapes work better than words. Use an SVG or a
        high-resolution image.
      </div>
    </div>
  )
}

interface ControlProps {
  label: string
  min: number
  max: number
  step: number
  format?: (value: string) => string
  value: number
  onValueChange: (value: number) => void
}

function Control({ label, min, max, step, format, value, onValueChange }: ControlProps) {
  if (value < min || value > max) {
    consoleError(`"${label}" value (${value}) is outside allowed range [${min}, ${max}]`)
  }

  const percentage = ((value - min) / (max - min)) * 100

  return (
    <>
      <div style={{ minWidth: '80px' }}>
        <label style={{ fontSize: '13px', fontWeight: 500 }} htmlFor={label}>
          {label}
        </label>
      </div>
      <div style={{ width: '120px' }}>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            height: '24px',
            touchAction: 'none',
            userSelect: 'none'
          }}
        >
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onValueChange(Number(e.target.value))}
            style={{
              width: '100%',
              height: '3px',
              WebkitAppearance: 'none',
              appearance: 'none',
              background: `linear-gradient(to right,
                rgba(93, 188, 255, 0.8) 0%,
                rgba(93, 188, 255, 0.8) ${percentage}%,
                rgba(255, 255, 255, 0.1) ${percentage}%,
                rgba(255, 255, 255, 0.1) 100%
              )`,
              borderRadius: '9999px',
              outline: 'none',
              cursor: 'pointer'
            }}
            className="custom-range"
          />
        </div>
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
            height: '22px',
            width: '64px',
            background: 'rgba(255, 255, 255, 0.1)',
            paddingLeft: '6px',
            fontSize: '12px',
            fontWeight: '500',
            fontVariantNumeric: 'tabular-nums',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: 'white',
            transition: 'all 0.2s ease'
          }}
          value={value.toString()}
          onValueCommit={(value) => onValueChange(Number.parseFloat(value))}
        />
      </div>
    </>
  )
}
