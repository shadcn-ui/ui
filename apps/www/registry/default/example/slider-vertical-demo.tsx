import { Slider } from "@/registry/default/ui/slider"

type SliderVerticalProps = React.ComponentProps<typeof Slider>

export default function SliderVerticalDemo({
  className,
  ...props
}: SliderVerticalProps) {
  return (
    <div className="flex h-[300px] w-full flex-row justify-between gap-2">
      {/* vertical slider needs its parent container to define the height */}
      <Slider
        defaultValue={[100]}
        max={100}
        step={1}
        orientation="vertical"
        className={className}
        {...props}
      />
      <Slider
        defaultValue={[80]}
        max={100}
        step={1}
        orientation="vertical"
        className={className}
        {...props}
      />
      <Slider
        defaultValue={[60]}
        max={100}
        step={1}
        orientation="vertical"
        className={className}
        {...props}
      />
      <Slider
        defaultValue={[40]}
        max={100}
        step={1}
        orientation="vertical"
        className={className}
        {...props}
      />
      <Slider
        defaultValue={[20]}
        max={100}
        step={1}
        orientation="vertical"
        className={className}
        {...props}
      />
      <Slider
        defaultValue={[40]}
        max={100}
        step={1}
        orientation="vertical"
        className={className}
        {...props}
      />
      <Slider
        defaultValue={[60]}
        max={100}
        step={1}
        orientation="vertical"
        className={className}
        {...props}
      />
      <Slider
        defaultValue={[80]}
        max={100}
        step={1}
        orientation="vertical"
        className={className}
        {...props}
      />
      <Slider
        defaultValue={[100]}
        max={100}
        step={1}
        orientation="vertical"
        className={className}
        {...props}
      />
    </div>
  )
}
