import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"
import { Icon, IconType } from "./icon"
import { colors } from "./helper/types"

const inputVariants = cva(
  `block border-0 shadow-sm ring-inset focus:outline-none disabled:cursor-not-allowed disabled:bg-primary/10 disabled:text-primary/70 disabled:ring-primary/20 `,

  {
    variants: {
      variant: {
        destructive: " border border-destructive  text-destructive placeholder:text-destructive/50 ",
        default: "border bg-background",
      },
      inputSize: {
        default: "w-full py-1.5 px-3 text-sm leading-6 "
      },
      border: {
        default: "rounded-md ",
        roundedPill: "rounded-full px-4",
        button: "rounded-none rounded-l-md ",
        roundedButton: "rounded-l-md",
        bottomBorder:" border-0 bg-primary/10 focus:ring-0 "

      },
      borderStyleForAddOn: {
        innerBorder: "min-w-0 flex-1 rounded-none rounded-r-md border-l-0 ",
        iconWithLabel: "pl-10 ",
        leadingDropdown: "pl-[5rem] ",
        labelInside: "pt-10",
      }
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
      border: "default"
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
  "relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md p-2 font-semibold",
  {
    variants: {
      buttonvariant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input bg-background hover:text-accent-foreground hover:bg-primary/70",
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

type InputProps = {
  asChild?: boolean | undefined;
  note?: string | undefined;
  hint?: string | undefined;
  bottomBorder?: boolean | undefined;
  label?: string | undefined;
  trailingAddOn?: boolean | undefined;
  options?: string[] | undefined;
  addOnText?: string | undefined;
  buttonLabelText?: string | undefined;
  icon?: IconType | undefined;
  iconStyle?: string | undefined;
  keyboardName?: string | undefined;
  error?: string | undefined;
  textColor?: colors;
  alignDropdown?: "left" | "right";
  labelAlign?: "over" | "inside";
  alignIcon?: "right";
  addOnBorder?: "withBorder" | "withoutBorder";
  border?:"default"|"roundedPill"|"button"|"roundedButton"|"bottomBorder";
  borderStyleForAddOn?:"innerBorder"|"iconWithLabel"|"leadingDropdown"|"labelInside";
  inputValue?:string;
  handleChange?: (event:React.ChangeEvent<HTMLInputElement>) => void;
  handleInput?: (event:React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown?:(event:React.KeyboardEvent<HTMLInputElement>) => void;
  handleSubmit?:(event: React.FormEvent) => void;
}

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputVariants> &
  InputProps>(({ name, error, keyboardName,inputValue,handleChange,handleInput,handleKeyDown,handleSubmit, alignIcon="left", iconStyle, icon, addOnBorder, textColor, labelAlign = "left", buttonLabelText, trailingAddOn, options, variant, placeholder, label, borderStyleForAddOn, alignDropdown, addOnText, hint, bottomBorder, disabled, border, note, asChild = false, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "input"
    return (
      <div className="relative">
        {
          (labelAlign === "over" || labelAlign === "left") && (<label className={cn("flex items-end justify-between", (inputGroupLabelVariant({}), className))}>{label}
            {hint && (<span className={cn("text-primary/70", className)}>{hint}</span>)}
          </label>
          )
        }
        <div className={cn("relative mt-2 flex items-center rounded-md shadow-sm", className)}>

          {(addOnBorder === "withBorder") ?
            <div className={cn("flex max-w-md rounded-l-md shadow-sm", className)}>
              <span className={cn("flex select-none items-center rounded-l-md border py-2 px-3 text-sm text-primary/80 ", className)}{...props}>{addOnText}</span> </div>
            : (addOnBorder === "withoutBorder") ?
              <span className={cn("flex items-center rounded-l-md border border-r-0 pl-3 py-2 text-sm text-primary/80", className)}{...props}>
                {addOnText}</span> : null
          }
          {icon ? <Icon name={icon} className={cn(" h-5 w-5 absolute flex items-center pl-3 text-primary/50", `${alignIcon === "left" ? "left-0" : " right-0 pr-2"} ${iconStyle}`, className)} {...props} /> : null}
          {error ? <Icon name="circle-exclamation-solid" className={cn("h-5 w-5 absolute flex items-center pl-3 text-destructive", `${alignIcon === "left" ? " left-0 " : " right-0 pr-2"} ${iconStyle}`, className)} {...props} /> : null}
          {
            alignDropdown && (
              <div className={cn(`absolute text-sm  pr-2 ${alignDropdown === 'right' ? 'right-0' : 'left-0 '} flex items-center`, className)} {...props}>
                <select className={cn(`${alignDropdown === 'right' ? 'pr-1 ' : 'pl-1'} h-full rounded-md border-0 bg-transparent py-2 pl-1.5 pr-0 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/60 sm:text-sm text-primary/50`, className)}>
                  {options && options.map((option: string, index: number) => (
                    <option key={index}>{option}</option>
                  ))}
                </select>
              </div>
            )
          }
          {labelAlign === "inside" ? (
            <label className={cn("pointer-events-none absolute left-2 top-2 pl-1.5 text-sm text-primary/50", className)} >
              {label}
            </label>
          ) : null}
          <Comp
            className={cn(`${error ? "border-destructive text-destructive/40 placeholder:text-destructive/50 focus:ring-1 focus:ring-inset ring-destructive focus:ring-destructive " : "focus:ring-2 focus:ring-inset focus:ring-secondary/60"}`, inputVariants({ border, borderStyleForAddOn, variant, }), className)}
            placeholder={placeholder}
            disabled={disabled}
            name={name}
            value={inputValue}
            onChange={handleChange} 
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onSubmit={handleSubmit}
            ref={ref}
            {...props}
          />
          {
            buttonLabelText && (
              <button type="button" className={cn(InputGroupButtonVariant({}))}>
                {icon && <Icon name="arrow-up-wide-short-regular" className={cn(`text-primary/50 ${iconStyle}`, className)} {...props} />}
                {buttonLabelText}
              </button>
            )
          }
          {trailingAddOn && (
            <div className={cn("pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3", className)}>
              <span className={cn("text-sm text-primary/50", className)}>{addOnText}</span>
            </div>
          )}
          {keyboardName && (
            <div className={cn("absolute inset-y-0 right-0 flex items-center py-1.5 pr-1.5 ", className)}>
              <kbd className={cn("inline-flex items-center py-0.5", keyboardVariant({}), className)} {...props}>{keyboardName}</kbd>
            </div>
          )}
        </div>
        {error && <span className={cn(`${error ? "text-destructive" : null} text-sm`, className)} {...props}>{error}</span>}

        {bottomBorder && <div className={cn("absolute inset-x-0 bottom-0 border-t border-primary/30 focus:border-t focus:ring-1 ring-primary/30 ring-1", className)} {...props} />}

        {note && <span className={cn("text-sm text-primary/90", className)} {...props}>{note}</span>}

      </div>
    )
  })
Input.displayName = "Input"

export { Input, inputVariants }
