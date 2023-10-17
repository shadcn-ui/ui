import React, { useState } from 'react';
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Icon, IconType } from "./icon"
import { Checkbox } from './checkbox';
import { colors } from './helper/types';



const buttonGroupVariants = cva(
    "relative inline-flex items-center gap-x-1.5 -ml-px font-semibold ring-1 focus:z-10 ring-primary/20 ",

    {
        variants: {
            variant: {
                default: "border border-input bg-background",
            },
            size: {
                default: "px-3.5 py-2 text-sm",
                checkbox:"px-3"
            }
        },
        defaultVariants: {
            variant: "default",
        }

    }
)
interface ButtonsList {
    checkbox?: boolean | undefined;
    name?: string | undefined;
    icon?: IconType | undefined;
    dropdownOptions?: string[] | undefined;
}

interface Options {
    items: { name?: string | undefined; href?: string | undefined }[];
}

export interface ButtonProps
    extends React.HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonGroupVariants> {
    buttonsList?: ButtonsList[];
    dropDownOptions?: Options;
    iconStyle?: string;
    dropdownWidth?: string;
    textColor?: colors;
    size?:"default"|"checkbox";
}

const ButtonGroup = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({  buttonsList, dropdownWidth,size, dropDownOptions, textColor, iconStyle,className, ...props }, ref) => {
        const fontColor = (textColor?: colors) => {
            return `text-${textColor}-500 `
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
                            className={cn(buttonGroupVariants({size, className }), {
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
                            {button.icon && <Icon name={button.icon} className={cn(`h-4 w-4 ${iconStyle}`, fontColor(textColor), className, { ...props })} />}
                            {button.name && button.name}
                            {button.checkbox && (<Checkbox onChange={handleCheckboxChange} className={cn(className)} {...props} />)}
                            {button.dropdownOptions && (
                                <select
                                    className={cn(" rounded-l-none rounded-r-md py-1.5 pl-0 pr-0.5", fontColor(textColor), className, { ...props })}
                                    onClick={(e) => e.stopPropagation()}>
                                    {button.dropdownOptions.map((option: string[], index: number) => (
                                        <option key={index} className={cn("hover:bg-primary/50")}>{option}</option>
                                    ))}
                                </select>
                            )}
                        </button>
                    ))}

                    {isOpen && (
                        <div className={cn(` z-10 ${dropdownWidth} mt-14 absolute rounded-md  py-3 text-base bg-primary-foreground shadow-lg ring-1 ring-primary/30 ring-opacity-5 focus:outline-none`, fontColor(textColor), className, { ...props })}>
                            {dropDownOptions && dropDownOptions.items.map((option, index: number) => (
                                <a href={option.href} key={index} className={cn("block px-4 py-2 text-sm", fontColor(textColor), className, { ...props })} >
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