import * as React from "react";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className = "", ...props }, ref) => {
  return <input ref={ref} {...props} className={`border px-2 py-1 rounded-md ${className}`} />;
});

Input.displayName = "Input";

export default Input;
