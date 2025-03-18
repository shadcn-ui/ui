"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"
import {
  composeEventHandlers,
  useComposedRefs,
} from "@/registry/default/lib/composition"

const DATA_ACTION_ATTR = "data-action"

const ROOT_NAME = "Editable"
const AREA_NAME = "EditableArea"
const PREVIEW_NAME = "EditablePreview"
const INPUT_NAME = "EditableInput"
const TRIGGER_NAME = "EditableTrigger"
const LABEL_NAME = "EditableLabel"
const TOOLBAR_NAME = "EditableToolbar"
const CANCEL_NAME = "EditableCancel"
const SUBMIT_NAME = "EditableSubmit"

const EDITABLE_ERRORS = {
  [ROOT_NAME]: `\`${ROOT_NAME}\` components must be within \`${ROOT_NAME}\``,
  [AREA_NAME]: `\`${AREA_NAME}\` must be within \`${ROOT_NAME}\``,
  [PREVIEW_NAME]: `\`${PREVIEW_NAME}\` must be within \`${ROOT_NAME}\``,
  [INPUT_NAME]: `\`${INPUT_NAME}\` must be within \`${ROOT_NAME}\``,
  [TRIGGER_NAME]: `\`${TRIGGER_NAME}\` must be within \`${ROOT_NAME}\``,
  [LABEL_NAME]: `\`${LABEL_NAME}\` must be within \`${ROOT_NAME}\``,
  [TOOLBAR_NAME]: `\`${TOOLBAR_NAME}\` must be within \`${ROOT_NAME}\``,
  [CANCEL_NAME]: `\`${CANCEL_NAME}\` must be within \`${ROOT_NAME}\``,
  [SUBMIT_NAME]: `\`${SUBMIT_NAME}\` must be within \`${ROOT_NAME}\``,
} as const

type Direction = "ltr" | "rtl"

const DirectionContext = React.createContext<Direction | undefined>(undefined)

function useDirection(dirProp?: Direction): Direction {
  const contextDir = React.useContext(DirectionContext)
  return dirProp ?? contextDir ?? "ltr"
}

interface EditableContextValue {
  id: string
  inputId: string
  labelId: string
  defaultValue: string
  value: string
  onValueChange: (value: string) => void
  editing: boolean
  onCancel: () => void
  onEdit: () => void
  onSubmit: (value: string) => void
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  dir?: Direction
  maxLength?: number
  placeholder?: string
  triggerMode: "click" | "dblclick" | "focus"
  autosize: boolean
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  invalid?: boolean
}

const EditableContext = React.createContext<EditableContextValue | null>(null)
EditableContext.displayName = ROOT_NAME

function useEditableContext(name: keyof typeof EDITABLE_ERRORS) {
  const context = React.useContext(EditableContext)
  if (!context) {
    throw new Error(EDITABLE_ERRORS[name])
  }
  return context
}

type RootElement = React.ComponentRef<typeof Editable>

interface EditableRootProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "onSubmit"> {
  id?: string
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  defaultEditing?: boolean
  editing?: boolean
  onEditingChange?: (editing: boolean) => void
  onCancel?: () => void
  onEdit?: () => void
  onSubmit?: (value: string) => void
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  dir?: Direction
  maxLength?: number
  name?: string
  placeholder?: string
  triggerMode?: EditableContextValue["triggerMode"]
  asChild?: boolean
  autosize?: boolean
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  invalid?: boolean
}

const EditableRoot = React.forwardRef<HTMLDivElement, EditableRootProps>(
  (props, forwardedRef) => {
    const {
      defaultValue = "",
      value: valueProp,
      onValueChange: onValueChangeProp,
      defaultEditing = false,
      editing: editingProp,
      onEditingChange: onEditingChangeProp,
      onCancel: onCancelProp,
      onEdit: onEditProp,
      onSubmit: onSubmitProp,
      onEscapeKeyDown,
      dir: dirProp,
      maxLength,
      name,
      placeholder,
      triggerMode = "click",
      asChild,
      autosize = false,
      disabled,
      required,
      readOnly,
      invalid,
      className,
      ...rootProps
    } = props

    const id = React.useId()
    const inputId = React.useId()
    const labelId = React.useId()

    const dir = useDirection(dirProp)

    const isControlled = valueProp !== undefined
    const [uncontrolledValue, setUncontrolledValue] =
      React.useState(defaultValue)
    const value = isControlled ? valueProp : uncontrolledValue
    const previousValueRef = React.useRef(value)
    const onValueChangeRef = React.useRef(onValueChangeProp)

    const isEditingControlled = editingProp !== undefined
    const [uncontrolledEditing, setUncontrolledEditing] =
      React.useState(defaultEditing)
    const editing = isEditingControlled ? editingProp : uncontrolledEditing
    const onEditingChangeRef = React.useRef(onEditingChangeProp)

    React.useEffect(() => {
      onValueChangeRef.current = onValueChangeProp
      onEditingChangeRef.current = onEditingChangeProp
    })

    const onValueChange = React.useCallback(
      (nextValue: string) => {
        if (!isControlled) {
          setUncontrolledValue(nextValue)
        }
        onValueChangeRef.current?.(nextValue)
      },
      [isControlled]
    )

    const onEditingChange = React.useCallback(
      (nextEditing: boolean) => {
        if (!isEditingControlled) {
          setUncontrolledEditing(nextEditing)
        }
        onEditingChangeRef.current?.(nextEditing)
      },
      [isEditingControlled]
    )

    React.useEffect(() => {
      if (isControlled && valueProp !== previousValueRef.current) {
        previousValueRef.current = valueProp
      }
    }, [isControlled, valueProp])

    const [formTrigger, setFormTrigger] = React.useState<RootElement | null>(
      null
    )
    const composedRef = useComposedRefs(forwardedRef, (node) =>
      setFormTrigger(node)
    )
    const isFormControl = formTrigger ? !!formTrigger.closest("form") : true

    const onCancel = React.useCallback(() => {
      const prevValue = previousValueRef.current
      onValueChange(prevValue)
      onEditingChange(false)
      onCancelProp?.()
    }, [onValueChange, onCancelProp, onEditingChange])

    const onEdit = React.useCallback(() => {
      previousValueRef.current = value
      onEditingChange(true)
      onEditProp?.()
    }, [value, onEditProp, onEditingChange])

    const onSubmit = React.useCallback(
      (newValue: string) => {
        onValueChange(newValue)
        onEditingChange(false)
        onSubmitProp?.(newValue)
      },

      [onValueChange, onSubmitProp, onEditingChange]
    )

    const contextValue = React.useMemo<EditableContextValue>(
      () => ({
        id,
        inputId,
        labelId,
        defaultValue,
        value,
        onValueChange,
        editing,
        onSubmit,
        onEdit,
        onCancel,
        onEscapeKeyDown,
        dir,
        maxLength,
        placeholder,
        triggerMode,
        autosize,
        disabled,
        readOnly,
        required,
        invalid,
      }),
      [
        id,
        inputId,
        labelId,
        defaultValue,
        value,
        onValueChange,
        editing,
        onSubmit,
        onCancel,
        onEdit,
        onEscapeKeyDown,
        dir,
        maxLength,
        placeholder,
        triggerMode,
        autosize,
        disabled,
        required,
        readOnly,
        invalid,
      ]
    )

    const RootPrimitive = asChild ? Slot : "div"

    return (
      <EditableContext.Provider value={contextValue}>
        <RootPrimitive
          data-slot="editable"
          {...rootProps}
          ref={composedRef}
          id={id}
          className={cn("flex min-w-0 flex-col gap-2", className)}
        />
        {isFormControl && (
          <VisuallyHiddenInput
            type="hidden"
            control={formTrigger}
            name={name}
            value={value}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
          />
        )}
      </EditableContext.Provider>
    )
  }
)
EditableRoot.displayName = ROOT_NAME

interface EditableLabelProps extends React.ComponentPropsWithoutRef<"label"> {
  asChild?: boolean
}

const EditableLabel = React.forwardRef<HTMLLabelElement, EditableLabelProps>(
  (props, forwardedRef) => {
    const { asChild, className, children, ...labelProps } = props
    const context = useEditableContext(LABEL_NAME)

    const LabelPrimitive = asChild ? Slot : "label"

    return (
      <LabelPrimitive
        data-disabled={context.disabled ? "" : undefined}
        data-invalid={context.invalid ? "" : undefined}
        data-required={context.required ? "" : undefined}
        data-slot="editable-label"
        {...labelProps}
        ref={forwardedRef}
        id={context.labelId}
        htmlFor={context.inputId}
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 data-[required]:after:ml-0.5 data-[required]:after:text-destructive data-[required]:after:content-['*']",
          className
        )}
      >
        {children}
      </LabelPrimitive>
    )
  }
)
EditableLabel.displayName = LABEL_NAME

interface EditableAreaProps extends React.ComponentPropsWithoutRef<"div"> {
  asChild?: boolean
}

const EditableArea = React.forwardRef<HTMLDivElement, EditableAreaProps>(
  (props, forwardedRef) => {
    const { asChild, className, ...areaProps } = props
    const context = useEditableContext(AREA_NAME)

    const AreaPrimitive = asChild ? Slot : "div"

    return (
      <AreaPrimitive
        role="group"
        data-disabled={context.disabled ? "" : undefined}
        data-editing={context.editing ? "" : undefined}
        data-slot="editable-area"
        dir={context.dir}
        {...areaProps}
        ref={forwardedRef}
        className={cn(
          "relative inline-block min-w-0 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
          className
        )}
      />
    )
  }
)
EditableArea.displayName = AREA_NAME

interface EditablePreviewProps extends React.ComponentPropsWithoutRef<"div"> {
  asChild?: boolean
}

const EditablePreview = React.forwardRef<HTMLDivElement, EditablePreviewProps>(
  (props, forwardedRef) => {
    const { asChild, className, ...previewProps } = props
    const context = useEditableContext(PREVIEW_NAME)

    const onTrigger = React.useCallback(() => {
      if (context.disabled || context.readOnly) return
      context.onEdit()
    }, [context])

    const PreviewPrimitive = asChild ? Slot : "div"

    if (context.editing || context.readOnly) return null

    return (
      <PreviewPrimitive
        role="button"
        aria-disabled={context.disabled || context.readOnly}
        data-empty={!context.value ? "" : undefined}
        data-disabled={context.disabled ? "" : undefined}
        data-readonly={context.readOnly ? "" : undefined}
        data-slot="editable-preview"
        tabIndex={context.disabled || context.readOnly ? undefined : 0}
        {...previewProps}
        ref={forwardedRef}
        onClick={composeEventHandlers(
          previewProps.onClick,
          context.triggerMode === "click" ? onTrigger : undefined
        )}
        onDoubleClick={composeEventHandlers(
          previewProps.onDoubleClick,
          context.triggerMode === "dblclick" ? onTrigger : undefined
        )}
        onFocus={composeEventHandlers(
          previewProps.onFocus,
          context.triggerMode === "focus" ? onTrigger : undefined
        )}
        className={cn(
          "focus-visible:outline-hidden cursor-text truncate rounded-sm border border-transparent py-1 text-base focus-visible:ring-1 focus-visible:ring-ring data-[disabled]:cursor-not-allowed data-[readonly]:cursor-default data-[empty]:text-muted-foreground data-[disabled]:opacity-50 md:text-sm",
          className
        )}
      >
        {context.value || context.placeholder}
      </PreviewPrimitive>
    )
  }
)
EditablePreview.displayName = PREVIEW_NAME

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect

type InputElement = React.ComponentRef<typeof EditableInput>

interface EditableInputProps extends React.ComponentPropsWithoutRef<"input"> {
  asChild?: boolean
  maxLength?: number
}

const EditableInput = React.forwardRef<HTMLInputElement, EditableInputProps>(
  (props, forwardedRef) => {
    const {
      asChild,
      className,
      disabled,
      readOnly,
      required,
      maxLength,
      ...inputProps
    } = props
    const context = useEditableContext(INPUT_NAME)
    const inputRef = React.useRef<InputElement>(null)
    const composedRef = useComposedRefs(forwardedRef, inputRef)

    const isDisabled = disabled || context.disabled
    const isReadOnly = readOnly || context.readOnly
    const isRequired = required || context.required

    const onAutosize = React.useCallback(
      (target: HTMLInputElement | HTMLTextAreaElement) => {
        if (!context.autosize) return

        if (target instanceof HTMLTextAreaElement) {
          target.style.height = "0"
          target.style.height = `${target.scrollHeight}px`
        } else {
          target.style.width = "0"
          target.style.width = `${target.scrollWidth + 4}px`
        }
      },
      [context.autosize]
    )
    const onBlur = React.useCallback(
      (event: React.FocusEvent<InputElement>) => {
        if (isReadOnly) return
        const relatedTarget = event.relatedTarget

        const isAction =
          relatedTarget instanceof HTMLElement &&
          relatedTarget.closest(`[${DATA_ACTION_ATTR}=""]`)

        if (!isAction) {
          context.onSubmit(context.value)
        }
      },
      [context, isReadOnly]
    )

    const onChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (isReadOnly) return
        context.onValueChange(event.target.value)
        onAutosize(event.target)
      },
      [context, isReadOnly, onAutosize]
    )

    const onKeyDown = React.useCallback(
      (event: React.KeyboardEvent<InputElement>) => {
        if (isReadOnly) return
        if (event.key === "Escape") {
          const nativeEvent = event.nativeEvent
          if (context.onEscapeKeyDown) {
            context.onEscapeKeyDown(nativeEvent)
            if (nativeEvent.defaultPrevented) return
          }
          context.onCancel()
        } else if (event.key === "Enter") {
          context.onSubmit(context.value)
        }
      },
      [context, isReadOnly]
    )

    useIsomorphicLayoutEffect(() => {
      if (!context.editing || isReadOnly || !inputRef.current) return

      const frameId = window.requestAnimationFrame(() => {
        if (!inputRef.current) return

        inputRef.current.focus()
        inputRef.current.select()
        onAutosize(inputRef.current)
      })

      return () => {
        window.cancelAnimationFrame(frameId)
      }
    }, [context.editing, isReadOnly, onAutosize])

    const InputPrimitive = asChild ? Slot : "input"

    if (!context.editing && !isReadOnly) return null

    return (
      <InputPrimitive
        aria-required={isRequired}
        aria-invalid={context.invalid}
        data-slot="editable-input"
        dir={context.dir}
        disabled={isDisabled}
        readOnly={isReadOnly}
        required={isRequired}
        {...inputProps}
        id={context.inputId}
        aria-labelledby={context.labelId}
        ref={composedRef}
        maxLength={maxLength}
        placeholder={context.placeholder}
        value={context.value}
        onBlur={composeEventHandlers(inputProps.onBlur, onBlur)}
        onChange={composeEventHandlers(inputProps.onChange, onChange)}
        onKeyDown={composeEventHandlers(inputProps.onKeyDown, onKeyDown)}
        className={cn(
          "shadow-xs focus-visible:outline-hidden flex rounded-sm border border-input bg-transparent py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          context.autosize ? "w-auto" : "w-full",
          className
        )}
      />
    )
  }
)
EditableInput.displayName = INPUT_NAME

interface EditableTriggerProps
  extends React.ComponentPropsWithoutRef<"button"> {
  asChild?: boolean
  forceMount?: boolean
}

const EditableTrigger = React.forwardRef<
  HTMLButtonElement,
  EditableTriggerProps
>((props, forwardedRef) => {
  const { asChild, forceMount = false, ...triggerProps } = props
  const context = useEditableContext(TRIGGER_NAME)

  const onTrigger = React.useCallback(() => {
    if (context.disabled || context.readOnly) return
    context.onEdit()
  }, [context])

  const TriggerPrimitive = asChild ? Slot : "button"

  if (!forceMount && (context.editing || context.readOnly)) return null

  return (
    <TriggerPrimitive
      type="button"
      aria-controls={context.id}
      aria-disabled={context.disabled || context.readOnly}
      data-disabled={context.disabled ? "" : undefined}
      data-readonly={context.readOnly ? "" : undefined}
      data-slot="editable-trigger"
      {...triggerProps}
      ref={forwardedRef}
      onClick={context.triggerMode === "click" ? onTrigger : undefined}
      onDoubleClick={context.triggerMode === "dblclick" ? onTrigger : undefined}
    />
  )
})
EditableTrigger.displayName = TRIGGER_NAME

interface EditableToolbarProps extends React.ComponentPropsWithoutRef<"div"> {
  asChild?: boolean
  orientation?: "horizontal" | "vertical"
}

const EditableToolbar = React.forwardRef<HTMLDivElement, EditableToolbarProps>(
  (props, forwardedRef) => {
    const {
      asChild,
      className,
      orientation = "horizontal",
      ...toolbarProps
    } = props
    const context = useEditableContext(TOOLBAR_NAME)

    const ToolbarPrimitive = asChild ? Slot : "div"

    return (
      <ToolbarPrimitive
        role="toolbar"
        aria-controls={context.id}
        aria-orientation={orientation}
        data-slot="editable-toolbar"
        dir={context.dir}
        {...toolbarProps}
        ref={forwardedRef}
        className={cn(
          "flex items-center gap-2",
          orientation === "vertical" && "flex-col",
          className
        )}
      />
    )
  }
)
EditableToolbar.displayName = TOOLBAR_NAME

interface EditableCancelProps extends React.ComponentPropsWithoutRef<"button"> {
  asChild?: boolean
}

const EditableCancel = React.forwardRef<HTMLButtonElement, EditableCancelProps>(
  (props, forwardedRef) => {
    const { asChild, ...cancelProps } = props
    const context = useEditableContext(CANCEL_NAME)

    const CancelPrimitive = asChild ? Slot : "button"

    if (!context.editing && !context.readOnly) return null

    return (
      <CancelPrimitive
        type="button"
        aria-controls={context.id}
        data-slot="editable-cancel"
        {...{ [DATA_ACTION_ATTR]: "" }}
        {...cancelProps}
        onClick={composeEventHandlers(cancelProps.onClick, () => {
          context.onCancel()
        })}
        ref={forwardedRef}
      />
    )
  }
)
EditableCancel.displayName = CANCEL_NAME

interface EditableSubmitProps extends React.ComponentPropsWithoutRef<"button"> {
  asChild?: boolean
}

const EditableSubmit = React.forwardRef<HTMLButtonElement, EditableSubmitProps>(
  (props, forwardedRef) => {
    const { asChild, ...submitProps } = props
    const context = useEditableContext(SUBMIT_NAME)

    const SubmitPrimitive = asChild ? Slot : "button"

    if (!context.editing && !context.readOnly) return null

    return (
      <SubmitPrimitive
        type="button"
        aria-controls={context.id}
        data-slot="editable-submit"
        {...{ [DATA_ACTION_ATTR]: "" }}
        {...submitProps}
        ref={forwardedRef}
        onClick={composeEventHandlers(submitProps.onClick, () => {
          context.onSubmit(context.value)
        })}
      />
    )
  }
)
EditableSubmit.displayName = SUBMIT_NAME

type InputValue = string[] | string

interface VisuallyHiddenInputProps<T = InputValue>
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "checked" | "onReset"
  > {
  value?: T
  checked?: boolean
  control: HTMLElement | null
  bubbles?: boolean
}

function VisuallyHiddenInput<T = InputValue>(
  props: VisuallyHiddenInputProps<T>
) {
  const {
    control,
    value,
    checked,
    bubbles = true,
    type = "hidden",
    style,
    ...inputProps
  } = props

  const isCheckInput = React.useMemo(
    () => type === "checkbox" || type === "radio" || type === "switch",
    [type]
  )
  const inputRef = React.useRef<HTMLInputElement>(null)

  const prevValueRef = React.useRef<{
    value: T | boolean | undefined
    previous: T | boolean | undefined
  }>({
    value: isCheckInput ? checked : value,
    previous: isCheckInput ? checked : value,
  })

  const prevValue = React.useMemo(() => {
    const currentValue = isCheckInput ? checked : value
    if (prevValueRef.current.value !== currentValue) {
      prevValueRef.current.previous = prevValueRef.current.value
      prevValueRef.current.value = currentValue
    }
    return prevValueRef.current.previous
  }, [isCheckInput, value, checked])

  const [controlSize, setControlSize] = React.useState<{
    width?: number
    height?: number
  }>({})

  React.useLayoutEffect(() => {
    if (!control) {
      setControlSize({})
      return
    }

    setControlSize({
      width: control.offsetWidth,
      height: control.offsetHeight,
    })

    if (typeof window === "undefined") return

    const resizeObserver = new ResizeObserver((entries) => {
      if (!Array.isArray(entries) || !entries.length) return

      const entry = entries[0]
      if (!entry) return

      let width: number
      let height: number

      if ("borderBoxSize" in entry) {
        const borderSizeEntry = entry.borderBoxSize
        const borderSize = Array.isArray(borderSizeEntry)
          ? borderSizeEntry[0]
          : borderSizeEntry
        width = borderSize.inlineSize
        height = borderSize.blockSize
      } else {
        width = control.offsetWidth
        height = control.offsetHeight
      }

      setControlSize({ width, height })
    })

    resizeObserver.observe(control, { box: "border-box" })
    return () => {
      resizeObserver.disconnect()
    }
  }, [control])

  React.useEffect(() => {
    const input = inputRef.current
    if (!input) return

    const inputProto = window.HTMLInputElement.prototype
    const propertyKey = isCheckInput ? "checked" : "value"
    const eventType = isCheckInput ? "click" : "input"
    const currentValue = isCheckInput ? checked : value

    const serializedCurrentValue = isCheckInput
      ? checked
      : typeof value === "object" && value !== null
      ? JSON.stringify(value)
      : value

    const descriptor = Object.getOwnPropertyDescriptor(inputProto, propertyKey)

    const setter = descriptor?.set

    if (prevValue !== currentValue && setter) {
      const event = new Event(eventType, { bubbles })
      setter.call(input, serializedCurrentValue)
      input.dispatchEvent(event)
    }
  }, [prevValue, value, checked, bubbles, isCheckInput])

  const composedStyle = React.useMemo<React.CSSProperties>(() => {
    return {
      ...style,
      ...(controlSize.width !== undefined && controlSize.height !== undefined
        ? controlSize
        : {}),
      border: 0,
      clip: "rect(0 0 0 0)",
      clipPath: "inset(50%)",
      height: "1px",
      margin: "-1px",
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      whiteSpace: "nowrap",
      width: "1px",
    }
  }, [style, controlSize])

  return (
    <input
      type={type}
      {...inputProps}
      ref={inputRef}
      aria-hidden={isCheckInput}
      tabIndex={-1}
      defaultChecked={isCheckInput ? checked : undefined}
      style={composedStyle}
    />
  )
}

const Editable = EditableRoot
const Root = EditableRoot
const Label = EditableLabel
const Area = EditableArea
const Preview = EditablePreview
const Input = EditableInput
const Trigger = EditableTrigger
const Toolbar = EditableToolbar
const Cancel = EditableCancel
const Submit = EditableSubmit

export {
  Editable,
  EditableLabel,
  EditableArea,
  EditablePreview,
  EditableInput,
  EditableToolbar,
  EditableCancel,
  EditableSubmit,
  EditableTrigger,
  //
  Root,
  Label,
  Area,
  Preview,
  Input,
  Toolbar,
  Cancel,
  Submit,
  Trigger,
}
