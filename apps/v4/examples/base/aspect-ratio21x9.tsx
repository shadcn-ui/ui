import Image from "next/image"
import { AspectRatio } from "@/examples/base/ui/aspect-ratio"

export function AspectRatio21x9() {
  return (
    <AspectRatio ratio={21 / 9} className="bg-muted rounded-lg">
      <Image
        src="https://avatar.vercel.sh/shadcn1"
        alt="Photo"
        fill
        className="h-full w-full rounded-lg object-cover grayscale dark:brightness-20"
      />
    </AspectRatio>
  )
}
