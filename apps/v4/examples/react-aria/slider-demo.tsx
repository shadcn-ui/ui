import { Slider } from "@/styles/react-aria-nova/ui/slider"

export function SliderDemo() {
  return (
    <Slider
      defaultValue={[75]}
      maxValue={100}
      step={1}
      className="mx-auto w-full max-w-xs"
    />
  )
}
