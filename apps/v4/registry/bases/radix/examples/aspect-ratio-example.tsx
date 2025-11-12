import Image from "next/image"

import { AspectRatio } from "@/registry/bases/radix/ui/aspect-ratio"

export default function AspectRatioDemo() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="grid w-full max-w-sm items-start gap-4">
        <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
          <Image
            src="https://avatar.vercel.sh/shadcn1"
            alt="Photo"
            fill
            className="h-full w-full rounded-lg object-cover grayscale dark:brightness-50"
          />
        </AspectRatio>
        <AspectRatio ratio={1 / 1} className="bg-muted rounded-lg">
          <Image
            src="https://avatar.vercel.sh/shadcn1"
            alt="Photo"
            fill
            className="h-full w-full rounded-lg object-cover grayscale dark:brightness-50"
          />
        </AspectRatio>
        <AspectRatio ratio={9 / 16} className="bg-muted rounded-lg">
          <Image
            src="https://avatar.vercel.sh/shadcn1"
            alt="Photo"
            fill
            className="h-full w-full rounded-lg object-cover grayscale dark:brightness-50"
          />
        </AspectRatio>
      </div>
    </div>
  )
}
