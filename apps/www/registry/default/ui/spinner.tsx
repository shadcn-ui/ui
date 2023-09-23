import * as React from "react"

import { cn } from "@/lib/utils"

interface SpinnerBar {
  animationDelay: number
  rotate: number
}

const Spinner = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const spinnerBars: SpinnerBar[] = [
    { animationDelay: -1.2, rotate: 0.0001 },
    { animationDelay: -1.1, rotate: 30 },
    { animationDelay: -1, rotate: 60 },
    { animationDelay: -0.9, rotate: 90 },
    { animationDelay: -0.8, rotate: 120 },
    { animationDelay: -0.7, rotate: 150 },
    { animationDelay: -0.6, rotate: 180 },
    { animationDelay: -0.5, rotate: 210 },
    { animationDelay: -0.4, rotate: 240 },
    { animationDelay: -0.3, rotate: 270 },
    { animationDelay: -0.2, rotate: 300 },
    { animationDelay: -0.1, rotate: 330 },
  ]

  return (
    <div ref={ref} className={cn("h-5 w-5", className)} {...props}>
      <div className="relative left-1/2 top-1/2 h-full">
        {spinnerBars.map((bar) => (
          <div
            key={bar.rotate}
            className="absolute left-[-10%] top-[-3.9%] h-[8%] w-[24%] animate-spinner rounded-md bg-muted-foreground"
            style={{
              animationDelay: `${bar.animationDelay}s`,
              transform: `rotate(${bar.rotate}deg) translate(146%)`,
            }}
          />
        ))}
      </div>
    </div>
  )
})
Spinner.displayName = "Spinner"

export { Spinner }
