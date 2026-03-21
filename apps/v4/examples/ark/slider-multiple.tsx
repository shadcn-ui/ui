import {
  Slider,
  SliderControl,
  SliderRange,
  SliderThumb,
  SliderTrack,
} from "@/examples/ark/ui/slider"

export function SliderMultiple() {
  return (
    <Slider
      defaultValue={[10, 20, 70]}
      max={100}
      step={10}
      className="mx-auto w-full max-w-xs"
    >
      <SliderControl>
        <SliderTrack>
          <SliderRange />
        </SliderTrack>
        <SliderThumb index={0} />
        <SliderThumb index={1} />
        <SliderThumb index={2} />
      </SliderControl>
    </Slider>
  )
}
