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
  <figure className="w-full max-w-sm" dir="rtl">
    <AspectRatio ratio={16. /. 9.} className="bg-muted rounded-lg">
      <NextImage
        src="https://avatar.vercel.sh/shadcn1"
        alt="Photo"
        fill={true}
        className="rounded-lg object-cover grayscale dark:brightness-20"
      />
    </AspectRatio>
    <figcaption className="text-muted-foreground mt-2 text-center text-sm">
      {"منظر طبيعي جميل"->React.string}
    </figcaption>
  </figure>
