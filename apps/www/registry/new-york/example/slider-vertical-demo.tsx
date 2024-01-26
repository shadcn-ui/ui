import { cn } from "@/lib/utils"
import { Slider } from "@/registry/new-york/ui/slider"

type SliderVerticalProps = React.ComponentProps<typeof Slider>

export default function SliderVerticalDemo({
  className,
  ...props
}: SliderVerticalProps) {
  return (
    <>
      {/* vertical slider needs its parent container to define the height */}
      <div className="h-[300px]">
        <Slider
          defaultValue={[50]}
          max={100}
          step={1}
          orientation="vertical"
          className={cn("h-[60%]", className)}
          {...props}
        />
      </div>
    </>
  )
}
