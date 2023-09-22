import React from 'react'
import { Icon, IconType } from './icon'
import { cn } from '@/lib/utils'

interface Props {
    label?: string;
    title?: string;
    icon?: IconType;
    className?: string;
    align?: "left" | "right";
    children?: any;
}

const Divider = ({ label, title, icon, className, align, children }: Props) => {
    return (
        <div className='relative'>
            <div className={cn(
                align === "left" && "justify-start",
                align === "right" && "justify-end",
                children && (title || label) && "justify-center",
                "absolute inset-0 flex items-center"
            )}>
                <div className="w-full border-t border-gray-300" />
            </div>

            <div className={cn(
                `bg-background relative flex items-center justify-center`,
                align === "left" && !children && "justify-start",
                align === "right" && !children && "justify-end",
                children && (title || label) && "justify-between"
            )}>
                {label || title ? <span className={cn("text-md px-2 font-light bg-background absolute -top-3",
                    className,
                    title && "font-semibold",
                    children && "text-start",
                )}> {label || title}
                </span> : null}

                {icon && !label && !title ?
                    <Icon
                        name={icon}
                        className={cn("w-4 h-4 text-muted-accent absolute -top-2 bg-background px-2", className)}
                    />
                    : null}

                {children ?
                    <div className={cn(`w-fit text-end inline-flex items-center bg-background absolute -top-5`,
                        !title && !label ? "" : "right-0")
                    }>
                        {children}
                    </div>
                    : null}
            </div>
        </div >
    )
}

export default Divider
