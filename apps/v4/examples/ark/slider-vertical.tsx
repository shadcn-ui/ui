import {
  Slider,
  SliderControl,
  SliderRange,
  SliderThumb,
  SliderTrack,
} from "@/examples/ark/ui/slider"

export function SliderVertical() {
  return (
    <div className="mx-auto flex w-full max-w-xs items-center justify-center gap-6">
      <Slider
        defaultValue={[50]}
        max={100}
        step={1}
        orientation="vertical"
        className="h-40"
      >
        <SliderControl>
          <SliderTrack>
            <SliderRange />
          </SliderTrack>
          <SliderThumb index={0} />
        </SliderControl>
      </Slider>
      <Slider
        defaultValue={[25]}
        max={100}
        step={1}
        orientation="vertical"
        className="h-40"
      >
        <SliderControl>
          <SliderTrack>
            <SliderRange />
          </SliderTrack>
          <SliderThumb index={0} />
        </SliderControl>
      </Slider>
    </div>
  )
}
