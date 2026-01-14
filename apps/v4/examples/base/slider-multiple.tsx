import { Slider } from "@/examples/base/ui/slider"

export function SliderMultiple() {
  return <Slider defaultValue={[10, 20, 70]} max={100} step={10} />
}
