import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// TODO: pnpm i -w [the following libs]
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconName, IconStyle, IconLookup, IconDefinition, findIconDefinition, library, IconPrefix, IconProp } from "@fortawesome/fontawesome-svg-core";
import { faMailbox } from '@fortawesome/pro-solid-svg-icons';
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
    const iconPrefix: IconPrefix = `fa${iconStyle === "solid" ? "s" : iconStyle === 'light' ? "l" : "r"}`;
    let renderIcon: React.JSX.Element | null = null;

    if (icon) {
      const iconStyleLookup: IconLookup = { prefix: `${iconPrefix}`, iconName: icon! }

      const iconNameDefinition: IconDefinition | null = findIconDefinition(iconStyleLookup)

      library.add(iconNameDefinition);

      // TODO: to be removed after the component is ready with FA Icons
      React.useEffect(() => {
        console.log(iconStyleLookup, 'ISL');
        console.log(iconNameDefinition, 'IND')
      }, [])

      // Conditionally render the icon based on iconStyle and icon prop
      // <FontAwesomeIcon icon={eval(`${iconStyle}`)(iconStyleLookup)} />
      renderIcon = icon ? (
        <FontAwesomeIcon icon={iconNameDefinition} />
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
