import Image from "next/image"
import { AspectRatio } from "@/examples/radix/ui/aspect-ratio"

export function AspectRatio9x16() {
  return (
    <AspectRatio ratio={9 / 16} className="bg-muted rounded-lg">
      <Image
        src="https://avatar.vercel.sh/shadcn1"
        alt="Photo"
        fill
        className="h-full w-full rounded-lg object-cover grayscale dark:brightness-20"
      />
    </AspectRatio>
  )
}
