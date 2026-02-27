module NextImage = {
  type props = {
    src: string,
    alt: string,
    fill: bool,
    className?: string,
  }

  @module("next/image")
  external make: React.component<props> = "default"
}

@react.component
let make = () =>
  <AspectRatio ratio={9. /. 16.} className="bg-muted w-full max-w-[10rem] rounded-lg">
    <NextImage
      src="https://avatar.vercel.sh/shadcn1"
      alt="Photo"
      fill={true}
      className="rounded-lg object-cover grayscale dark:brightness-20"
    />
  </AspectRatio>
