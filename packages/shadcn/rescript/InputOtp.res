open BaseUi.Types

external toDomProps: 'a => JsxDOM.domProps = "%identity"

module InputOtpPrimitive = {
  @module("input-otp")
  external make: React.component<props<string, bool>> = "OTPInput"

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

  @module("input-otp")
  @val
  external context: React.Context.t<renderProps> = "OTPInputContext"
}

@react.componentWithProps
let make = (props: props<string, bool>) => {
  let containerClassName = props.containerClassName->Option.getOr("")
  <InputOtpPrimitive
    {...props}
    dataSlot="input-otp"
    containerClassName={`cn-input-otp flex items-center has-disabled:opacity-50 ${containerClassName}`}
    spellCheck={false}
    className={`disabled:cursor-not-allowed ${props.className->Option.getOr("")}`}
  />
}

module Group = {
  @react.componentWithProps
  let make = (props: props<string, bool>) => {
    let props = {...props, dataSlot: "input-otp-group"}
    <div
      {...toDomProps(props)}
      className={`has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40 has-aria-invalid:border-destructive flex items-center rounded-lg has-aria-invalid:ring-3 ${props.className->Option.getOr("")}`}
    />
  }
}

module Slot = {
  @react.componentWithProps
  let make = (props: props<string, bool>) => {
    let index = props.index->Option.getOr(0)
    let inputOtpContext = React.useContext(InputOtpPrimitive.context)
    let slot = inputOtpContext.slots->Belt.Array.get(index)
    let isActive = slot->Belt.Option.mapWithDefault(false, slot => slot.isActive)
    let hasFakeCaret = slot->Belt.Option.mapWithDefault(false, slot => slot.hasFakeCaret)
    let char =
      slot
      ->Belt.Option.flatMap(slot => slot.char->Nullable.toOption)
      ->Belt.Option.mapWithDefault(React.null, value => value->React.string)
    let props = {...props, dataSlot: "input-otp-slot", dataActive: isActive}
    <div
      {...toDomProps(props)}
      className={`dark:bg-input/30 border-input data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive relative flex size-8 items-center justify-center border-y border-r text-sm transition-all outline-none first:rounded-l-lg first:border-l last:rounded-r-lg data-[active=true]:z-10 data-[active=true]:ring-3 ${props.className->Option.getOr("")}`}
    >
      {char}
      {hasFakeCaret
        ? <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
          </div>
        : React.null}
    </div>
  }
}

module Separator = {
  @react.componentWithProps
  let make = (props: props<string, bool>) => {
    let props = {...props, dataSlot: "input-otp-separator"}
    <div
      {...toDomProps(props)}
      role="separator"
      className={`flex items-center [&_svg:not([class*='size-'])]:size-4 ${props.className->Option.getOr("")}`}
    >
      <Icons.minus />
    </div>
  }
}
