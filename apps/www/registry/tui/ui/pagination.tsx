import React, { useState } from 'react';
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Icon, IconType } from "./icon"
import { colors } from './helper/types';

const paginationVariants = cva(
    "flex items-center justify-between border-t border-gray-200 px-4 sm:px-6",
)

const paginationAnchorVariants = cva(
    "relative inline-flex items-center border px-4 py-2 text-sm font-medium",
    {
        variants: {
            size: {
                default:"rounded-md"
            }
        },
        defaultVariants: {
                size:"default"
        }
    }

)

const paginationButtonAnchorVariants = cva(
    "relative inline-flex items-center px-3 py-2 font-semibold ring-1 ring-inset focus-visible:outline-offset-0",
    {
        variants: {
            size: {
                default:"text-sm rounded-md"
            }
        },
        defaultVariants: {
                size:"default"
        }
    }
)

interface LinkData{
    text?:string;
    href?:string;
}

export interface paginationProps
    extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof paginationVariants> {
    iconRight?: IconType;
    iconLeft?: IconType;
    withFooter?: boolean;
    numberResult?: boolean;
    showButton?: boolean;
    withNumberButton?: boolean;
    pageNumbers?: any;
    dataList?:LinkData[];
    result?:string[];
    previousButton?:string;
    nextButton?:string;
    textColor?:colors;
    borderColor?:colors;
    iconStyle?:string;
    activeButtonClass?:string;
}

function Pagination({ children, className,textColor,borderColor,activeButtonClass,iconStyle, result, iconRight,previousButton,nextButton, dataList, pageNumbers, numberResult, iconLeft, withFooter, showButton, withNumberButton, ...props }: paginationProps) {
    const [activePage, setActivePage] = useState(null);
    const [activeLink, setActiveLink] = useState<number | null>(null);
    const handlePageClick = (pageNumber: any) => {
        setActivePage(pageNumber);
    };
    const handleLinkClick = (index: number) => {
        setActiveLink(index);
    };
    const fontColor = (textColor?: colors) => {
        return `text-${textColor}-700 ring-${textColor}-300 `
    }
    const borderColors = (borderColor?: colors) => {
        return `border-${borderColor}-300 `
    }
    return (
        <>
            <nav className={cn(paginationVariants({}), className)}>
                {withFooter ?
                    <><div className={cn("-mt-px flex w-0 flex-1", className)}>
                        <a href="#" className={cn("inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium  ",fontColor(textColor), className)}>
                            {iconLeft && <Icon name={iconLeft} className={cn("pr-2.5",`${iconStyle}`, className)} />}
                            {previousButton}
                        </a>
                    </div>
                        <div className="hidden md:-mt-px md:flex">
                            {pageNumbers.map((pageNumber: any, index: number) => (
                                <a
                                    key={index}
                                    href="#"
                                    className={cn(
                                        `inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium`,
                                        {
                                            [`${activeButtonClass}`]: pageNumber === activePage,
                                        },
                                        fontColor(textColor),
                                        className
                                    )}
                                    onClick={() => handlePageClick(pageNumber)}
                                >
                                    {pageNumber}
                                </a>
                            ))}
                        </div>
                        <div className={cn("-mt-px flex w-0 flex-1 justify-end",className)}>
                            <a href="#" className={cn("inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium",fontColor(textColor),className)}>
                                {nextButton}
                                {iconRight && <Icon name={iconRight} className={cn("pl-2.5",`${iconStyle}`, className)} />}
                            </a>
                        </div></>
                    : null}
                {
                    withNumberButton ?
                        <>
                            <div className={cn("flex flex-1 justify-between sm:hidden", className)}>
                                <a href="#" className={cn(paginationAnchorVariants({}),fontColor(textColor),borderColors(borderColor), className)}>{previousButton}</a>
                                <a href="#" className={cn("ml-3",paginationAnchorVariants({}),fontColor(textColor),borderColors(borderColor), className)}>{nextButton}</a>
                            </div>
                            <div className={cn("hidden sm:flex sm:flex-1 sm:items-center sm:justify-between", className)}>
                                <div>
                                    <p className={cn("text-sm",fontColor(textColor),className)}>
                                        {result?.map((result: string, index: number) => (
                                            <span key={index} className={cn("font-medium p-1", className)}>
                                                {result}
                                            </span>
                                        ))}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <nav className={cn("isolate inline-flex -space-x-px rounded-md shadow-sm",className)}>
                                    <a href="#" className={cn("relative inline-flex items-center rounded-l-md px-2 py-2 ring-1 ring-inset focus:z-20 focus:outline-offset-0",fontColor(textColor),className)}>
                                        {iconLeft && <Icon name={iconLeft} className={`${iconStyle}`} />}
                                    </a>
                                    {
                                        dataList && dataList?.map((link:any, index: number) => (
                                            <a
                                                key={index}
                                                href={link.href}
                                                className={cn("relative inline-flex items-center px-4 py-2 text-sm  font-semibold ring-1 ring-inset",
                                                    {
                                                        [`${activeButtonClass}`]: link === activeLink,
                                                    },
                                                    fontColor(textColor),
                                                    className)}
                                                onClick={() => handleLinkClick(link)}
                                            >
                                                {link.text}
                                            </a>
                                        ))
                                    }
                                    <a href="#" className={cn("relative inline-flex items-center rounded-r-md px-2 py-2 ring-1 ring-inset focus:z-20 focus:outline-offset-0",fontColor(textColor), className)}>
                                        {iconRight && <Icon name={iconRight} className={cn("pl-2.5",`${iconStyle}`, className)} />}
                                    </a>
                                </nav>
                            </div>
                        </>
                        : null
                }
                {
                    showButton ?
                        <>
                            <div className={cn("hidden sm:block", className)}>
                                <p className={cn("text-sm",fontColor(textColor), className)}>
                                    {result?.map((result:string, index: number) => (
                                        <span key={index} className={cn("font-medium p-1", className)}>
                                            {result}
                                        </span>
                                    ))}
                                </p>
                            </div>
                            <div className={cn("flex flex-1 justify-between sm:justify-end", className)}>
                                <a href="#" className={cn(paginationButtonAnchorVariants({}),fontColor(textColor), className)}>{previousButton}</a>
                                <a href="#" className={cn("ml-3",paginationButtonAnchorVariants({}),fontColor(textColor), className)}>{nextButton}</a>
                            </div>

                        </> : null
                }
            </nav>
        </>
    )
}

export { Pagination, paginationVariants }
