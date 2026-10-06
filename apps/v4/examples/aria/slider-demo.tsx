import { Slider } from "@/styles/aria-nova/ui/slider"

export function SliderDemo() {
  return (
    <Slider
      aria-label="Slider"
      defaultValue={[75]}
      maxValue={100}
      step={1}
      className="mx-auto w-full max-w-xs"
    />
  )
}
