import { cn } from "@/lib/utils"
import { Slider } from "@/registry/new-york-v4/ui/slider"

type SliderProps = React.ComponentProps<typeof Slider>

export default function SliderDemo({ className, ...props }: SliderProps) {
  return (
    <Slider
      defaultValue={[50]}
      max={100}
      step={1}
      className={cn("w-[60%]", className)}
      {...props}
    />
  )
}
