import type { VariantProps } from "class-variance-authority"
import type { HTMLAttributes } from "vue"
import { cva } from "class-variance-authority"

export interface SidebarProps {
  side?: "left" | "right"
  variant?: "sidebar" | "floating" | "inset"
  collapsible?: "offcanvas" | "icon" | "none"
  class?: HTMLAttributes["class"]
}

export { default as Sidebar } from "./Sidebar.vue"
export { default as SidebarContent } from "./SidebarContent.vue"
export { default as SidebarFooter } from "./SidebarFooter.vue"
export { default as SidebarGroup } from "./SidebarGroup.vue"
export { default as SidebarGroupAction } from "./SidebarGroupAction.vue"
export { default as SidebarGroupContent } from "./SidebarGroupContent.vue"
export { default as SidebarGroupLabel } from "./SidebarGroupLabel.vue"
export { default as SidebarHeader } from "./SidebarHeader.vue"
export { default as SidebarInput } from "./SidebarInput.vue"
export { default as SidebarInset } from "./SidebarInset.vue"
export { default as SidebarMenu } from "./SidebarMenu.vue"
export { default as SidebarMenuAction } from "./SidebarMenuAction.vue"
export { default as SidebarMenuBadge } from "./SidebarMenuBadge.vue"
export { default as SidebarMenuButton } from "./SidebarMenuButton.vue"
export { default as SidebarMenuItem } from "./SidebarMenuItem.vue"
export { default as SidebarMenuSkeleton } from "./SidebarMenuSkeleton.vue"
export { default as SidebarMenuSub } from "./SidebarMenuSub.vue"
export { default as SidebarMenuSubButton } from "./SidebarMenuSubButton.vue"
export { default as SidebarMenuSubItem } from "./SidebarMenuSubItem.vue"
export { default as SidebarProvider } from "./SidebarProvider.vue"
export { default as SidebarRail } from "./SidebarRail.vue"
export { default as SidebarSeparator } from "./SidebarSeparator.vue"
export { default as SidebarTrigger } from "./SidebarTrigger.vue"

export { useSidebar } from "./utils"

export const sidebarMenuButtonVariants = cva(
  "cn-sidebar-menu-button peer/menu-button flex w-full items-center overflow-hidden outline-hidden disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "cn-sidebar-menu-button-variant-default",
        outline: "cn-sidebar-menu-button-variant-outline",
      },
      size: {
        default: "cn-sidebar-menu-button-size-default",
        sm: "cn-sidebar-menu-button-size-sm",
        lg: "cn-sidebar-menu-button-size-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export type SidebarMenuButtonVariants = VariantProps<typeof sidebarMenuButtonVariants>
