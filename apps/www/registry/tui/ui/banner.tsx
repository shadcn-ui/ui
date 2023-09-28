import { cn } from "@/lib/utils"
import { Button } from "./button"

export const DismissButton = ({ dark, onClick, className }: { dark?: boolean, onClick?: any, className?: string }) => {
    return (
        <Button
            onClick={onClick}
            icon="xmark-solid"
            iconStyle={cn(`h-5 w-5 ${dark ? "text-gray-900" : !className && "text-white"}`, className)}
            className={"-m-3 p-3 bg-transparent hover:bg-transparent focus-visible:outline-offset-[-4px] shadow-none"} />
    )
}

interface BannerProps {
    align?: "center" | "left" | "right" | "bottom" | "floating-bottom" | "floating-bottom-center" | "bottom" | "top",
    body?: React.JSX.Element,
    actionItems?: React.JSX.Element,
    variant?: "primary" | "secondary" | "notice" | "notice-secondary",
    dark?: boolean,
    onBrands?: boolean,
    showDismissButton?: boolean,
    dismissButtonStyle?: string,
    backgroundColor?: string,
    onClickDismissButton?: any,
}

export const Banner = ({ align, body, actionItems, showDismissButton, onClickDismissButton, dismissButtonStyle, dark, backgroundColor, onBrands, variant = "primary" }: BannerProps) => {
    const secondaryClass =
        variant === "secondary"
            ? (align === "floating-bottom" || align === "bottom" ? "pointer-events-none absolute inset-x-0 bottom-0 sm:px-6 sm:pb-5 lg:px-8"
                : align === "floating-bottom-center" ? "pointer-events-none absolute inset-x-0 bottom-0 sm:flex sm:justify-center sm:px-6 sm:pb-5 lg:px-8"
                    : align === "left" ? "w-full flex items-center justify-between gap-x-6 px-6 py-2.5 sm:pr-3.5 lg:pl-8"
                        : align === "center" ? "w-full mx-auto flex items-center justify-center  gap-x-6 px-6 py-2.5 sm:pr-3.5 lg:pl-8"
                            : align === "right" ? "w-full mx-auto flex items-center justify-end gap-x-6 px-6 py-2.5 sm:pr-3.5 lg:pl-8"
                                : "") : ""
    return (
        <>
            {variant === "notice" ? <div className="pointer-events-none absolute inset-x-0 bottom-0 px-6 pb-6 z-50">
                <div className={cn(
                    "pointer-events-auto max-w-xl rounded-xl p-6 shadow-lg ring-1 ring-gray-900/10",
                    (align === "center" ? "mx-auto" : align === "left" ? "mr-auto" : "ml-auto"),
                    backgroundColor ?? "bg-white",
                )}>
                    {body}
                    {actionItems && actionItems}
                </div>
            </div >
                : variant === "notice-secondary" ?
                    <div className={cn("absolute inset-x-0 bottom-0 flex flex-col justify-between gap-x-8 gap-y-4 p-6 ring-1 ring-gray-900/10 md:flex-row md:items-center lg:px-8 z-50",
                        backgroundColor ?? "bg-white",
                        (align === "center" ? "mx-auto" : align === "left" ? "mr-auto" : "ml-auto"),
                    )}>
                        {body}
                        {actionItems && actionItems}
                    </div>
                    : variant === "secondary" ? <div className={secondaryClass + " z-50"}>
                        <div className={cn(
                            align === "left" ? "flex w-full justify-between" : "pointer-events-auto flex items-center justify-between5",
                            backgroundColor ?? "bg-gray-800",
                            "gap-x-6 px-6 py-2.5 sm:rounded-xl sm:py-3 sm:pl-4 sm:pr-3.5"
                        )}>
                            {body && body}
                            {showDismissButton && <DismissButton onClick={onClickDismissButton} className={dismissButtonStyle} />}
                            {actionItems && actionItems}
                        </div>
                    </div>
                        : variant === "primary" ? <div
                            className={cn(
                                align === "bottom" ? "absolute bottom-0" : "",
                                align === "top" ? "absolute top-0" : "",
                                align === "left" ? "absolute left-0" : "",
                                align === "right" ? "absolute right-0" : "",
                                dark && "bg-gray-900",
                                backgroundColor && `${backgroundColor}`,
                                onBrands && "bg-primary",
                                `flex w-full items-center gap-x-6 px-6 py-2.5 sm:px-3.5 sm:before:flex-1 z-50`
                            )}>
                            {body && body}
                            <div className="w-full flex flex-1 justify-end">
                                {showDismissButton && <DismissButton onClick={onClickDismissButton} className={dismissButtonStyle} />}
                            </div>
                        </div> : <></>}
        </>
    )
}
