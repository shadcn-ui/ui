import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"
import { Icon, IconType } from "./icon"

const inputVariants = cva(
  "block border-0  focus:outline-none shadow-sm ring-inset ",

  {
    variants: {
      variant: {
        default: " border bg-primary text-primary-foreground placeholder:text-primary-foreground border-primary",
        destructive: " border bg-destructive text-destructive-foreground placeholder:text-destructive-foreground border-destructive",
        outline: "border bg-background hover:bg-accent",
        secondary: "bg-secondary text-secondary-foreground",

      },
      size: {
        default: "w-full py-1.5 pl-[12px] text-sm leading-6 "
      },
      round: {
        default: "rounded-md ",
        roundedPill: "rounded-full px-4",
        button: "rounded-none rounded-l-md ",
        roundForButton: "rounded-l-lg"

      },
      borderStyle: {
        borderFocus: "focus:ring-0 peer ring-0 p-0 py-1.5 pl-[12px]",
        innerBorder: "min-w-0 flex-1 rounded-none rounded-r-md ",
        iconWithLabel: "pl-10 ",
        leadingDropdown: "pl-[5rem] ",
        labelInside: "pt-10",
        error: "border-red-600"

      }
    },
    defaultVariants: {
      variant: "outline",
      size: "default",
      round: "default"
    },

  }
)

const inputGroupLabelVariant = cva(
  "block font-medium leading-6 ",
  {
    variants: {
      labelVariants: {
        default: "text-primary ",
        destructive: " text-destructive",
        outline: "text-accent",
        secondary: "text-secondary",
        ghost: " text-accent",
      },
      size: {
        xs: "text-xs",
        default: "text-sm ",
        m: "text-base",
        lg: "text-lg",
        xl: "text-xl"

      },
    },
    defaultVariants: {
      size: "default"
    }
  }
)

const keyboardVariant = cva(
  "inline-flex items-center border  px-1 font-sans ",
  {
    variants: {
      keyboardvariant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input bg-background hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground",
      },
      size: {
        default: "text-xs",
      },
      round: {
        default: "rounded"
      }
    },
    defaultVariants: {
      keyboardvariant: "outline",
      round: "default",
      size: "default"
    }
  }
)
const InputGroupButtonVariant = cva(
  "relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-2 py-2 font-semibold",
  {
    variants: {
      buttonvariant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input bg-background hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground",

      },
      fontSize: {
        default: "text-sm"
      }
    },
    defaultVariants: {
      buttonvariant: "outline",
      fontSize: "default"
    }
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
  VariantProps<typeof inputVariants> {
  asChild?: boolean | undefined;
  dropdownVariant?: string | undefined,
  labelVariants?: any,
  note?: string | undefined;
  hint?: string | undefined;
  bottomBorder?: boolean | undefined;
  keyboard?: boolean | undefined;
  roundPill?: boolean | undefined
  label?: string | undefined;
  trailingAddOn?: boolean | undefined;
  labelAlign?: "left" | "over" | "inside";
  options?: any;
  dropdown?: string | undefined;
  borderInside?: string | undefined;
  addOnLabel?: string | undefined;
  buttonLabel?: string | undefined;
  trailingButton?: boolean | undefined;
  icon?: IconType;
  alignIcon?: "left" | "right";
  color?: "black" | "white" | "slate" | "gray" | "zinc" | "neutral" | "stone" |
  "red" | "orange" | "amber" | "yellow" | "lime" | "green" | "emerald" | "teal" | "cyan"
  | "sky" | "blue" | "indigo" | "violet" | "purple" | "fuchsia" | "pink" | "rose";
  bgColor?: "white";

}

const Input = React.forwardRef<
  HTMLInputElement,
  InputProps>(({ className, name, alignIcon, icon, borderInside, color, bgColor, labelAlign, labelVariants, buttonLabel, dropdownVariant, trailingButton, trailingAddOn, options, variant, placeholder, roundPill, label, borderStyle, keyboard, dropdown, addOnLabel, hint, bottomBorder, disabled, round, note, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "input"
    const fontColor = (color?: string) => {
      return `text-${color}-500`
    }
    const backgroundColor = (bgColor?: string) => {
      return `bg-${bgColor}`
    }
    return (
      <div className="relative">
        {
          (hint) ? <label className={cn(inputGroupLabelVariant({}))}> {label}
            <span className={cn("pl-36", (fontColor(color)))}> {hint} </span>
          </label> : labelAlign === "over" ? <label className={cn("absolute -top-[10px] mt-[0] w-9 h-4 pl-0 left-2 inline-block", (backgroundColor(bgColor)), (inputGroupLabelVariant({})))}> {label} </label> : labelAlign === "left" ? <label className={cn(inputGroupLabelVariant({}))}> {label} </label> : ""
        }

        <div className="mt-2 flex rounded-md shadow-sm">

          {(borderInside === "withborder") ?
            <div className="flex rounded-l-md shadow-sm max-w-md">
              <span className={cn("flex select-none border-r-0 border rounded-l-md items-center pl-3 text-sm", (fontColor(color)))}>{addOnLabel}</span> </div>
            : (borderInside === "withoutborder") ?
              <span className="inline-flex items-center  rounded-l-md border border-r-0 px-3 sm:text-sm">
                {addOnLabel}</span> : null

          }
          {icon ?<Icon name={icon} className={cn(`${alignIcon === "left" ? "h-5 w-5 absolute top-[37px] left-0 flex items-center pl-3" : "h-5 w-5 mr-2 absolute top-[37px] right-0 flex items-center pl-3"}`, fontColor(color))} /> : null}
          {
            dropdown === "prefix" ? <div className="absolute text-sm inset-y-0 left-0 flex items-center">
              <select className={cn("mt-[30px] bg-inherit pl-2", (fontColor(color)))}>
                {options.map((option: any, index: any) => (
                  <option key={index}>{option}</option>
                ))}
              </select>
            </div> : dropdown === "sufix" ? <div className="absolute text-sm inset-y-0 right-0 flex pr-px items-center -mb-[7px]">
              <select className={cn("mt-[23px] bg-inherit pr-2", (fontColor(color)))}>
                {options.map((option: any, index: any) => (
                  <option key={index}>{option}</option>
                ))}
              </select>
            </div> : ''
          }
          {
            labelAlign === "inside" ?
              <label className={cn("absolute left-2 top-2 pl-1.5 pointer-events-none text-sm", (fontColor(color)))} >
                {label}
              </label> : null
          }
          <Comp
            className={cn(inputVariants({ round, borderStyle, variant, }))}
            placeholder={placeholder}
            disabled={disabled}
            ref={ref}
            {...props}
          />
          {
            trailingButton ?
              <button type="button" className={cn((InputGroupButtonVariant({})))}>
                {
                  icon ?
                    <Icon name="arrow-up-wide-short-regular" className={cn(" h-5 w-5", (fontColor(color)))} /> : ""
                }
                {buttonLabel}
              </button> : ""
          }
        </div>
        
        {trailingAddOn ?
          <div className="pointer-events-none absolute -mb-[30px] inset-y-0 right-0 flex items-center pr-3">
            <span className={cn("text-sm ", (fontColor(color)))}>{addOnLabel}</span>
          </div> : ''
        }
       
        {bottomBorder ? <div className={cn("absolute inset-x-0 bottom-0 border-t peer-focus:border-t-2 border peer-focus:border")} /> : ""}
        
        {note ? <span className={cn(" text-sm ", (fontColor(color)))}> {note} </span> : ""}
        
        {keyboard ?
          <div className=" inset-y-0 right-0 flex py-1.5 pr-1.5 ml-56 -mt-[37px]">
            <kbd className={cn("py-0.5", (keyboardVariant({})))}>⌘K</kbd>
          </div> : ''
        }
      </div>
    )
  })
Input.displayName = "Input"

export { Input, inputVariants }