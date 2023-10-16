"use client"
import * as React from "react"
import { useLayoutEffect, useRef } from "react"
import { mergeRefs } from "react-merge-refs"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    const texteAreaRef = useRef<HTMLTextAreaElement>(null)
    const [height, setHeight] = React.useState(80)
    console.log(texteAreaRef?.current?.clientHeight);
    useLayoutEffect(() => {
      const ref = texteAreaRef?.current
      console.log(texteAreaRef?.current?.clientHeight);

      const updateTextareaHeight = () => {
        if (ref) {
          const ml = window.getComputedStyle(ref)
          const cmp = ml.getPropertyValue('clientHeight')
          console.log('cmp', Number(cmp))
          ref.style.height = "auto"
          ref.style.height = ref?.scrollHeight + "px"
          setHeight(ref.scrollHeight);
        }
      }
      console.log(texteAreaRef?.current?.clientHeight);

      updateTextareaHeight()
      ref?.addEventListener("input", updateTextareaHeight)

      return () => ref?.removeEventListener("input", updateTextareaHeight)
    }, [])

    return (
      <textarea
        className={cn(
          `flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`,
          className
        )}
        ref={mergeRefs([texteAreaRef, ref])}
        {...props}
      />
    )
  }
)

Textarea.displayName = "Textarea"

export { Textarea }
