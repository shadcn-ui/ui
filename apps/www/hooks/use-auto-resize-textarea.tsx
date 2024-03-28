import * as React from "react"

export const useAutoResizeTextarea = (ref: React.ForwardedRef<HTMLTextAreaElement>, autoResize: boolean) => {

    const textAreaRef = React.useRef<HTMLTextAreaElement>(null)

    React.useImperativeHandle(ref, () => textAreaRef.current!);

    React.useEffect(() => {
        const ref = textAreaRef?.current

        const updateTextareaHeight = () => {
            if (ref && autoResize) {
                ref.style.height = "auto"
                ref.style.height = ref?.scrollHeight + "px"
            }
        }

        updateTextareaHeight()

        ref?.addEventListener("input", updateTextareaHeight)

        return () => ref?.removeEventListener("input", updateTextareaHeight)

    }, [autoResize])

    return { textAreaRef }
}