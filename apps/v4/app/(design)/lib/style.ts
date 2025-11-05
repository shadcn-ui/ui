import { STYLES } from "@/registry/legacy-styles"

export const designSystemStyles = STYLES.filter(
  (style) => style.name !== "new-york-v4"
)

export type DesignSystemStyle = (typeof designSystemStyles)[number]
