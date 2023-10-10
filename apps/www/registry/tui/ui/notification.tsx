import React, { useState } from 'react';
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Icon, IconType } from "./icon"
import { colors } from './helper/types';

const NotificationVariants = cva(
    " pointer-events-auto w-full rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5",
)

const notificationButtonVariant = cva(
    "inline-flex rounded-md  focus:outline-none"
)

export interface NotificationProps
    extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof NotificationVariants> {
    titleText?: string;
    descriptionText?: string;
    closeIcon?: IconType;
    icon?: IconType;
    buttonNameText?: string;
    dismissButtonNameText?: string;
    imageSrc?: string;
    imageStyle?: string;
    iconStyle?: string;
    replyButtonText?: string;
    allowButtonText?: string;
    hasNoButton?: boolean;
    hasReplyButton?: boolean;
    acceptButtonText?: string;
    declineButtonText?: string;
    parallelCrossButton?: boolean;
    hasDualButton?: boolean;
    backgroundColor?: colors;
    textColor?: colors;
    onButtonClick?: () => void;
    onAllowButtonClick?: () => void;
    oncloseButtonClick?: () => void;
    onFirstButtonClick?:() => void;
    onSecondButtonClick?:() => void;
    onDeclineButtonClick?:() => void;
    onAcceptButtonClick?:() => void;
    alignment?: "topRightCorner" | "topLeftCorner" | "bottomLeftCorner" | "bottomRightCorner";
}

const Notifications = React.forwardRef<HTMLButtonElement, NotificationProps>(
    ({ className, titleText, descriptionText,onDeclineButtonClick,onAcceptButtonClick,onFirstButtonClick,onSecondButtonClick,alignment, backgroundColor, parallelCrossButton, hasDualButton, acceptButtonText, declineButtonText, closeIcon, hasReplyButton, hasNoButton, onAllowButtonClick, allowButtonText, replyButtonText, icon, onButtonClick, imageStyle, iconStyle, imageSrc, textColor, buttonNameText, dismissButtonNameText, oncloseButtonClick, ...props }, ref) => {

        const fontColor = (textColor?: colors) => {
            return `text-${textColor}-600 `
        }

        const bgColor = (backgroundColor?: colors) => {
            return `bg-${backgroundColor}-600 `
        }
        return (
                <div className={cn("pointer-events-none inset-0 flex px-4 py-6 sm:items-start sm:p-6", className)}>
                    <div className={cn(`flex w-3/4 flex-col space-y-4 ${alignment === "topRightCorner"? "items-end":alignment === "topLeftCorner"?"items-start":alignment === "bottomRightCorner"?"flex justify-end items-end h-full w-full":alignment === "bottomLeftCorner"?"grid grid-cols-1 grid-rows-1 justify-items-start items-end mb-4":null} `, className)}>
                        <div className={cn("max-w-sm overflow-hidden", NotificationVariants({}), className)}>
                            <div className={cn("p-4", className)}>
                                <div className={cn("flex items-start", className)}>
                                    <div className={cn("flex-shrink-0", className)}>
                                        {icon && <Icon name={icon} className={cn(`${iconStyle}`, className)} />}
                                        {imageSrc && <img src={imageSrc} className={cn(`${imageStyle}`, className)} />}
                                    </div>
                                    {
                                        hasNoButton ?
                                            <>
                                                <div className="ml-3 flex-1 pt-0.5">
                                                    <div className="flex flex-col">
                                                        {titleText && <p className="text-sm font-medium">{titleText}</p>}
                                                        {descriptionText && (
                                                            <p className={cn("mt-1 text-sm", className)}>{descriptionText}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                {
                                                    closeIcon && (
                                                        <div className="ml-4 flex flex-shrink-0">
                                                            <button type="button" className={cn("inline-flex", notificationButtonVariant({}), className)} onClick={oncloseButtonClick ? oncloseButtonClick : () => {}}>
                                                                {closeIcon && <Icon name={closeIcon} />}
                                                            </button>
                                                        </div>
                                                    )
                                                }
                                            </> : hasDualButton ?
                                                <>
                                                    <div className="flex-1 justify-between items-center pt-0.5">

                                                        <div className=" ml-3 mb-1.5 flex flex-col">
                                                            {titleText && <p className="text-sm font-medium">{titleText}</p>}
                                                            {descriptionText && (
                                                                <p className={cn("mt-1 text-sm", className)}>{descriptionText}</p>
                                                            )}
                                                        </div>
                                                        {buttonNameText && (<button className={cn("ml-3 flex-shrink-0", fontColor(textColor), bgColor(backgroundColor), notificationButtonVariant({}), className)} onClick={onFirstButtonClick ? onFirstButtonClick : () => {}}>{buttonNameText}</button>)}
                                                        {dismissButtonNameText && (<button className={cn("ml-3 flex-shrink-0", notificationButtonVariant({}), className)} onClick={onSecondButtonClick ? onSecondButtonClick : () => {}}>{dismissButtonNameText}</button>)}

                                                    </div>
                                                    {
                                                        closeIcon && (
                                                            <div className="ml-4 flex flex-shrink-0">
                                                                <button type="button" className={cn("inline-flex", notificationButtonVariant({}), className)} onClick={oncloseButtonClick ? oncloseButtonClick : () => {}}>
                                                                    {closeIcon && <Icon name={closeIcon} />}
                                                                </button>
                                                            </div>
                                                        )
                                                    }
                                                </> : null
                                    }
                                    {
                                        hasReplyButton ?
                                            <div className="flex border-l mt-[-9px] pb-[11px] mb-[-19px] border-accent">
                                                <button
                                                    type="button"
                                                    className={cn("flex w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium focus:outline-none focus:ring-2", fontColor(textColor), className)}
                                                    onClick={onButtonClick ? onButtonClick : () => {}}
                                                >
                                                    {replyButtonText}
                                                </button>
                                            </div> : null}

                                    {
                                        replyButtonText && allowButtonText ?
                                            <div className="flex mt-[-11px] mb-[-8px] border-l ">
                                                <div className="flex flex-col divide-y divide-gray-200">
                                                    <div className="flex flex-1">
                                                        <button
                                                            type="button"
                                                            className={cn("flex mt-[-15px] w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium focus:outline-none focus:ring-2", fontColor(textColor), className)}
                                                            onClick={onButtonClick ? onButtonClick : () => {}}
                                                        >
                                                            {replyButtonText}
                                                        </button>
                                                    </div>
                                                    <div className="flex h-0 flex-1">
                                                        {allowButtonText && (

                                                            <button
                                                                type="button"
                                                                className="flex mb-[-14px] border  border-t w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium focus:outline-none focus:ring-2"
                                                                onClick={onAllowButtonClick ? onAllowButtonClick : () => {}}
                                                            >
                                                                {allowButtonText}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                            </div> : null
                                    }
                                    {
                                        acceptButtonText ?
                                            <>
                                                <div className="flex-1 justify-between items-center pt-0.5">

                                                    <div className=" ml-3 mb-1.5 flex flex-col">
                                                        {titleText && <p className="text-sm font-medium">{titleText}</p>}
                                                        {descriptionText && (
                                                            <p className={cn("mt-1 text-sm", className)}>{descriptionText}</p>
                                                        )}
                                                    </div>
                                                    <div className="mt-4 flex">
                                                        <button
                                                            type="button"
                                                            className={cn("inline-flex items-center rounded-md px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",bgColor(backgroundColor),className)}
                                                            onClick={onButtonClick ? onButtonClick : () => {}}
                                                        >
                                                            {acceptButtonText}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="ml-3 inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-accent/50"
                                                            onClick={onDeclineButtonClick ? onDeclineButtonClick : () => {}}
                                                        >
                                                            {declineButtonText}
                                                        </button>
                                                    </div>
                                                </div>
                                                {
                                                        closeIcon && (
                                                            <div className="ml-4 flex flex-shrink-0">
                                                                <button type="button" className={cn("inline-flex", notificationButtonVariant({}), className)} onClick={oncloseButtonClick ? oncloseButtonClick : () => {}}>
                                                                    {closeIcon && <Icon name={closeIcon} />}
                                                                </button>
                                                            </div>
                                                        )
                                                    }

                                            </>
                                            : null
                                    }
                                    {
                                        parallelCrossButton ?
                                            <div className="ml-3 w-0 flex-1 flex justify-between items-center pt-0.5">
                                                <div className="flex flex-col">
                                                    {titleText && <p className="text-sm font-medium">{titleText}</p>}
                                                    {descriptionText && (
                                                        <p className={cn("mt-1 text-sm", fontColor(textColor), className)}>{descriptionText}</p>
                                                    )}
                                                </div>
                                                {buttonNameText && (<button className={cn("ml-3 flex-shrink-0", fontColor(textColor), notificationButtonVariant({}), className)} onClick={onButtonClick ? onButtonClick : () => {}}>{buttonNameText}</button>)}
                                                {
                                                    closeIcon && (
                                                        <div className="ml-4 flex flex-shrink-0">
                                                            <button type="button" className={cn("inline-flex", notificationButtonVariant({}), className)} onClick={oncloseButtonClick ? oncloseButtonClick : () => {}}>
                                                                {closeIcon && <Icon name={closeIcon} />}
                                                            </button>
                                                        </div>
                                                    )
                                                }
                                            </div> : null
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
)
Notifications.displayName = "Notifications"

export { Notifications, NotificationVariants }