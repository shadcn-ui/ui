import { Slider } from "@/styles/aria-nova/ui/slider"

export function SliderVertical() {
  return (
    <div className="mx-auto flex w-full max-w-xs items-center justify-center gap-6">
      <Slider
        aria-label="Vertical slider"
        defaultValue={[50]}
        maxValue={100}
        step={1}
        orientation="vertical"
        className="h-40"
      />
      <Slider
        aria-label="Vertical slider"
        defaultValue={[25]}
        maxValue={100}
        step={1}
        orientation="vertical"
        className="h-40"
      />
    </div>
  )
}
