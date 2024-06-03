import { cn } from "@/lib/utils"
import { Slider } from "@/registry/default/ui/slider"

type SliderProps = React.ComponentProps<typeof Slider>

export default function SliderTickMarksHalf({ className, ...props }: SliderProps) {
  return (
    <Slider
      defaultValue={[2]}
      max={5}
      step={1}
      className={cn("w-[60%]", className)}
      showSteps={'half'}
      {...props}
    />
  )
}
