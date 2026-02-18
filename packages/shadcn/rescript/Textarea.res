@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

open BaseUi.Types

@react.component
let make = (
  ~className="",
  ~children=?,
  ~id=?,
  ~name=?,
  ~value=?,
  ~defaultValue=?,
  ~disabled=?,
  ~required=?,
  ~readOnly=?,
  ~placeholder=?,
  ~onClick=?,
  ~onKeyDown=?,
  ~onKeyDownCapture=?,
  ~ariaLabel=?,
  ~style=?,
  ~maxLength=?,
  ~tabIndex=?,
  ~spellCheck=?,
) => {
  let props: BaseUi.Types.props<string, bool> = {
    ?id,
    ?name,
    ?value,
    ?defaultValue,
    ?disabled,
    ?required,
    ?readOnly,
    ?placeholder,
    ?onClick,
    ?onKeyDown,
    ?onKeyDownCapture,
    ?ariaLabel,
    ?style,
    ?maxLength,
    ?tabIndex,
    ?spellCheck,
    className,
    ?children,
    dataSlot: "textarea",
  }
  <textarea
    {...props}
    className={`border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-input/50 dark:disabled:bg-input/80 placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full rounded-lg border bg-transparent px-2.5 py-2 text-base transition-colors outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 md:text-sm ${className}`}
  />
}
