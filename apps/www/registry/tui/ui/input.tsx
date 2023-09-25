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
        destructive: " border text-destructive  border-destructive placeholder:text-destructive/50 ",
        default: "border bg-background",
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
      labelAndBorderStyle: {
        innerBorder: "min-w-0 flex-1 rounded-none rounded-r-md border-l-0 ",
        iconWithLabel: "pl-10 ",
        leadingDropdown: "pl-[5rem] ",
        labelInside: "pt-10",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      round: "default"
    },

  }
)

const inputGroupLabelVariant = cva(
  "block font-medium leading-6 ",
  {
    variants: {
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
        sm: "text-sm ",
        m: "text-base",
        lg: "text-lg",
        xl: "text-xl"
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
  note?: string | undefined;
  hint?: string | undefined;
  bottomBorder?: boolean | undefined;
  label?: string | undefined;
  trailingAddOn?: boolean | undefined;
  options?: string[] | undefined ;
  borderInside?: string | undefined;
  addOnLabel?: string | undefined;
  buttonLabel?: string | undefined;
  icon?: IconType | undefined;
  iconStyle?: string | undefined;
  keyboardName?: string | undefined;
  alignDropdown?: "prefix"|"suffix" ;
  labelAlign?: "left" | "over" | "inside";
  alignIcon?: "left" | "right";
  color?: "black" | "white" | "slate" | "gray" | "zinc" | "neutral" | "stone" |
  "red" | "orange" | "amber" | "yellow" | "lime" | "green" | "emerald" | "teal" | "cyan"
  | "sky" | "blue" | "indigo" | "violet" | "purple" | "fuchsia" | "pink" | "rose";
}

const Input = React.forwardRef<
  HTMLInputElement,
  InputProps>(({ className, name, keyboardName, alignIcon, iconStyle, icon, borderInside, color, labelAlign, buttonLabel, trailingAddOn, options, variant, placeholder, label, labelAndBorderStyle, alignDropdown, addOnLabel, hint, bottomBorder, disabled, round, note, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "input"
    const fontColor = (color?: string) => {
      return `text-${color}-500`
    }
    return (
      <div className="relative">
        {
          (labelAlign === "over" || labelAlign === "left") && (<label className={cn(inputGroupLabelVariant({}), className)}>{label}
            {hint && (<span className={cn("pl-36", fontColor(color), className)}>{hint}</span>)}
          </label>
          )
        }
        <div className={cn("mt-2 flex rounded-md shadow-sm relative", className)}>

          {(borderInside === "withBorder") ?
            <div className={cn("flex rounded-l-md shadow-sm max-w-md", className)}>
              <span className={cn("flex select-none border-r-0 border rounded-l-md items-center pl-3 text-sm", (fontColor(color)), className)}{...props}>{addOnLabel}</span> </div>
            : (borderInside === "withoutBorder") ?
              <span className={cn("inline-flex items-center  rounded-l-md border border-r-0 px-3 sm:text-sm", className)}{...props}>
                {addOnLabel}</span> : null
          }
          {icon ? <Icon name={icon} className={cn(`${alignIcon === "left" ? "absolute top-[11px] left-0 flex items-center pl-3" : "mr-2 absolute top-[11px] right-0 flex items-center pl-3"} ${iconStyle}`, fontColor(color), className)} {...props} /> : null}
          {
            alignDropdown && (
              <div className={cn(`absolute text-sm inset-y-0 ${alignDropdown === 'prefix' ? 'left-0 flex items-center' : 'right-0 flex pr-px items-center -mb-[7px]'}`, className)} {...props}>
                <select className={cn(`mt-${alignDropdown === 'prefix' ? '8' : '6'} ${alignDropdown === 'prefix' ? 'pl-2 -top-[23px]' : 'pr-2 -left-[61px] -top-[14px]'} bg-inherit absolute`, fontColor(color), className)}>
                  {options && options.map((option:string, index: number) => (
                    <option key={index}>{option}</option>
                  ))}
                </select>
              </div>
            )
          }
          {labelAlign === "inside" ? (
            <label className={cn("absolute left-2 top-2 pl-1.5 pointer-events-none text-sm", fontColor(color), className)} >
              {label}
            </label>
          ) : null}
          <Comp
            className={cn(inputVariants({ round, labelAndBorderStyle, variant, }), className)}
            placeholder={placeholder}
            disabled={disabled}
            ref={ref}
            {...props}
          />
          {
            buttonLabel && (
              <button type="button" className={cn(InputGroupButtonVariant({}))}>
                {icon && <Icon name="arrow-up-wide-short-regular" className={cn(`${iconStyle}`, fontColor(color), className)} {...props} />}
                {buttonLabel}
              </button>
            )
          }
        </div>

        {trailingAddOn && (
          <div className="pointer-events-none absolute -mb-[30px] inset-y-0 right-0 flex items-center pr-3">
            <span className={cn("text-sm absolute top-[8px] -left-[28px]", fontColor(color), className)} {...props}>{addOnLabel}</span>
          </div>
        )}


        {bottomBorder ? <div className={cn("absolute inset-x-0 bottom-0 border-t peer-focus:border-t-2 border peer-focus:border", className)} {...props} /> : ""}

        {note && <span className={cn("text-sm", fontColor(color), className)} {...props}>{note}</span>}

        {keyboardName && (
          <div className={cn("inset-y-0 right-0 flex py-1.5 pr-1.5 ml-56 -mt-[37px]", className)}>
            <kbd className={cn("py-0.5", keyboardVariant({}), className)} {...props}>{keyboardName}</kbd>
          </div>
        )}

      </div>
    )
  })
Input.displayName = "Input"

export { Input, inputVariants }