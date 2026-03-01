"use client"

import { AspectRatio } from "@/registry/new-york/ui/aspect-ratio"

export function PromoVideo() {
  return (
    <AspectRatio
      ratio={16 / 9}
      className="overflow-hidden rounded-lg border bg-white shadow-xl"
    >
      <video autoPlay muted playsInline>
        <source
          src="https://ui-shadcn.s3.amazonaws.com/ui-promo-hd.mp4"
          type="video/mp4"
        />
      </video>
    </AspectRatio>
  )
}
