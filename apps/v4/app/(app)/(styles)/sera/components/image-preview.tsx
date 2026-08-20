import Image from "next/image"

import { cn } from "@/lib/utils"

export function ImagePreview() {
  return (
    <div className="mt-8 flex flex-col overflow-hidden md:hidden">
      <ImagePreviewItem name="sera-01" />
      <ImagePreviewItem name="sera-03" />
      <ImagePreviewItem name="sera-02" />
      <ImagePreviewItem name="sera-06" />
    </div>
  )
}

function ImagePreviewItem({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "theme-taupe overflow-hidden bg-muted px-4 py-2 first:pt-4 last:pb-4",
        className
      )}
    >
      <Image
        src={`/images/${name}-light.png`}
        alt={name}
        width={1440}
        height={900}
        className="dark:hidden"
      />
      <Image
        src={`/images/${name}-dark.png`}
        alt={name}
        width={1440}
        height={900}
        className="hidden dark:block"
      />
    </div>
  )
}
