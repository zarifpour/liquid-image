import { Slider } from 'radix-ui';

type SliderControlProps = {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
};
export function SliderControl({ value, min, max, step, onChange }: SliderControlProps) {
  return (
    <>
      <Slider.Root
        className="relative flex h-5 w-[200px] touch-none select-none items-center"
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(value) => onChange(value[0])}
      >
        <Slider.Track className="relative h-[3px] grow rounded-full bg-gray-500">
          <Slider.Range className="absolute h-full rounded-full bg-gray-800" />
        </Slider.Track>
        <Slider.Thumb
          className="shadow-blackA4 hover:bg-violet3 block size-5 rounded-[10px] bg-white shadow-[0_2px_10px] focus:shadow-[0_0_0_5px] focus:shadow-black focus:outline-none"
          aria-label="Volume"
        />
      </Slider.Root>
    </>
  );
}
