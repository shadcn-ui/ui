import * as React from "react";

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; size?: string; asChild?: boolean }> = ({ children, className = "", ...props }) => {
  return (
    <button {...props} className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm ${className}`}>
      {children}
    </button>
  );
};

export default Button;
