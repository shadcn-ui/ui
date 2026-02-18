@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

@@directive("'use client'")

open BaseUi.Types

module InputOtpPrimitive = {
  @module("input-otp")
  external make: React.component<props<'value, 'checked>> = "OTPInput"

  type slot = {
    isActive: bool,
    char: Nullable.t<string>,
    hasFakeCaret: bool,
  }

  type renderProps = {
    slots: array<slot>,
    isFocused: bool,
    isHovering: bool,
  }

  @module("input-otp") @val
  external context: React.Context.t<renderProps> = "OTPInputContext"
}

@react.component
let make = (
  ~className="",
  ~containerClassName="",
  ~children=?,
  ~id=?,
  ~name=?,
  ~value=?,
  ~defaultValue=?,
  ~maxLength=?,
  ~disabled=?,
  ~required=?,
  ~readOnly=?,
  ~onValueChange=?,
  ~onClick=?,
  ~onKeyDown=?,
  ~onKeyDownCapture=?,
  ~tabIndex=?,
  ~ariaLabel=?,
  ~style=?,
) => {
  <InputOtpPrimitive
    ?id
    ?name
    ?value
    ?defaultValue
    ?maxLength
    ?disabled
    ?required
    ?readOnly
    ?onValueChange
    ?onClick
    ?onKeyDown
    ?onKeyDownCapture
    ?tabIndex
    ?ariaLabel
    ?style
    ?children
    dataSlot="input-otp"
    containerClassName={`cn-input-otp flex items-center has-disabled:opacity-50 ${containerClassName}`}
    spellCheck={false}
    className={`disabled:cursor-not-allowed ${className}`}
  />
}

module Group = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
  ) =>
    <div
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      ?children
      dataSlot="input-otp-group"
      className={`has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40 has-aria-invalid:border-destructive flex items-center rounded-lg has-aria-invalid:ring-3 ${className}`}
    />
}

module Slot = {
  @react.component
  let make = (
    ~className="",
    ~children=React.null,
    ~id=?,
    ~index=0,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
  ) => {
    let inputOtpContext = React.useContext(InputOtpPrimitive.context)
    let slot = inputOtpContext.slots->Belt.Array.get(index)
    let isActive = slot->Belt.Option.mapWithDefault(false, slot => slot.isActive)
    let hasFakeCaret = slot->Belt.Option.mapWithDefault(false, slot => slot.hasFakeCaret)
    let char =
      slot
      ->Belt.Option.flatMap(slot => slot.char->Nullable.toOption)
      ->Belt.Option.mapWithDefault(React.null, value => value->React.string)
    <div
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      dataSlot="input-otp-slot"
      dataActive={isActive}
      index
      className={`dark:bg-input/30 border-input data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive relative flex size-8 items-center justify-center border-y border-r text-sm transition-all outline-none first:rounded-l-lg first:border-l last:rounded-r-lg data-[active=true]:z-10 data-[active=true]:ring-3 ${className}`}
    >
      {char}
      {hasFakeCaret
        ? <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
          </div>
        : React.null}
      {children}
    </div>
  }
}

module Separator = {
  @react.component
  let make = (
    ~className="",
    ~children=React.null,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
  ) =>
    <div
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      role="separator"
      dataSlot="input-otp-separator"
      className={`flex items-center [&_svg:not([class*='size-'])]:size-4 ${className}`}
    >
      <Icons.Minus />
      {children}
    </div>
}
