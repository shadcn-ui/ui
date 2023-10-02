import React, { useState } from 'react';
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Icon, IconType } from "./icon"
import { colors } from './helper/types';
import { Button } from './button';

const paginationVariants = cva(
    "flex items-center justify-between border-t border-gray-200 px-4 sm:px-6",
)

const paginationAnchorVariants = cva(
    "relative inline-flex items-center",
    {
        variants: {
            leftButton: {
                leftButtonRound: "rounded-l-md",
            },
            rightButton: {
                rightButtonRound: "rounded-r-md"
            }
        },
        defaultVariants: {
            
        }
    }

)
export interface paginationProps
    extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof paginationVariants> {
    nextButtonIcon?: IconType;
    previousButtonIcon?: IconType;
    withFooter?: boolean;
    showButton?: boolean;
    withNumberButton?: boolean;
    previousButtonText?: string;
    nextButtonText?: string;
    textColor?: colors;
    borderColor?: colors;
    totalPages?: any;
    iconStyle?: string;
    activeButtonClass?: string;
    currentPage?:number;
    firstPage?: number;
    lastPage?: number;
    rightButton?:"rightButtonRound";
    leftButton?:"leftButtonRound";
}

function Pagination({ children, className, currentPage, firstPage,rightButton,leftButton, lastPage, totalPages, textColor, borderColor, activeButtonClass, iconStyle, nextButtonIcon, previousButtonText, nextButtonText, previousButtonIcon, withFooter, showButton, withNumberButton, ...props }: paginationProps) {
    const [activePage, setActivePage] = useState<number | null>(null);
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const onPageChange = (page: number) => {
        setCurrentPageNumber(page);
    }

    const fontColor = (textColor?: colors) => {
        return `text-${textColor}-700 ring-${textColor}-300 `
    }
    const borderColors = (borderColor?: colors) => {
        return `border-${borderColor}-300 `
    }
    const range: (start:number, end: number) => number[] = (start, end) => {
        if (start >= end) {
            return [];
        }
        const result: number[] = [];
        for (let i = start; i <= end; i++) {
            result.push(i);
        }
        return result;
    };
    lastPage = Math.min(Math.max(currentPageNumber + 2, 5), totalPages);
    firstPage = Math.max(1, lastPage - 4);

    const goToNextPage = (): void => {
        setActivePage(currentPageNumber);
        onPageChange(Math.min(currentPageNumber + 1, totalPages));
    };

    const goToPreviousPage = (): void => {
        setActivePage(currentPageNumber);
        onPageChange(Math.max(currentPageNumber - 1, 1));
    };
    return (
        <>
            <nav className={cn(paginationVariants({}), className)}>
                {withFooter ?
                    <>
                        <div className={cn("-mt-px flex w-0 flex-1", className)}>
                            <a href="#" className={cn("inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium  ", fontColor(textColor), className)}
                                onClick={goToPreviousPage}
                            >
                                {previousButtonIcon && <Icon name={previousButtonIcon} className={cn("pr-2.5", `${iconStyle}`, className)} />}
                                {previousButtonText}
                            </a>
                        </div>
                        <div className="hidden md:-mt-px md:flex">
                            {
                                range(firstPage, lastPage).map((page: number) => (
                                    <a
                                        href="#"
                                        className={cn(
                                            `inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium`,
                                            {
                                                [`${activeButtonClass}`]: page === currentPageNumber,
                                            },
                                            fontColor(textColor),
                                            className
                                        )}
                                        onClick={() => onPageChange(page)}
                                    >
                                        {page}
                                    </a>
                                ))}
                        </div>
                        <div className={cn("-mt-px flex w-0 flex-1 justify-end", className)}>
                            <a href="#" className={cn("inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium", fontColor(textColor), className)}
                                onClick={goToNextPage}
                            >
                                {nextButtonText}
                                {nextButtonIcon && <Icon name={nextButtonIcon} className={cn("pl-2.5", `${iconStyle}`, className)} />}
                            </a>
                        </div>
                    </>
                    : null
                }
                {
                    withNumberButton ?
                        <>
                            <div className={cn("flex flex-1 justify-between sm:hidden", className)}>
                                <a href="#" className={cn("border px-4 py-2 font-medium", paginationAnchorVariants({}), fontColor(textColor), borderColors(borderColor), className)}
                                    onClick={goToPreviousPage}
                                >{previousButtonText}
                                </a>

                                <a href="#" className={cn("ml-3 border px-4 py-2  font-medium", paginationAnchorVariants({}), fontColor(textColor), borderColors(borderColor), className)}
                                    onClick={goToNextPage}
                                >{nextButtonText}</a>
                            </div>

                            <div className={cn("hidden sm:flex sm:flex-1 sm:items-center sm:justify-between", className)}>
                                <div>
                                    <p className={cn("text-sm", fontColor(textColor), className)}>
                                        Showing <span className={cn("font-medium p-0.5", className)}>{currentPageNumber}</span> to
                                        <span className={cn("font-medium p-0.5", className)}>{lastPage}</span> of
                                        <span className={cn("font-medium p-0.5", className)}>{totalPages}</span> Entries
                                    </p>
                                </div>
                            </div>
                            <div>
                                <nav className={cn("isolate inline-flex -space-x-px shadow-sm mt-2.5", className)}>
                                    <a href="#" className={cn("pl-3 pr-4 py-2 ring-1 ring-inset focus:z-20 focus:outline-offset-0", paginationAnchorVariants({leftButton}), fontColor(textColor), className)}
                                        onClick={goToPreviousPage}
                                    >
                                        {previousButtonIcon && <Icon name={previousButtonIcon} className={`${iconStyle}`} />}
                                    </a>
                                    {
                                        range(firstPage, lastPage).map((page: number) => (
                                            <a
                                                href="#"
                                                className={cn(
                                                    `inline-flex items-center border px-4 py-2 text-sm font-medium`,
                                                    {
                                                        [`${activeButtonClass}`]: page === currentPageNumber,
                                                    },
                                                    fontColor(textColor),
                                                    className
                                                )}
                                                onClick={() => onPageChange(page)}
                                            >
                                                {page}
                                            </a>
                                        ))
                                    }
                                    <a href="#" className={cn("px-2 py-2 ring-1 ring-inset focus:z-20 focus:outline-offset-0", paginationAnchorVariants({rightButton}), fontColor(textColor), className)}
                                        onClick={goToNextPage}
                                    >
                                        {nextButtonIcon && <Icon name={nextButtonIcon} className={cn("pl-2.5", `${iconStyle}`, className)} />}
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
                                <p className={cn("text-sm", fontColor(textColor), className)}>
                                    Showing <span className={cn("font-medium p-0.5", className)}>{currentPageNumber}</span> to
                                    <span className={cn("font-medium p-0.5", className)}>{lastPage}</span> of
                                    <span className={cn("font-medium p-0.5", className)}>{totalPages}</span> Entries
                                </p>
                            </div>
                            <div className={cn("flex flex-1 mt-4 justify-between sm:justify-end", className)}>
                                 <Button variant="outline" size="xl" className={cn('px-7 cursor-pointer',className)} onClick={goToPreviousPage}>{previousButtonText}</Button>
                                <Button variant="outline" size="xl" className={cn('ml-3 px-8 cursor-pointer',className)} onClick={goToNextPage} >{nextButtonText}</Button>
                            </div>

                        </> : null
                }
            </nav>
        </>
    )
}

export { Pagination, paginationVariants }
