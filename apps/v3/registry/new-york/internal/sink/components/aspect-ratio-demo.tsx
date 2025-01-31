import Image from "next/image"

import { AspectRatio } from "@/registry/new-york/ui/aspect-ratio"

export function AspectRatioDemo() {
  return (
    <div className="grid items-start gap-4 w-full max-w-sm">
      <AspectRatio ratio={16 / 9} className="bg-muted">
        <Image
          src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
          alt="Photo by Drew Beamer"
          fill
          className="h-full w-full rounded-md object-cover"
        />
      </AspectRatio>
      <AspectRatio ratio={1 / 1} className="bg-muted">
        <Image
          src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
          alt="Photo by Drew Beamer"
          fill
          className="h-full w-full rounded-md object-cover"
        />
      </AspectRatio>
    </div>
  )
}
