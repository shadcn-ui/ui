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
            previousButton: {
                previousButtonRound: "rounded-l-md",
            },
            nextButton: {
                nextButtonRound: "rounded-r-md"
            }
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
    totalPages?: number;
    iconStyle?: string;
    activeButtonClass?: string;
    nextButton?: "nextButtonRound";
    previousButton?: "previousButtonRound";
    recordsPerPage?: number;
    onPageChange: (page: number) => void;
    currentPageNumber: number;
}

function Pagination({ children, className, onPageChange, currentPageNumber, recordsPerPage, nextButton, previousButton, totalPages, textColor, borderColor, activeButtonClass, iconStyle, nextButtonIcon, previousButtonText, nextButtonText, previousButtonIcon, withFooter, showButton, withNumberButton, ...props }: paginationProps) {
    const [activePage, setActivePage] = useState<number | null>(null);

    const fontColor = (textColor?: colors) => {
        return `text-${textColor}-700 ring-${textColor}-300 `
    }
    const borderColors = (borderColor?: colors) => {
        return `border-${borderColor}-300 `
    }

    if (recordsPerPage === undefined) {
        recordsPerPage = 10;
    }

    const totalRecord = totalPages !== undefined ? Math.ceil(totalPages / recordsPerPage) : 0;
    const range: (start: number, totalRecord: number) => number[] = (start) => {
        if (start >= totalRecord) {
            return [];
        }
        const result: number[] = [];
        for (let i = start; i <= totalRecord; i++) {
            result.push(i);
        }
        return result;
    };
    const lastPage = Math.min(Math.max(currentPageNumber + 2, recordsPerPage), totalPages ?? 0);
    const firstPage = Math.max(1, lastPage - 9);

    const firstNumber = (recordsPerPage * (currentPageNumber - 1)) + 1;
    const lastNumber = Math.min(recordsPerPage * currentPageNumber, totalPages ?? 0);

    const goToNextPage = (): void => {
        setActivePage(currentPageNumber);
        onPageChange(currentPageNumber + 1);
    };

    const goToPreviousPage = (): void => {
        setActivePage(currentPageNumber);
        onPageChange(currentPageNumber - 1);
    };
    
    return (
        <>
            <nav className={cn(paginationVariants({}), className)}>
                {withFooter ?
                    <>
                        <div className={cn("-mt-px flex flex-1", className)} >
                            <button  className={cn("inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium disabled:pointer-events-none disabled:opacity-50  ", fontColor(textColor), className)}
                                onClick={(e) => {
                                    e.preventDefault();
                                    currentPageNumber !== 1 ? goToPreviousPage() : null;
                                }}
                                disabled={currentPageNumber === 1} 
                            >
                                {previousButtonIcon && <Icon name={previousButtonIcon} className={cn("pr-2.5", `${iconStyle}`, className)} />}
                                {previousButtonText}
                            </button>
                        </div>
                        <div className="hidden md:-mt-px md:flex">
                            {
                                range(firstPage, lastPage).map((page: number) => (
                                    <button
                                       
                                        className={cn(
                                            `inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium`,
                                            {
                                                [`${activeButtonClass}`]: page === currentPageNumber,
                                                [`${fontColor(textColor)}`]: page !== currentPageNumber,
                                            },
                                            className
                                        )}
                                        onClick={() => onPageChange(page)}
                                    >
                                        {page}
                                    </button>
                                ))}
                        </div>
                        <div className={cn("-mt-px flex flex-1 justify-end", className)}>
                            <button className={cn("inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium disabled:pointer-events-none disabled:opacity-50", fontColor(textColor), className)}
                                onClick={(e) => {
                                    e.preventDefault();
                                    currentPageNumber < totalRecord ? goToNextPage() : null;
                                }}
                                disabled={currentPageNumber >= totalRecord}
                            >
                                {nextButtonText}
                                {nextButtonIcon && <Icon name={nextButtonIcon} className={cn("pl-2.5", `${iconStyle}`, className)} />}
                            </button>
                        </div>
                    </>
                    : null
                }
                {
                    withNumberButton ?
                        <>
                            <div className={cn("flex flex-1 justify-between sm:hidden", className)}>
                                <button className={cn("border px-4 py-2 font-medium disabled:pointer-events-none disabled:opacity-50", paginationAnchorVariants({}), fontColor(textColor), borderColors(borderColor), className)}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        currentPageNumber !== 1 ? goToPreviousPage() : null;
                                    }}
                                    disabled={currentPageNumber === 1} 
                                >{previousButtonText}
                                </button>

                                <button className={cn("ml-3 border px-4 py-2  font-medium disabled:pointer-events-none disabled:opacity-50", paginationAnchorVariants({}), fontColor(textColor), borderColors(borderColor), className)}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        currentPageNumber < totalRecord ? goToNextPage() : null;
                                    }}
                                    disabled={currentPageNumber >= totalRecord}
                                >{nextButtonText}</button>
                            </div>

                            <div className={cn("hidden sm:flex sm:flex-1 sm:items-center sm:justify-between", className)}>
                                <div>
                                    <p className={cn("text-sm p-0.5", fontColor(textColor), className)}>
                                        Showing <span className={cn("font-medium p-0.5", className)}>{firstNumber}</span> to <span className={cn("font-medium p-0.5", className)}>{lastNumber}</span> of{' '}
                                        <span className={cn("font-medium p-0.5", className)}>{totalPages}</span> results
                                    </p>
                                </div>
                            </div>
                            <div>
                                <nav className={cn("isolate inline-flex -space-x-px shadow-sm mt-2.5", className)}>
                                    <button className={cn("pl-2 pr-[19px] py-2 ring-1 ring-inset focus:z-20 focus:outline-offset-0 disabled:pointer-events-none disabled:opacity-50", paginationAnchorVariants({ previousButton }), fontColor(textColor), className)}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            currentPageNumber !== 1 ? goToPreviousPage() : null;
                                        }}
                                        disabled={currentPageNumber === 1} 
                                    >
                                        {previousButtonIcon && <Icon name={previousButtonIcon} className={`${iconStyle}`} />}
                                    </button>
                                    {
                                        range(firstPage, lastPage).map((page: number) => (
                                            <button
                                              
                                                className={cn(
                                                    `inline-flex items-center border px-4 py-2 text-sm font-medium`,
                                                    {
                                                        [`${activeButtonClass}`]: page === currentPageNumber,
                                                        [`${fontColor(textColor)}`]: page !== currentPageNumber,
                                                    },
                                                    className
                                                )}
                                                onClick={() => onPageChange(page)}
                                            >
                                                {page}
                                            </button>
                                        ))
                                    }
                                    <button className={cn("pr-2 pl-2.5 py-2 ring-1 ring-inset focus:z-20 focus:outline-offset-0 disabled:pointer-events-none disabled:opacity-50", paginationAnchorVariants({ nextButton }), fontColor(textColor), className)}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            currentPageNumber < totalRecord ? goToNextPage() : null;
                                        }}
                                        disabled={currentPageNumber >= totalRecord}
                                    >
                                        {nextButtonIcon && <Icon name={nextButtonIcon} className={cn("pl-2.5", `${iconStyle}`, className)} />}
                                    </button>
                                </nav>
                            </div>
                        </>
                        : null
                }
                {
                    showButton ?
                        <>
                            <div className={cn("hidden sm:block", className)}>
                                <p className={cn("text-sm p-0.5", fontColor(textColor), className)}>
                                    Showing <span className={cn("font-medium p-0.5", className)}>{firstNumber}</span> to <span className={cn("font-medium p-0.5", className)}>{lastNumber}</span> of{' '}
                                    <span className={cn("font-medium p-0.5", className)}>{totalPages}</span> results
                                </p>
                            </div>
                            <div className={cn("flex flex-1 mt-4 justify-between sm:justify-end", className)}>
                                <Button variant="outline" size="xl" className={cn('px-7 cursor-pointer disabled:pointer-events-none disabled:opacity-50', className)}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        currentPageNumber !== 1 ? goToPreviousPage() : null;
                                    }} 
                                    disabled={currentPageNumber === 1} 
                                    >{previousButtonText}</Button>

                                <Button variant="outline" size="xl" className={cn('ml-3 px-10 cursor-pointer disabled:pointer-events-none disabled:opacity-50', className)}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        currentPageNumber < totalRecord ? goToNextPage() : null;
                                    }} 
                                    disabled={currentPageNumber >= totalRecord}
                                    >{nextButtonText}</Button>
                            </div>

                        </> : null
                }
            </nav>
        </>
    )
}

export { Pagination, paginationVariants }
