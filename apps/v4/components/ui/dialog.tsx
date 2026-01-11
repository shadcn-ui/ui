import * as React from "react";

export const Dialog: React.FC<React.HTMLAttributes<HTMLDivElement> & { open?: boolean; onOpenChange?: (open: boolean) => void }> = ({ children }) => {
  return <div>{children}</div>;
};

export const DialogTrigger: React.FC<any> = ({ children }) => <>{children}</>;
export const DialogContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = "", ...props }) => (
  <div {...props} className={className}>{children}</div>
);
export const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = "", ...props }) => (
  <div {...props} className={className}>{children}</div>
);
export const DialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className = "", ...props }) => (
  <h2 {...props} className={className}>{children}</h2>
);
export const DialogDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ children, className = "", ...props }) => (
  <p {...props} className={className}>{children}</p>
);
export const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = "", ...props }) => (
  <div {...props} className={className}>{children}</div>
);

export default Dialog;
