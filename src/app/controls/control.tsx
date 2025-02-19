import { SliderControl } from './slider';

type ControlProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
};

/** A single control for one parameter, with a label, a slider, and an input */
export const Control = ({ label, value, min, max, step, onChange }: ControlProps) => {
  return (
    <div className="grid grid-cols-3 items-center gap-2">
      <label>{label}</label>
      <SliderControl value={value} min={min} max={max} step={step} onChange={onChange} />
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="rounded-md border px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};
