import * as React from "react";

export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ children, className = "", ...props }) => {
  return (
    <label {...props} className={`block text-sm font-medium ${className}`}>
      {children}
    </label>
  );
};

export default Label;
