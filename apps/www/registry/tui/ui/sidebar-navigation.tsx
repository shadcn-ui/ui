import React, { useState } from 'react';
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Icon, IconType } from "./icon";
import { colors } from './helper/types';
const sideBarNavigationVariant = cva(

)
const sideBarAnchorVariant = cva(
    " group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
    {
        variants: {
            anchorVariant: {
                primary:"hover:bg-primary/20",
                accent: "hover:bg-accent/20",
                ghost: "hover:bg-accent ",
                soft:"hover:bg-primary/20 hover:text-primary/90",
            }
        }
    }
)

const sibeBarIconVariant = cva(
    "flex items-center justify-center border font-medium ",
    {
        variants: {
            size: {
                default: "h-6 w-6 rounded-lg"
            }
        },
        defaultVariants: {
            size: "default"
        }
    }
)

const sibeBarSpanVariant = cva(
    "ml-auto min-w-max whitespace-nowrap rounded-full  px-2.5 py-0.5 text-center text-xs font-medium leading-5 text-white ring-1 ring-inset ring-indigo-500",
)

const sibeBarImageVariant = cva(
    " ",
    {
        variants: {
            size: {
                default: "h-8 w-8 rounded-full"
            }
        },
        defaultVariants: {
            size: "default"
        }
    }
)

const sibeBarButtonVariant = cva(
    "  flex items-center text-left p-2 gap-x-3 text-sm leading-6 font-semibold",
    {
        variants: {
            variant:{
                default:"hover:bg-accent"
            },
            size: {
                default: "w-full rounded-md"
            }
        },
        defaultVariants: {
            variant:"default",
            size: "default"
        }
    }
)


interface ItemList {
    icon?: string | undefined;
    name?: string | undefined;
    href?: string | undefined;
}
interface MenuItem {
    href?: string | undefined;
    icon?: string | undefined;
    text?: string | undefined;
    subMenuItems?: { name: string | undefined }[];
    badgeCount?: number | undefined;
}
export interface SideBarNavigationProps
    extends React.HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof sideBarNavigationVariant> {
    href?: string | undefined;
    icon?: IconType | undefined;
    items?: MenuItem[] | undefined;
    itemList?: ItemList[] | undefined;
    imageURL?: string | undefined;
    userName?: string | undefined;
    textItem?: string| undefined;
    logoImage?: string| undefined;
    backgroundColor?: colors| undefined;
    hasIconAndBadge?: boolean| undefined;
    textColor?: colors| undefined;
    iconStyle?:string| undefined;
    divVariant?: "default";
    anchorVariant?: "accent" | "primary" | "ghost" | "soft";
    iconVariant?: "default" | "primary";
    spanVariant?: "default";
    alignIcon?: "left" | "right";
}

const SideBarNavigation = React.forwardRef<HTMLButtonElement, SideBarNavigationProps>(
    ({ className, items, icon, alignIcon,iconStyle, backgroundColor, hasIconAndBadge, divVariant, textColor, textItem, logoImage, spanVariant, iconVariant, anchorVariant, itemList, imageURL, userName, ...props }, ref) => {
        const fontColor = (textColor?: colors) => {
            return `text-${textColor}-400`
        }
        const bgColor = (backgroundColor?: colors) => {
            return `${backgroundColor}`=== "gray" ? `bg-${backgroundColor}-900`:`bg-${backgroundColor}-700`
        }
        const [isOpen, setIsOpen] = useState<boolean[]>(new Array(items?.length).fill(false))
        const handleButtonClick = (index: number) => {
            setIsOpen(prevIsOpen => {
                const updatedIsOpen = [...prevIsOpen];
                updatedIsOpen[index] = !updatedIsOpen[index];
                return updatedIsOpen;
            });
        }

        return (
            <>
                <div className={cn(" border flex grow flex-col gap-y-5 overflow-y-auto pl-6 pr-8", bgColor(backgroundColor), className)}>
                    <div className={cn("flex mt-3 shrink-0 items-center", className)}>
                        <img className={cn(sibeBarImageVariant({}), className)} src={logoImage} />
                    </div>
                    <nav className={cn("flex flex-1 flex-col", className)}>
                        <ul>
                            {items && items.map((item: any, index:number) => (
                                <li key={index}>
                                    {item.subMenuItems ? (
                                        <div>
                                            <button onClick={() => handleButtonClick(index)} className={cn(sibeBarButtonVariant({}),fontColor(textColor), className)}>                    
                                                        {item.icon && <Icon name={item.icon} className={cn(`${iconStyle}`,className)} />}
                                                        {alignIcon === "right" ? isOpen[index] ? <Icon name={'chevron-down-duotone'} /> : <Icon name={'chevron-right-duotone'} /> : null}
                                                        {item.text}
                                                        {alignIcon === "left" ? isOpen[index]  ? <Icon name={'chevron-down-duotone'} className={cn(`shrink-0 ml-auto`, className)} /> : <Icon name={'chevron-right-duotone'} className={cn(`shrink-0 ml-auto`, className)} /> : null}
                                            </button>
                                            {isOpen[index] && (
                                                <ul className={cn("mt-1 px-2", className)}>
                                                    {item.subMenuItems.map((subItem:any, subIndex: number) => (
                                                        <li key={subIndex}>
                                                            <a href="#" className={cn("block rounded-md py-2 pr-2 pl-9 text-sm hover:bg-accent leading-6", className)}>
                                                                {subItem.name}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ) : (
                                        <a href={item.href} className={cn(sideBarAnchorVariant({ anchorVariant }), fontColor(textColor), bgColor(backgroundColor), className)}>
                                            {item.icon && <Icon name={item.icon} className={cn(`${iconStyle}`,className)} />}
                                            {item.text}
                                            {hasIconAndBadge && item.badgeCount && item.badgeCount > 0 && (
                                                <span className={cn(sibeBarSpanVariant({}), fontColor(textColor),className)}>
                                                    {item.badgeCount}
                                                </span>
                                            )}
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>

                        <div className={cn("font-semibold leading-6 text-xs mt-10",fontColor(textColor), className)}>{textItem}</div>
                        <ul role="list" className={cn("-mx-2 mt-2 space-y-1", className)}>
                            {itemList && itemList.map((item: ItemList, index: number) => (
                                <li key={index}>
                                    <a href={item.href} className={cn("cursor-pointer",sideBarAnchorVariant({anchorVariant}),fontColor(textColor),className)}>
                                        <span className={cn(sibeBarIconVariant({}), className)}>{item.icon}</span>
                                        <span className={cn("truncate", className)}>{item.name}</span>
                                    </a>
                                </li>
                            ))}
                            <li className={cn("mt-40",className)}>
                                <a className={cn("flex items-center gap-x-4 mt-10 px-6 py-3 cursor-pointer",sideBarAnchorVariant({anchorVariant}), className)}>
                                    <img className={cn("inline-block", sibeBarImageVariant({}),className)} src={imageURL} />
                                    <span className={cn(fontColor(textColor),className)}>{userName}</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>


            </>
        )
    }
)
SideBarNavigation.displayName = "SideBarNavigation"

export { SideBarNavigation, sideBarNavigationVariant }
