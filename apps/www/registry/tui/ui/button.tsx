import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// TODO: pnpm i -w [the following libs]
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconName, IconStyle, IconDefinition, findIconDefinition, library, IconPrefix, IconPack, } from "@fortawesome/fontawesome-svg-core";

import { fas } from '@fortawesome/pro-solid-svg-icons';
import { fal } from '@fortawesome/pro-light-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fad } from '@fortawesome/pro-duotone-svg-icons';
import { far } from '@fortawesome/pro-regular-svg-icons';
import { fat } from '@fortawesome/pro-thin-svg-icons';
library.add(fas, fal, fab, fad, far, fat)

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
      const perfixList: { name: IconStyle, value: IconPrefix }[] = [
        { name: "solid", value: "fas" },
        { name: "regular", value: "far" },
        { name: "light", value: "fal" },
        { name: "duotone", value: "fad" },
        { name: "brands", value: "fab" },
        { name: "thin", value: "fat" },
      ]
      const iconPrefix: IconPrefix | undefined = perfixList.find((obj) => obj.name === iconStyle)?.value || "fas";
      renderIcon = icon ? (
        <FontAwesomeIcon icon={[iconPrefix, icon]} />
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
