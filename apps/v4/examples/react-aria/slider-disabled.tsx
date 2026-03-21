import { Slider } from "@/examples/react-aria/ui/slider"

export function SliderDisabled() {
  return (
    <Slider
      defaultValue={[50]}
      maxValue={100}
      step={1}
      isDisabled
      className="mx-auto w-full max-w-xs"
    />
  );
}
