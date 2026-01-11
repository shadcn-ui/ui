import * as React from "react";

export const Select: React.FC<any> = ({ children, value, onValueChange, ...props }) => {
  return <div {...props}>{children}</div>;
};

export const SelectTrigger: React.FC<any> = ({ children, className = "", ...props }) => (
  <div {...props} className={className}>{children}</div>
);

export const SelectValue: React.FC<any> = ({ children, placeholder }) => <span>{children || placeholder}</span>;

export const SelectContent: React.FC<any> = ({ children, className = "", ...props }) => <div {...props} className={className}>{children}</div>;

export const SelectItem: React.FC<any> = ({ children, value }) => <div data-value={value}>{children}</div>;

export default Select;
