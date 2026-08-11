import { Slider } from "@/styles/aria-nova/ui/slider"

export function SliderMultiple() {
  return (
    <Slider
      aria-label="Multiple slider"
      defaultValue={[10, 20, 70]}
      maxValue={100}
      step={10}
      className="mx-auto w-full max-w-xs"
    />
  )
}
