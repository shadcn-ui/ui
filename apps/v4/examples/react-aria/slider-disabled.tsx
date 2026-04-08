import { Slider } from "@/styles/react-aria-nova/ui/slider"

export function SliderDisabled() {
  return (
    <Slider
      defaultValue={[50]}
      maxValue={100}
      step={1}
      isDisabled
      className="mx-auto w-full max-w-xs"
    />
  )
}
