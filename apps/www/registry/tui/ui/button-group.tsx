import React, { useState } from 'react';
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Icon, IconType } from "./icon"
import { Checkbox } from './checkbox';



const buttonGroupVariants = cva(
    "relative inline-flex items-center gap-x-1.5 -ml-px px-3 py-2 font-semibold ring-1 focus:z-10 ring-gray-500 ",

    {
        variants: {
            variant: {
                default: "border border-input bg-background",
            },
            size: {
                default: "px-3.5 py-2.5 text-sm",
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        }

    }
)
interface ButtonsList {
    checkbox?: boolean | undefined;
    name?:string | undefined;
    icon?:IconType | undefined;
    dropdownOptions?: string[] | undefined ;
  }

interface Options {
    items: { name?: string | undefined ; href?: string | undefined }[];
}

export interface ButtonProps
    extends React.HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonGroupVariants> {
    buttonsList?: ButtonsList[];
    options?:Options | undefined;
    iconStyle?: string | undefined;
    color?: "black" | "white" | "slate" | "gray" | "zinc" | "neutral" | "stone" |
    "red" | "orange" | "amber" | "yellow" | "lime" | "green" | "emerald" | "teal" | "cyan"
    | "sky" | "blue" | "indigo" | "violet" | "purple" | "fuchsia" | "pink" | "rose";
}

const ButtonGroup = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, buttonsList, options, color, iconStyle, ...props }, ref) => {
        const fontColor = (color?: string) => {
            return `text-${color}-500 `
        }
        if (!buttonsList) {
            return null;
        }
        const [isOpen, setIsOpen] = useState(false);
        const [isChecked, setIsChecked] = useState(false);
        const [selectedOption, setSelectedOption] = useState(null);

        const toggleIconDropdown = () => {
            setIsOpen(!isOpen);
        };
        const handleCheckboxChange = () => {
            setIsChecked(!isChecked);
        };
        const toggleCheckbox = () => {
            setIsChecked(!isChecked);
        };
        const toggleDropdown = (option: React.SetStateAction<null>, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            event.stopPropagation();
            setSelectedOption(option === selectedOption ? null : option);
        };
        return (
            <>
                <span className={cn("isolate inline-flex rounded-md shadow-sm", className)}>
                    {buttonsList && buttonsList.map((button: any, index: number) => (
                        <button
                            className={cn(buttonGroupVariants({ className }), {
                                'rounded-l-md border-r-0': index === 0,
                                'rounded-r-md border-l-0': index === buttonsList.length - 1,
                            })}
                            key={index}
                            ref={ref}
                            onClick={(e) => {
                                if (button.name)
                                    return;
                                if (button.checkbox) {
                                    toggleCheckbox();
                                } else if (button.dropdownOptions) {
                                    toggleDropdown(button.name, e);
                                } else {
                                    toggleIconDropdown();
                                }
                            }}
                            {...props}
                        >
                            {button.icon && <Icon name={button.icon} className={cn(`${iconStyle}`, fontColor(color), className, { ...props })} />}
                            {button.name && button.name}
                            {button.checkbox && (<Checkbox onChange={handleCheckboxChange} className={cn(className)} {...props} />)}
                            {button.dropdownOptions && (
                                <select
                                    className={cn(" rounded-l-none rounded-r-md py-1.5 pl-0 pr-0.5", fontColor(color), className, { ...props })}
                                    onClick={(e) => e.stopPropagation()}>
                                    {button.dropdownOptions.map((option: string[], index: number) => (
                                        <option key={index}>{option}</option>
                                    ))}
                                </select>
                            )}
                        </button>
                    ))}

                    {isOpen && (
                        <div className={cn(" z-10 mt-14 absolute w-56 rounded-md  py-3 text-base bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none", fontColor(color), className, { ...props })}>
                            {options && options.items.map((option , index: number) => (
                                <a href={option.href} key={index} className={cn("block px-4 py-2 text-sm", fontColor(color), className, { ...props })} >
                                    {option.name}
                                </a>
                            ))}
                        </div>
                    )}
                </span>

            </>
        )
    }
)
ButtonGroup.displayName = "ButtonGroup"

export { ButtonGroup, buttonGroupVariants }