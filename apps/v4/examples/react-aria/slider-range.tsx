import { Slider } from "@/examples/react-aria/ui/slider"

export function SliderRange() {
  return (
    <Slider
      defaultValue={[25, 50]}
      maxValue={100}
      step={5}
      className="mx-auto w-full max-w-xs"
    />
  );
}
