import { cn } from "@/lib/utils"
import { Slider } from "@/registry/default/ui/slider"

type SliderProps = React.ComponentProps<typeof Slider>

export default function SliderVertical({ className, ...props }: SliderProps) {
  return (
    <>
      {/* Vertical slider needs its parent container to define the height */}
      <div className="h-64">
        <Slider
          defaultValue={[50]}
          max={100}
          step={1}
          orientation="vertical"
          className={className}
          {...props}
        />
      </div>
    </>
  )
}
