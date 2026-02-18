@@directive("'use client'")

open BaseUi.Types

@react.component
let make = (
  ~className="",
  ~children=React.null,
  ~id=?,
  ~name=?,
  ~checked=?,
  ~defaultChecked=?,
  ~onCheckedChange=?,
  ~disabled=?,
  ~required=?,
  ~readOnly=?,
  ~onClick=?,
  ~onKeyDown=?,
  ~onKeyDownCapture=?,
  ~tabIndex=?,
  ~ariaLabel=?,
  ~style=?,
  ~render=?,
) =>
  <BaseUi.Checkbox.Root
    ?id
    ?name
    ?checked
    ?defaultChecked
    ?onCheckedChange
    ?disabled
    ?required
    ?readOnly
    ?onClick
    ?onKeyDown
    ?onKeyDownCapture
    ?tabIndex
    ?ariaLabel
    ?style
    ?render
    dataSlot="checkbox"
    className={`border-input dark:bg-input/30 data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary data-checked:border-primary aria-invalid:aria-checked:border-primary aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 ${className}`}
  >
    <BaseUi.Checkbox.Indicator
      dataSlot="checkbox-indicator"
      className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
    >
      <Icons.Check />
    </BaseUi.Checkbox.Indicator>
    {children}
  </BaseUi.Checkbox.Root>
