declare module "*.svg?react" {
  import type { FC, SVGProps } from "react"

  const Component: FC<SVGProps<SVGSVGElement>>
  export default Component
}
