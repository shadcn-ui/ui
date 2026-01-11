import * as React from "react";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className = "", ...props }, ref) => {
  return <textarea ref={ref} {...props} className={`border rounded-md p-2 ${className}`} />;
});

Textarea.displayName = "Textarea";

export default Textarea;
