import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Icon, IconType } from "./icon"

const breadcrumbVariants = cva(
  "flex space-x-4",
  {
    variants: {
      BreadcrumbStyle: {
        fullWidth: "w-full max-w-screen-xl shadow",
        shadow: "shadow"
      }
    }
  }
)

export interface BreadcrumItem {
  icon?: IconType;
  text?: string;
  href: string;
  display: "onlyIcon" | "onlyText" | "iconWithText";
}

export interface BreadcrumbProps
  extends React.HTMLAttributes<HTMLElement>,
  VariantProps<typeof breadcrumbVariants> {
  iconStyle?: string;
  itemIcon?: IconType;
  itemIconStyle?: string;
  items?: BreadcrumItem[];
  BreadcrumbStyle?: "fullWidth" | "shadow";
}

function Breadcrumb({ BreadcrumbStyle, itemIcon = "chevron-right-thin", itemIconStyle, iconStyle, items, className, ...props }: BreadcrumbProps) {

  return (
    <>
      {
        <nav className="flex" aria-label="Breadcrumb">
          <ol role="list" className={cn("px-6", breadcrumbVariants({ BreadcrumbStyle }), className)}>
            {items && items.map((item: BreadcrumItem, index:number) => (
              <li key={item.text} className="flex items-center">
                  {index !== 0 && <Icon name={itemIcon} className={cn('h-full w-6 flex-shrink-0 text-primary/50',`${itemIconStyle}`) } />}
                  <a
                    href={item.href}
                    className={cn("ml-4 text-sm font-medium text-primary/70 flex items-center", className)}
                  >
                    {(item.display === "onlyIcon" || item.display === "iconWithText") &&
                    <>{item.icon && <Icon name={item.icon} className={cn("h-5 w-5 flex-shrink-0 text-primary/50",`${iconStyle}`)} /> }</>
                    }
                    {
                      (item.display === "onlyText" || item.display === "iconWithText") &&
                      <p className={cn("pl-2",className)}>{item.text}</p>
                    }
                  </a>
              </li>
            ))}
          </ol>
        </nav>
      }
    </>
  )
}
Breadcrumb.displayName = "Breadcrumb"
export { Breadcrumb, breadcrumbVariants }
