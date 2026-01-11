import * as React from "react";

type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "destructive";
};

const baseClasses = "w-full rounded-md border p-4 flex gap-3";
const variantClasses: Record<string, string> = {
  default: "border-border bg-background text-foreground",
  destructive: "border-red-200 bg-red-50 text-red-900",
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className = "", variant = "default", children, ...props }, ref) => {
    const variantClass = variantClasses[variant] || variantClasses.default;
    return (
      <div ref={ref} className={`${baseClasses} ${variantClass} ${className}`} {...props}>
        {children}
      </div>
    );
  }
);
Alert.displayName = "Alert";

export const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className = "", children, ...props }, ref) => (
  <p ref={ref} className={`text-sm leading-6 ${className}`} {...props}>
    {children}
  </p>
));
AlertDescription.displayName = "AlertDescription";

export const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className = "", children, ...props }, ref) => (
  <p ref={ref} className={`font-semibold leading-6 ${className}`} {...props}>
    {children}
  </p>
));
AlertTitle.displayName = "AlertTitle";

export default Alert;
