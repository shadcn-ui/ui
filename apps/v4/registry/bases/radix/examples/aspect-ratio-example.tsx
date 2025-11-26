import Image from "next/image"

import { CanvaFrame } from "@/components/canva"
import { AspectRatio } from "@/registry/bases/radix/ui/aspect-ratio"

export default function AspectRatioDemo() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6 lg:p-12">
      <div className="flex w-full max-w-lg flex-col gap-12">
        <AspectRatio16x9 />
        <AspectRatio1x1 />
        <AspectRatio9x16 />
      </div>
    </div>
  )
}

function AspectRatio16x9() {
  return (
    <CanvaFrame title="16:9">
      <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
        <Image
          src="https://avatar.vercel.sh/shadcn1"
          alt="Photo"
          fill
          className="h-full w-full rounded-lg object-cover grayscale dark:brightness-20"
        />
      </AspectRatio>
    </CanvaFrame>
  )
}

function AspectRatio1x1() {
  return (
    <CanvaFrame title="1:1">
      <AspectRatio ratio={1 / 1} className="bg-muted rounded-lg">
        <Image
          src="https://avatar.vercel.sh/shadcn1"
          alt="Photo"
          fill
          className="h-full w-full rounded-lg object-cover grayscale dark:brightness-20"
        />
      </AspectRatio>
    </CanvaFrame>
  )
}

function AspectRatio9x16() {
  return (
    <CanvaFrame title="9:16">
      <AspectRatio ratio={9 / 16} className="bg-muted rounded-lg">
        <Image
          src="https://avatar.vercel.sh/shadcn1"
          alt="Photo"
          fill
          className="h-full w-full rounded-lg object-cover grayscale dark:brightness-20"
        />
      </AspectRatio>
    </CanvaFrame>
  )
}
