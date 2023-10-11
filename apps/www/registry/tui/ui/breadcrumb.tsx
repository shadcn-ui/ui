import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Icon } from "./icon"
import { colors } from "./helper/types"

const breadcrumbsVariants = cva(
  "flex space-x-4",
  {
    variants: {
        size: {
          default:"w-full max-w-screen-xl"
        }
    }
  }
)

interface DataItem {
  icon?: string;
  seperatorIcon?: string;
  text?: string;
  href?: string;
  display?: string;
}

export interface BreadcrumbsProps
  extends React.HTMLAttributes<HTMLElement>,
  VariantProps<typeof breadcrumbsVariants> {
  iconStyle?: string;
  separatorIconStyle?: string;
  dataItem?: DataItem[];
  contained?: boolean;
  fullWidthContained?: boolean;
  withChevronSeparator?: boolean;
  withSlashSeparator?: boolean;
  textColor?:colors;
  size?:"default";
}

function Breadcrumbs({ children, className,textColor,size, separatorIconStyle,  iconStyle, withSlashSeparator,fullWidthContained, withChevronSeparator, contained, dataItem, ...props }: BreadcrumbsProps) {

  const fontColor = (textColor?: colors) => {
    return `text-${textColor}-500 hover:text-${textColor}-700 `
  }

  return (
    <>
      {
        contained ?
          <nav className="flex" aria-label="Breadcrumb">
            <ol role="list" className={cn("rounded-md px-6 shadow",breadcrumbsVariants({}), className)}>
              {dataItem && dataItem.map((item: any) => (
                <li key={item.name} className="flex">
                  <div className="flex items-center">
                    <a
                      href={item.href}
                      className={cn("ml-4 text-sm font-medium",fontColor(textColor), className)}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      <div className="flex items-center">
                        {
                          item.display === "onlyText" ?
                            <>
                              {item.text}
                              {item.separatorIcon && <Icon name={item.separatorIcon} className={`${separatorIconStyle}`} />}
                            </>
                            : item.display === "onlyIcon" ?
                              <>
                                {item.icon && <Icon name={item.icon} className={cn("pr-2.5", `${iconStyle}`, className)} />}
                                {item.separatorIcon && <Icon name={item.separatorIcon} className={`${separatorIconStyle}`} />}
                              </>
                              : item.display === "iconWithText" ?
                                <>
                                  {item.icon && <Icon name={item.icon} className={cn("pr-2.5", `${iconStyle}`, className)} />}
                                  {item.text}
                                  {item.separatorIcon && <Icon name={item.separatorIcon} className={cn("pl-3", `${separatorIconStyle}`)} />}
                                </>
                                : null
                        }
                      </div>
                    </a>
                  </div>
                </li>
              ))}
            </ol>
          </nav> :
          fullWidthContained ?
            <nav className={cn("flex border-b border-gray-200 ", className)} aria-label="Breadcrumb">
              <ol role="list" className={cn("mx-auto px-4 sm:px-6 lg:px-8",breadcrumbsVariants({size}), className)}>
                {dataItem && dataItem.map((item: any) => (
                  <li key={item.name} className="flex">
                    <div className="flex items-center">
                      <a
                        href={item.href}
                        className={cn("ml-4 text-sm font-medium ",fontColor(textColor), className)}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        <div className="flex items-center">
                          {
                            item.display === "onlyText" ?
                              <>

                                {item.text}
                                {item.separatorIcon && <Icon name={item.separatorIcon} className={`${separatorIconStyle}`} />}

                              </>
                              : item.display === "onlyIcon" ?
                                <>
                                  {item.icon && <Icon name={item.icon} className={cn("pr-2.5", `${iconStyle}`, className)} />}
                                  {item.separatorIcon && <Icon name={item.separatorIcon} className={`pl-2.5 ${separatorIconStyle}`} />}
                                </>
                                : item.display === "iconWithText" ?
                                  <>
                                    {item.icon && <Icon name={item.icon} className={cn("pr-2.5", `${iconStyle}`, className)} />}
                                    {item.text}
                                    {item.separatorIcon && <Icon name={item.separatorIcon} className={cn("pl-3,", `${separatorIconStyle}`)} />}
                                  </>
                                  : null
                          }
                        </div>
                      </a>
                    </div>
                  </li>
                ))}
              </ol>
            </nav> :
            withChevronSeparator ?
              <nav className={cn("flex", className)} aria-label="Breadcrumb">
                <ol role="list" className={cn("items-center",breadcrumbsVariants({}), className)}>
                  {dataItem && dataItem.map((item: any) => (
                    <li key={item.name} className="flex">
                      <div className="flex items-center">
                        <a
                          href={item.href}
                          className={cn("ml-4 text-sm font-medium ",fontColor(textColor), className)}
                          aria-current={item.current ? 'page' : undefined}
                        >
                          <div className="flex items-center">
                            {
                              item.display === "onlyText" ?
                                <>

                                  {item.text}
                                  {item.separatorIcon && <Icon name={item.separatorIcon} className={`pl-2.5 ${separatorIconStyle}`} />}

                                </>
                                : item.display === "onlyIcon" ?
                                  <>
                                    {item.icon && <Icon name={item.icon} className={cn("pr-2.5", `${iconStyle}`, className)} />}
                                    {item.separatorIcon && <Icon name={item.separatorIcon} className={`pl-2.5 ${separatorIconStyle}`} />}
                                  </>
                                  : item.display === "iconWithText" ?
                                    <>
                                      {item.icon && <Icon name={item.icon} className={cn("pr-2.5", `${iconStyle}`, className)} />}
                                      {item.text}
                                      {item.separatorIcon && <Icon name={item.separatorIcon} className={cn("pl-3", `${separatorIconStyle}`)} />}
                                    </>
                                    : null
                            }
                          </div>
                        </a>
                      </div>
                    </li>
                  ))}
                </ol>
              </nav> : withSlashSeparator ?
                <nav className={cn("flex", className)} aria-label="Breadcrumb">
                  <ol role="list" className={cn("items-center",breadcrumbsVariants({}), className)}>
                    {dataItem && dataItem.map((item: any) => (
                      <li key={item.name} className="flex">
                        <div className="flex items-center">
                          <a
                            href={item.href}
                            className={cn("ml-4 text-sm font-medium ",fontColor(textColor), className)}
                            aria-current={item.current ? 'page' : undefined}
                          >
                            <div className="flex items-center">
                              {
                                item.display === "onlyText" ?
                                  <>

                                    {item.text}
                                    {item.separatorIcon && <Icon name={item.separatorIcon} className={`pl-2.5 ${separatorIconStyle}`} />}

                                  </>
                                  : item.display === "onlyIcon" ?
                                    <>
                                      {item.icon && <Icon name={item.icon} className={cn("pr-2.5", `${iconStyle}`, className)} />}
                                      {item.separatorIcon && <Icon name={item.separatorIcon} className={`pl-2.5 ${separatorIconStyle}`} />}
                                    </>
                                    : item.display === "iconWithText" ?
                                      <>
                                        {item.icon && <Icon name={item.icon} className={cn("pr-2.5", `${iconStyle}`, className)} />}
                                        {item.text}
                                        {item.separatorIcon && <Icon name={item.separatorIcon} className={cn("pl-3", `${separatorIconStyle}`)} />}
                                      </>
                                      : null
                              }
                            </div>
                          </a>
                        </div>
                      </li>
                    ))}
                  </ol>
                </nav> : null
      }
    </>
  )
}
Breadcrumbs.displayName = "Breadcrumbs"
export { Breadcrumbs, breadcrumbsVariants }
