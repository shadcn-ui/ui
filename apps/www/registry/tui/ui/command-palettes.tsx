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
                secondary: " hover:text-accent",
            },
        }
    }
)

interface ItemList {
    title?: string;
    description?: string;
    icon?: IconType;
    backgroundStyle?: string;
}

interface DataItem {
    name?: string;
    image?: string;
    position?: string;
    phone?: number;
    url?: string;
    email?: string;
    imageStyle?: string;
    icon?: IconType;
}
interface ListItem {
    icon?: IconType;
    keyboardName?: string;
    command?: string;
}

export interface CommandPalettesProps
    extends React.HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof commandPalettesVariants> {
    withIcon?: boolean;
    noFoundCommentText?: string;
    description?: "withoutDescription" | "withDescription";
    haskeyboard?: boolean;
    variant?: "outline" | "secondary";
    listTitleName?: string;
    searchName?: string;
    titleText?: string;
    projectNameListName?: string;
    footer?: boolean;
    withPreview?: boolean;
    iconStyle?: string;
    noResultText?: string;
    imageStyle?: string;
    buttonName?: string;
    hoverColor?: colors;
    backgroundColor?: colors;
    textColor?: colors;
    icon?: IconType;
    errorIcon?: IconType;
    folderIcon?: IconType;
    noFoundIcon?: IconType;
    inputValue?:string;
    handleChange?:(e: ChangeEvent<HTMLInputElement>) => void;
    filteredList?:string[] | DataItem[] | ListItem[] | ItemList[] ;
}

const CommandPalettes = React.forwardRef<HTMLButtonElement, CommandPalettesProps>(
    ({ className, withIcon, noFoundIcon, imageStyle,filteredList,handleChange,inputValue, buttonName, hoverColor, iconStyle, noResultText, backgroundColor, textColor, withPreview, footer, projectNameListName, searchName, listTitleName, titleText, folderIcon, variant, description, haskeyboard, errorIcon, icon, noFoundCommentText, ...props }, ref) => {

        const bgColor = (backgroundColor?: colors) => {
            return `bg-${backgroundColor}-900 `
        }

        const fontColor = (textColor?: colors) => {
            return `text-${textColor}-500`
        }

        const hoveringColor = (hoverColor?: colors) => {
            return `hover:bg-${hoverColor}-600`
        }
        const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);

        const handleMouseEnter = (item: DataItem) => {
            setSelectedItem(item);
        }


        return (
            <>
                <div className={cn((commandPalettesVariants({}), className))}>
                    {
                        withIcon ? <Input alignIcon="left"  onChange={handleChange} value={inputValue}  className={cn("rounded-none rounded-t-lg", bgColor(backgroundColor), className)} iconStyle="h-5 w-5" labelAndBorderStyle="iconWithLabel" icon="magnifying-glass-duotone" color="gray" placeholder="Search..." />
                            : <Input className={cn("bg-accent/50 rounded-none rounded-t-lg", className)} placeholder="Search..." onChange={handleChange} value={inputValue} />
                    }
                    {description === "withoutDescription" ? (
                        <div className={cn("border rounded-b-lg", className)}>
                            { filteredList && filteredList.length > 0 ? (
                                <ul className={cn("scroll-py-2 overflow-y-auto py-2 text-accent/50 ", className)}>
                                    {filteredList && filteredList.map((name:any, index:number) => (
                                        <li key={index} className={cn("px-4 text-sm py-2 flex cursor-pointer select-none items-center px-3 py-2 hover:text-accent", hoveringColor(hoverColor), className)}>
                                            {name}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <>
                                    {icon ? (
                                        <div className={cn("px-4 py-14 text-center sm:px-14", className)}>
                                            {icon && <Icon name={icon} />}
                                            <p className={cn("p-4 text-sm", fontColor(textColor), className)}>{noFoundCommentText}</p>
                                        </div>
                                    ) : (
                                        <p className={cn("p-4 text-sm", fontColor(textColor), className)}>{noFoundCommentText}</p>
                                    )}
                                </>
                            )}
                        </div>
                    ) : (

                        <>
                            {description === "withDescription" ? (
                                filteredList && filteredList.length > 0 ? (
                                    <div className={cn("border rounded-b-lg")}>
                                        <ul className={cn("scroll-py-2 overflow-y-auto py-2 text-accent/50 ", className)}>
                                            {filteredList && filteredList.map((item: ItemList, index: number) => (
                                                <li key={index} className={cn("rounded-xl flex cursor-pointer select-none items-center px-3 py-2 p-3 mx-2 hover:bg-accent/50", fontColor(textColor), bgColor(backgroundColor), className)}>
                                                    <div className={cn(`flex flex-none items-center justify-center rounded-lg ${item.backgroundStyle}`)}>
                                                        {item.icon && <Icon name={item.icon} className={cn(`${iconStyle}`, className)} />}
                                                    </div>
                                                    <div className={cn("ml-4 flex-auto", className)}>
                                                        <p className={cn("text-sm font-medium", fontColor(textColor), className)}>{item.title}</p>
                                                        <p className={cn("text-sm", fontColor(textColor), className)}>{item.description}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <div className={cn("px-6 py-14 text-center text-sm sm:px-14", className)}>
                                        {errorIcon && <Icon name={errorIcon} />}
                                        <p className={cn("mt-4 font-semibold", className)}>{noResultText}</p>
                                        <p className={cn("mt-2", fontColor(textColor), className)}>{noFoundCommentText}</p>
                                    </div>
                                )
                            ) : null

                            }
                        </>
                    )}

                    {
                        haskeyboard ?
                            <div className={cn("border rounded-b-lg", bgColor(backgroundColor), className)}>
                                <ul className={cn("scroll-py-2 overflow-y-auto py-2 text-accent/50 ", fontColor(textColor), className)}>
                                    <li>
                                        {filteredList && filteredList.length > 0 ?
                                            <>
                                                <li>
                                                    {searchName ? <h2 className={cn("mb-2 mt-4 px-3 text-xs font-semibold", fontColor(textColor), className)}>{searchName}</h2> : null}
                                                    {listTitleName ? <h2 className={cn("bg-accent/50 mt-[-8px] px-4 py-2.5 text-xs font-semibold", className)}>{listTitleName}</h2> : null}
                                                    <ul className={cn("text-sm", fontColor(textColor), bgColor(backgroundColor), className)}>
                                                        {
                                                            !footer ?
                                                                <li className={cn("flex cursor-pointer select-none items-center px-3 py-2", hoveringColor(hoverColor), commandPalettesVariants({ variant }), className)}>
                                                                    {folderIcon && <Icon name={folderIcon} />}
                                                                    <span className={cn("ml-3 flex-auto truncate ", className)}>{titleText}</span>
                                                                </li> : null
                                                        }
                                                    </ul>
                                                </li>
                                                {projectNameListName ? <h2 className={cn("bg-accent/50 px-4 mt-[-7px] py-2.5 text-xs font-semibold", className)}>{projectNameListName}</h2> : null}

                                            </>
                                            : null}
                                        <ul className={cn("text-sm", fontColor(textColor), bgColor(backgroundColor), className)}>
                                            {filteredList && filteredList.length > 0 ? (
                                                filteredList.map((item: ListItem, index: number) => (
                                                    <li key={index} className={cn("flex cursor-pointer select-none items-center px-3 py-2", hoveringColor(hoverColor), commandPalettesVariants({ variant }), className)}>
                                                        {item.icon && <Icon name={item.icon} />}
                                                        <span className={cn("ml-3 flex-auto truncate", className)}>{item.command}</span>
                                                        <span className={cn("ml-3 flex-none text-xs font-semibold ", fontColor(textColor), className)}>
                                                            <kbd className={cn("font-sans")}>{item.keyboardName}</kbd>
                                                        </span>
                                                    </li>
                                                ))
                                            ) : (
                                                <>
                                                    <div className={cn("px-6 py-14 text-center sm:px-14", className)}>
                                                        {noFoundIcon && <Icon name={noFoundIcon} className={cn(`${iconStyle}`, className)} />}
                                                        <p className={cn("mt-4 text-sm", className)}>{noFoundCommentText}</p>
                                                    </div>
                                                </>

                                            )}

                                        </ul>
                                        {
                                            footer ?
                                                <div className={cn("flex flex-wrap items-center bg-accent/30 px-4 py-2.5 text-xs rounded-b-lg -mb-[8px]", fontColor(textColor), className)}>Type
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
                        withPreview ?
                            <>
                                {
                                    filteredList && filteredList.length > 0 ? (
                                        <div className="border rounded-b-lg flex items-center">
                                            <div className="flex-auto border-r scroll-py-4 overflow-y-auto px-6 py-4 sm:h-96">
                                                <ul className={cn("-ml-2 text-sm", className)} id="recent" role="listbox">
                                                    {filteredList && filteredList.map((item: DataItem, index: number) => (
                                                        <li
                                                            key={index}
                                                            className={cn("group flex cursor-default select-none items-center rounded-md p-2 hover:bg-accent/50", className)}
                                                            onMouseEnter={() => handleMouseEnter(item)}

                                                        >
                                                            <img src={item.image} alt="" className={cn(`flex-none rounded-full ${imageStyle}`, className)} />
                                                            <span className={cn("ml-3 flex-auto truncate", className)}>{item.name}</span>
                                                            {item.icon && <Icon name={item.icon} />}
                                                        </li>
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
                                                                <dd>{selectedItem.phone}</dd>
                                                                <dt className="col-end-1 font-semibold">URL</dt>
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
                                                {errorIcon ? <Icon name={errorIcon} /> : null}
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




