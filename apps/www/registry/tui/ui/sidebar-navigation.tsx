import React, { useState } from 'react';
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Icon, IconType } from "./icon";
const sideBarNavigationVariant = cva(

)
const sibeBarAnchorVariant = cva(
    " group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
    {
        variants: {
            anchorVariant: {
                default: "text-accent-foreground",
            }
        },
        defaultVariants: {
            anchorVariant: "default"
        }
    }
)

const sibeBarIconVariant = cva(
    "shrink-0 ",
    {
        variants: {
            size: {
                default: "h-6 w-6"
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
                default: "h-10 w-10"
            }
        },
        defaultVariants: {
            size: "default"
        }
    }
)


interface Team {
    icon?: string | undefined;
    name?: string | undefined;
    href?: string | undefined;
}
interface MenuItem {
    href?: string;
    icon?: string;
    text?: string;
    subMenuItems?: { name: string }[];
    badgeCount?: number;
}
interface  SubItem {
    name: string;
}
export interface SideBarNavigationProps
    extends React.HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof sideBarNavigationVariant> {
    href?: string;
    icon?: IconType;
    text?: string
    badgeCount?: number[]
    items?: MenuItem[];
    teams?: Team[];
    imageURL?: string;
    userName?: string;
    divVariant?: "default";
    anchorVariant?: "default";
    iconVariant?: "default" | "primary";
    spanVariant?: "default";
    hasIconAndCount?: boolean;
    iconPrefix?: boolean;
    iconSuffix?: boolean;
    teamName?: string;
    logoImage?: string;
    backgroundColor?: string;
    hasIconAndBadge?: boolean;
    color?: "black" | "white" | "slate" | "gray" | "zinc" | "neutral" | "stone" |
    "red" | "orange" | "amber" | "yellow" | "lime" | "green" | "emerald" | "teal" | "cyan"
    | "sky" | "blue" | "indigo" | "violet" | "purple" | "fuchsia" | "pink" | "rose";
}

const SideBarNavigation = React.forwardRef<HTMLButtonElement, SideBarNavigationProps>(
    ({ className, items, icon, backgroundColor, hasIconAndBadge, divVariant, color, teamName, logoImage, iconPrefix, spanVariant, iconSuffix, iconVariant, anchorVariant, teams, imageURL, userName, ...props }, ref) => {
        const fontColor = (color?: string) => {
            return `text-${color}-700 ring-${color}-700`
        }
        const [isOpen, setIsOpen] = useState<boolean[]>(new Array(items?.length).fill(false));
        const [buttonIcons, setButtonIcons] = useState<IconType[]>(new Array(items?.length).fill("chevron-right-duotone"));
        const handleButtonClick = (index: number) => {
            console.log(`Clicked on item at index ${index}`);
            setIsOpen(prevIsOpen => {
                const updatedIsOpen = [...prevIsOpen];
                updatedIsOpen[index] = !updatedIsOpen[index];
                console.log(`Clicked on item at updatedIsOpen ${updatedIsOpen[index]}`);
                return updatedIsOpen;
            });
            if (index === 1 || index === 2) {
                setButtonIcons(prevIcons => {
                    const updatedIcons = [...prevIcons];
                    updatedIcons[index] = isOpen[index] ? "chevron-right-duotone" : "chevron-down-duotone";
                    return updatedIcons;
                });
            }
        }

        return (
            <>
                <div className={cn(` border flex grow flex-col gap-y-5 overflow-y-auto pl-6 pr-8 ${backgroundColor} `)}>
                    <div className={cn("flex mt-3 shrink-0 items-center", className)}>
                        <img className={cn(sibeBarImageVariant({}), className)} src={logoImage} />
                    </div>
                    <nav className={cn("flex flex-1 flex-col", className)}>
                        <ul>
                            {items && items.map((item:any, index: number) => (
                                <li key={index}>
                                    {index === 1 || index === 2 ? (
                                        <div>
                                            <button onClick={() => handleButtonClick(index)} className={cn('flex items-center justify-between text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-semibold', className)}>
                                                {iconPrefix && <Icon name={buttonIcons[index]} />}
                                                <div className="flex items-center">
                                                    {item.text}
                                                </div>
                                                {iconSuffix && <div className="flex ml-32 items-center">
                                                    <Icon name={buttonIcons[index]} className={cn('shrink-0', className)} />
                                                </div>}
                                            </button>
                                            {isOpen[index] && (
                                                <ul className={cn("mt-1 px-2", className)}>
                                                    {items[index]?.subMenuItems && items[index].subMenuItems?.map((subItem:SubItem, subIndex: number) => (
                                                        <li key={subIndex}>
                                                            <a href="#" className={cn("block rounded-md py-2 pr-2 pl-9 text-sm leading-6", className)}>
                                                                {subItem.name}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>

                                    ) : (
                                        <a href={item.href} className={cn(`${backgroundColor}`  , (sibeBarAnchorVariant({ anchorVariant })), fontColor(color))}>
                                            {hasIconAndBadge && <Icon name={item.icon} className={cn(sibeBarIconVariant({ }))} /> }

                                            {item.text}
                                            {hasIconAndBadge && item.badgeCount && item.badgeCount > 0 && (
                                                    <span className={cn(sibeBarSpanVariant({}), fontColor(color))}>
                                                        {item.badgeCount}
                                                    </span>
                                                ) 
                                            }


                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>

                        <div className={cn("font-semibold leading-6 text-xs mt-10", className)}>{teamName}</div>
                        <ul role="list" className={cn("-mx-2 mt-2 space-y-1", className)}>
                            {teams && teams.map((item: Team, index: number) => (
                                <li key={index}>
                                    <a href={item.href} className={cn("flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold")}>
                                        <span className={cn("flex items-center justify-center rounded-lg border font-medium", sibeBarIconVariant({ }), className)}>{item.icon}</span>
                                        <span className={cn("truncate", className)}>{item.name}</span>
                                    </a>
                                </li>
                            ))}
                            <li className={cn("-mx-6 mt-40", className)}>
                                <a className={cn("flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6", className)}>
                                    <img className={cn("inline-block rounded-full", sibeBarImageVariant({}))} src={imageURL} />
                                    <span>{userName}</span>
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
