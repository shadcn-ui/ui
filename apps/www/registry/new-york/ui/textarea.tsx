import * as React from "react";
import { cn } from "@/lib/utils";
import { useRef, useEffect } from 'react'
import { mergeRefs } from "react-merge-refs";
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    const texteAreaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
      const ref = texteAreaRef?.current;

      const updateTextareaHeight = () => {
        if (ref) {
          ref.style.height = "auto";
          ref.style.height = ref?.scrollHeight + "px";
        }
      };

      updateTextareaHeight();
      ref?.addEventListener("input", updateTextareaHeight);

      return () => ref?.removeEventListener("input", updateTextareaHeight);
    }, []);

    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={mergeRefs([texteAreaRef, ref])}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };