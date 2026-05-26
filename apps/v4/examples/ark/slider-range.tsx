import {
  Slider,
  SliderControl,
  SliderRange as SliderRangeIndicator,
  SliderThumb,
  SliderTrack,
} from "@/examples/ark/ui/slider"

export function SliderRange() {
  return (
    <Slider
      defaultValue={[25, 50]}
      max={100}
      step={5}
      className="mx-auto w-full max-w-xs"
    >
      <SliderControl>
        <SliderTrack>
          <SliderRangeIndicator />
        </SliderTrack>
        <SliderThumb index={0} />
        <SliderThumb index={1} />
      </SliderControl>
    </Slider>
  )
}
