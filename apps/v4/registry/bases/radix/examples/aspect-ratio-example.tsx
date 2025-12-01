import Image from "next/image"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/radix/components/example"
import { AspectRatio } from "@/registry/bases/radix/ui/aspect-ratio"

export default function AspectRatioExample() {
  return (
    <ExampleWrapper className="max-w-4xl 2xl:max-w-4xl">
      <AspectRatio16x9 />
      <AspectRatio21x9 />
      <AspectRatio1x1 />
      <AspectRatio9x16 />
    </ExampleWrapper>
  )
}

function AspectRatio16x9() {
  return (
    <Example title="16:9" className="items-center justify-center">
      <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
        <Image
          src="https://avatar.vercel.sh/shadcn1"
          alt="Photo"
          fill
          className="h-full w-full rounded-lg object-cover grayscale dark:brightness-20"
        />
      </AspectRatio>
    </Example>
  )
}

function AspectRatio1x1() {
  return (
    <Example title="1:1" className="items-start">
      <AspectRatio ratio={1 / 1} className="bg-muted rounded-lg">
        <Image
          src="https://avatar.vercel.sh/shadcn1"
          alt="Photo"
          fill
          className="h-full w-full rounded-lg object-cover grayscale dark:brightness-20"
        />
      </AspectRatio>
    </Example>
  )
}

function AspectRatio9x16() {
  return (
    <Example title="9:16" className="items-center justify-center">
      <AspectRatio ratio={9 / 16} className="bg-muted rounded-lg">
        <Image
          src="https://avatar.vercel.sh/shadcn1"
          alt="Photo"
          fill
          className="h-full w-full rounded-lg object-cover grayscale dark:brightness-20"
        />
      </AspectRatio>
    </Example>
  )
}

function AspectRatio21x9() {
  return (
    <Example title="21:9" className="items-center justify-center">
      <AspectRatio ratio={21 / 9} className="bg-muted rounded-lg">
        <Image
          src="https://avatar.vercel.sh/shadcn1"
          alt="Photo"
          fill
          className="h-full w-full rounded-lg object-cover grayscale dark:brightness-20"
        />
      </AspectRatio>
    </Example>
  )
}
