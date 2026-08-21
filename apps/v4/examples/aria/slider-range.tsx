import { Slider } from "@/styles/aria-nova/ui/slider"

export function SliderRange() {
  return (
    <Slider
      aria-label="Range"
      defaultValue={[25, 50]}
      maxValue={100}
      step={5}
      className="mx-auto w-full max-w-xs"
    />
  )
}
