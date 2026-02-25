import * as React from "react"

type AnchorProps = React.ComponentPropsWithoutRef<"a"> & {
  href: string
}

export default function NextLink({ href, children, ...props }: AnchorProps) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  )
}
