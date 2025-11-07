import Image from "next/image"

import { AspectRatio } from "@/registry/radix/ui/aspect-ratio"

export default function AspectRatioDemo() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="bg-background w-full max-w-[1500px] rounded-xl p-8">
        <div className="grid w-full max-w-sm items-start gap-4">
          <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
            <Image
              src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
              alt="Photo by Drew Beamer"
              fill
              className="h-full w-full rounded-lg object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </AspectRatio>
          <AspectRatio ratio={1 / 1} className="bg-muted rounded-lg">
            <Image
              src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
              alt="Photo by Drew Beamer"
              fill
              className="h-full w-full rounded-lg object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </AspectRatio>
        </div>
      </div>
    </div>
  )
}
