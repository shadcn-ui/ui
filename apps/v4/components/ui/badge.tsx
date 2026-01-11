import * as React from "react";

export const Badge: React.FC<React.HTMLAttributes<HTMLSpanElement> & { variant?: string; asChild?: boolean }> = ({ children, className = "", ...props }) => {
  return (
    <span {...props} className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
