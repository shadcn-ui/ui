import React, { ChangeEvent, useState } from 'react';
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Icon, IconType } from "./icon"
import { Input } from './input';
import { colors } from './helper/types';


const commandPalettesVariants = cva(
    "relative z-10 ",
    {
        variants: {
            variant: {
                outline: " bg-background hover:bg-accent hover:text-accent-foreground",
                accent: " hover:text-accent",
                dark: "hover:bg-primary/80 hover:text-primary-foreground text-gray-500"
            },
        }
    }
)

export interface PersonList {
    id?: number;
    name?: string;
    url?: string;
}

export interface ItemList {
    title?: string;
    description?: string;
    icon?: IconType;
    backgroundStyle?: string;
    url?: string;
}

export interface DataItem {
    name?: string;
    image?: string;
    position?: string;
    phone?: number;
    url?: string;
    email?: string;
    imageStyle?: string;
    icon?: IconType;
}
export interface ListItem {
    icon?: IconType;
    keyboardName?: string;
    command?: string;
    url?: string;
}

export interface CommandPalettesProps
    extends React.HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof commandPalettesVariants> {
    withInputIcon?: boolean;
    hasFooter?: boolean;
    withPreview?: boolean;
    haskeyboard?: boolean;
    description?: "withoutDescriptionText" | "withDescriptionText";
    variant?: "outline" | "accent" | "dark";
    listTitleName?: string;
    searchNameText?: string;
    titleText?: string;
    projectListName?: string;
    noResultText?: string;
    noFoundCommentText?: string;
    buttonName?: string;
    iconStyle?: string;
    imageStyle?: string;
    backgroundColor?: colors;
    icon?: IconType;
    errorIcon?: IconType;
    folderIcon?: IconType;
    noFoundIcon?: IconType;
    inputValue?: string;
    onSearch: (query: string) => void;
    searchedList?: string[] | ItemList[] | DataItem[] | ListItem[];
}

const CommandPalettes = React.forwardRef<HTMLButtonElement, CommandPalettesProps>(
    ({ withInputIcon = true, noFoundIcon, onSearch, imageStyle, searchedList, inputValue, buttonName, iconStyle, noResultText, backgroundColor, withPreview, hasFooter, projectListName, searchNameText, listTitleName, titleText, folderIcon, description, haskeyboard, errorIcon, icon, noFoundCommentText,variant, className, ...props }, ref) => {

        const bgColor = (backgroundColor?: colors) => {
            return `bg-${backgroundColor}-900 `
        }

        const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);
        let [open, setOpen] = useState(false);

        const handleMouseEnter = (item: ItemList) => {
            setSelectedItem(item);

        }
        const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                const inputValue = e.currentTarget.value.trim();
                if (inputValue !== "") {
                    onSearch(inputValue);
                    setOpen(true);
                }
            } else if (e.currentTarget.value.length === 0) {
                setOpen(false);
            }
        };

        return (
            <>
                <div className={cn((commandPalettesVariants({}), className))}>
                    {withInputIcon ? <Input alignIcon="left" onKeyDown={onKeyDown} className={cn(`h-12 rounded-none  border-primary/20 ${open ? "rounded-t-lg border-b-0" : "rounded-lg"}`, bgColor(backgroundColor), className)} iconStyle="h-5 w-5" labelAndBorderStyle="iconWithLabel" icon="magnifying-glass-duotone" color="gray" placeholder="Search..." />
                        : <div className={cn(`mx-auto transform p-2 ring-1 ring-black  ring-opacity-5 transition-all ${open ? "rounded-t-lg border-b-0" : "rounded-lg"}`)}>
                            <input type="text" className={cn(`w-full rounded-md bg-primary/10 px-4 py-2.5 ring-0 focus:outline-none`, className)} placeholder="Search..." onKeyDown={onKeyDown} /></div>
                    }
                    {description === "withoutDescriptionText" && open ? (
                        <div className={cn("border border-t-0 rounded-b-lg border-primary/20", className)}>
                            {searchedList && searchedList.length > 0 ? (
                                <ul className={cn("scroll-py-2 overflow-y-auto py-2", className)}>
                                    {searchedList && searchedList.map((item: any, index: number) => (
                                        <li key={index} className={cn("text-sm py-2 flex cursor-pointer select-none items-center px-3 py-2 text-primary hover:text-primary-foreground hover:bg-indigo-600 ", className)}>
                                            <a href={item.url}>{item.name}</a>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <>
                                    {icon ? (
                                        <div className={cn("px-4 py-14 text-center sm:px-14", className)}>
                                            {icon && <Icon name={icon} className={cn(`h-5 w-5 ${iconStyle}`,className)} />}
                                            <p className={cn("p-4 text-sm text-primary/50", className)}>{noFoundCommentText}</p>
                                        </div>
                                    ) : (
                                        <p className={cn("p-4 text-sm text-primary/50", className)}>{noFoundCommentText}</p>
                                    )}
                                </>
                            )}
                        </div>
                    ) : (

                        <>
                            {description === "withDescriptionText" && open ? (
                                searchedList && searchedList.length > 0 ? (
                                    <div className={cn("border rounded-b-lg")}>
                                        <ul className={cn("scroll-py-2 overflow-y-auto py-2 text-accent/50 ", className)}>
                                            {searchedList && searchedList.map((item: ItemList | string, index: number) => (
                                                typeof item === 'object' && item !== null && 'title' in item && 'description' in item && (
                                                    <li key={index} className={cn("rounded-xl flex cursor-pointer select-none items-center px-3 py-2 p-3 mx-2 hover:bg-accent/50 text-primary/50", bgColor(backgroundColor), className)}>
                                                        <div className={cn(`flex flex-none items-center justify-center rounded-lg ${item.backgroundStyle}`)}>
                                                            {item.icon && <Icon name={item.icon} className={cn(` h-5 w-5 text-primary-foreground ${iconStyle}`, className)} />}
                                                        </div>
                                                        <div className={cn("ml-4 flex-auto", className)}>
                                                            <a href={item.url}>
                                                                <p className={cn("text-sm font-medium text-primary/50", className)}>{item.title}</p>
                                                                <p className={cn("text-sm text-primary/50", className)}>{item.description}</p>
                                                            </a>
                                                        </div>
                                                    </li>
                                                )
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <div className={cn("px-6 py-14 border rounded-b-lg text-center text-sm sm:px-14", className)}>
                                        {errorIcon && <Icon name={errorIcon} className={` h-5 w-5 ${iconStyle}`} />}
                                        <p className={cn("mt-4 font-semibold", className)}>{noResultText}</p>
                                        <p className={cn("mt-2 text-primary/50", className)}>{noFoundCommentText}</p>
                                    </div>
                                )
                            ) : null

                            }
                        </>
                    )}

                    {
                        haskeyboard && open ?
                            <div className={cn("border rounded-b-lg", bgColor(backgroundColor), className)}>
                                <ul className={cn("scroll-py-2 overflow-y-auto py-2 text-primary/50", className)}>
                                    <li>
                                        {searchedList && searchedList.length > 0 && open ?
                                            <>
                                                <li>
                                                    {searchNameText ? <h2 className={cn("mb-2 mt-4 px-3 text-xs font-semibold text-primary/50", className)}>{searchNameText}</h2> : null}
                                                    {listTitleName ? <h2 className={cn("bg-accent/50 mt-[-8px] px-4 py-2.5 text-xs font-semibold", className)}>{listTitleName}</h2> : null}
                                                    <ul className={cn("text-sm text-primary/50", bgColor(backgroundColor), className)}>
                                                        {
                                                            !hasFooter ?
                                                                <li className={cn("flex cursor-pointer select-none items-center px-3 py-2", commandPalettesVariants({ variant }), className)}>
                                                                    {folderIcon && <Icon name={folderIcon} className={cn(`h-5 w-5 text-primary/90,${iconStyle}`,className)} />}
                                                                    <span className={cn("ml-3 flex-auto truncate text-primary/90 ",commandPalettesVariants({variant}), className)}>{titleText}</span>
                                                                </li> : null
                                                        }
                                                    </ul>
                                                </li>
                                                {projectListName ? <h2 className={cn("bg-accent/50 px-4 mt-[-7px] py-2.5 text-xs font-semibold", className)}>{projectListName}</h2> : null}

                                            </>
                                            : null}
                                        {
                                            open ?
                                                <ul className={cn("text-sm text-primary/90", bgColor(backgroundColor), className)}>
                                                    {searchedList && searchedList.length > 0 ? (
                                                        searchedList.map((item: any, index: number) => (
                                                            <li key={index} className={cn("flex cursor-pointer select-none items-center px-3 py-2 hover:bg-indigo-600 hover:text-primary/50", commandPalettesVariants({ variant }), className)}>
                                                                {item.icon && <Icon name={item.icon} className={cn(`h-5 w-5 text-primary/50 ${iconStyle}`,className)} />}
                                                                <span className={cn("ml-3 flex-auto truncate", className)}>{item.command}</span>
                                                                <span className={cn("ml-3 flex-none text-xs font-semibold ", className)}>
                                                                    <kbd className={cn("font-sans")}>{item.keyboardName}</kbd>
                                                                </span>
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <>
                                                            <div className={cn("px-6 py-14 text-center sm:px-14", className)}>
                                                                {noFoundIcon && <Icon name={noFoundIcon} className={cn(`h-5 w-5 ${iconStyle}`, className)} />}
                                                                <p className={cn("mt-4 text-sm", className)}>{noFoundCommentText}</p>
                                                            </div>
                                                        </>

                                                    )}

                                                </ul> : null
                                        }

                                        {
                                            hasFooter && open ?
                                                <div className={cn("flex flex-wrap items-center bg-accent/30 px-4 py-2.5 text-xs rounded-b-lg -mb-[8px] text-primary/50", className)}>Type
                                                    {icon && <Icon name={icon} className={cn("mx-1 flex p-1 items-center justify-center rounded border font-semibold sm:mx-2", `${iconStyle}`, className)} />}
                                                    <span className={cn("hidden sm:inline", className)}>to access projects,</span>
                                                    {<Icon name="chevron-right-solid" className={cn("mx-1 flex p-1 items-center justify-center rounded border font-semibold sm:mx-2", `${iconStyle}`, className)} />} for users, and
                                                    {icon && <Icon name="question-solid" className={cn("mx-1 flex p-1 items-center justify-center rounded border font-semibold sm:mx-2", `${iconStyle}`, className)} />} for help.</div>
                                                : null
                                        }
                                    </li>
                                </ul>
                            </div> : null
                    }
                    {
                        withPreview && open ?
                            <>
                                {
                                    searchedList && searchedList.length > 0 && open ? (
                                        <div className="border rounded-b-lg flex items-center">
                                            <div className="flex-auto border-r scroll-py-4 overflow-y-auto px-6 py-4 sm:h-96">
                                                <ul className={cn("-ml-2 text-sm", className)} id="recent" role="listbox">
                                                    {searchedList && searchedList.map((item: DataItem | string, index: number) => (
                                                        typeof item === 'object' && item !== null && 'name' in item && (
                                                            <li
                                                                key={index}
                                                                className={cn("group flex cursor-default select-none items-center rounded-md p-2 hover:bg-accent/50", className)}
                                                                onMouseEnter={() => handleMouseEnter(item)}

                                                            >
                                                                <img src={item.image} alt="" className={cn(`h-5 w-5 flex-none rounded-full ${imageStyle}`, className)} />
                                                                <span className={cn("ml-3 flex-auto truncate", className)}>{item.name}</span>
                                                                {item.icon && <Icon name={item.icon} className={cn(`h-5 w-5 ${iconStyle}`,className)} />}
                                                            </li>
                                                        )
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className=" flex-none h-96 w-1/2 flex-col divide-y divide-accent/50 overflow-y-auto sm:flex">
                                                {selectedItem && (
                                                    <div className="flex-none p-6 text-center">
                                                        {selectedItem.image ? <img src={selectedItem.image} alt="" className={cn(`mx-auto rounded-full ${selectedItem.imageStyle}`)} /> : null}
                                                        <h2 className="mt-3 font-semibold ">{selectedItem.name}</h2>
                                                        <p className="text-sm leading-6 mb-[3px]">{selectedItem.position}</p>
                                                        <div className="flex flex-auto mx-[-24px] border-t flex-col justify-between p-6">
                                                            <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm">
                                                                <dt className="col-end-1 font-semibold ">Phone</dt>
                                                                <dd className='mr-12'>{selectedItem.phone}</dd>
                                                                <dt className="col-end-1 font-semibold mr-3">URL</dt>
                                                                <dd className="truncate"><a className={cn("text-indigo-600 underline")}>{selectedItem.url}</a></dd>
                                                                <dt className="col-end-1 font-semibold ">Email</dt>
                                                                <dd className="truncate"><a href="#" className={cn("text-indigo-600 underline")}>{selectedItem.email}</a></dd>
                                                            </dl>
                                                            <button type="button" className={cn("mt-10 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ", className)}>{buttonName}</button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className={cn("px-6 py-14 text-center text-sm sm:px-14", className)}>
                                                {errorIcon ? <Icon name={errorIcon} className={`h-5 w-5 ${iconStyle}`} /> : null}
                                                <p className={cn("mt-4 font-semibold", className)}>{noResultText}</p>
                                                <p className={cn("mt-2 ", className)}>{noFoundCommentText}</p>
                                            </div>
                                        </>
                                    )}
                            </>
                            : null
                    }
                </div>
            </>
        )
    }
)




CommandPalettes.displayName = "CommandPalettes"

export { CommandPalettes, commandPalettesVariants }




