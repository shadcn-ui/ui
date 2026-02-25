import * as React from "react"

type ImageProps = Omit<React.ComponentPropsWithoutRef<"img">, "src"> & {
  src: string
  alt: string
  fill?: boolean
}

export default function NextImage({ fill, style, ...props }: ImageProps) {
  if (fill) {
    return <img {...props} style={{ ...(style ?? {}), width: "100%", height: "100%" }} />
  }

  return <img {...props} style={style} />
}
