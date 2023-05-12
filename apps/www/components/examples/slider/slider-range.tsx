import { cn } from "@/lib/utils"
import { Slider, SliderThumb } from "@/components/ui/slider"

type SliderProps = React.ComponentProps<typeof Slider>

export function SliderRange({ className, ...props }: SliderProps) {
  return (
    <Slider
      defaultValue={[20, 50]}
      max={100}
      step={1}
      className={cn("w-[60%]", className)}
      {...props}
    >
        <SliderThumb />
        <SliderThumb />
    </Slider>
  )
}
