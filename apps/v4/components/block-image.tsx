import Image from "next/image"

import { cn } from "@/lib/utils"

export function BlockImage({
  name,
  width = 1440,
  height = 900,
  className,
}: Omit<React.ComponentProps<typeof Image>, "src" | "alt"> & { name: string }) {
  return (
    <div
      className={cn(
        "relative aspect-[1440/900] w-full overflow-hidden rounded-lg",
        className
      )}
    >
      <Image
        src={`/r/styles/new-york/${name}-light.png`}
        alt={name}
        width={width}
        height={height}
        className="object-cover dark:hidden"
        data-image="light"
      />
      <Image
        src={`/r/styles/new-york/${name}-dark.png`}
        alt={name}
        width={width}
        height={height}
        className="hidden object-cover dark:block"
        data-image="dark"
      />
    </div>
  )
}
