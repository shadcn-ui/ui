import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// TODO: pnpm i -w [the following libs]
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconName, IconStyle, IconDefinition, findIconDefinition, library, IconPrefix, IconPack, } from "@fortawesome/fontawesome-svg-core";
import * as FontAwesomeSolid from '@fortawesome/free-solid-svg-icons';
import * as FontAwesomeLight from '@fortawesome/pro-light-svg-icons';
import * as FontAwesomeBrands from '@fortawesome/free-brands-svg-icons';
import * as FontAwesomeDuotone from '@fortawesome/pro-duotone-svg-icons';
import * as FontAwesomeRegular from '@fortawesome/free-regular-svg-icons';
import * as FontAwesomeThin from '@fortawesome/pro-thin-svg-icons';
// import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
// import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: IconName;
  iconStyle?: IconStyle;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, icon, iconStyle = "solid", ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    let renderIcon: React.JSX.Element | null = null;
    if (icon) {
      let iconStyleLibrary;
      switch (iconStyle) {
        case "regular":
          console.log("regular ############")
          iconStyleLibrary = FontAwesomeRegular;
          break;
        case "brands":
          iconStyleLibrary = FontAwesomeBrands;
          break;
        case "duotone":
          iconStyleLibrary = FontAwesomeDuotone;
          break;
        case "light":
          iconStyleLibrary = FontAwesomeLight;
          break;
        case "thin":
          iconStyleLibrary = FontAwesomeThin;
          break;
        default:
          iconStyleLibrary = FontAwesomeSolid;
          break;
      }
      console.log(Object.values(iconStyleLibrary), 'Object.values(iconStyleLibrary)')
      const findIcon: (IconDefinition | IconPrefix | IconPack)[] = Object.values(iconStyleLibrary).filter((val: any) => val.iconName === icon)
      console.log(findIcon, 'findIcon')
      library.add(findIcon);
      renderIcon = icon ? (
        <FontAwesomeIcon icon={icon} />
      ) : null;
    }



    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <div className="flex items-center">
          <div className="mr-2">
            {renderIcon}
          </div>
          {props.children}
        </div>
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
