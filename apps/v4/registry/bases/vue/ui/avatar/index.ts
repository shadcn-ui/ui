import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as Avatar } from "./Avatar.vue"
export { default as AvatarBadge } from "./AvatarBadge.vue"
export { default as AvatarFallback } from "./AvatarFallback.vue"
export { default as AvatarGroup } from "./AvatarGroup.vue"
export { default as AvatarGroupCount } from "./AvatarGroupCount.vue"
export { default as AvatarImage } from "./AvatarImage.vue"

export const avatarVariants = cva(
  "cn-avatar after:border-border group/avatar relative flex shrink-0 select-none after:absolute after:inset-0 after:border after:mix-blend-darken dark:after:mix-blend-lighten",
  {
    variants: {
      size: {
        sm: "",
        default: "",
        lg: "",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
)

export type AvatarVariants = VariantProps<typeof avatarVariants>
