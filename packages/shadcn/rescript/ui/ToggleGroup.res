@@directive("'use client'")

module Variant = Toggle.Variant
module Size = Toggle.Size

module Orientation = {
  @unboxed
  type t =
    | @as("horizontal") Horizontal
    | @as("vertical") Vertical
}

type context = {
  variant?: Variant.t,
  size?: Size.t,
  spacing?: float,
  orientation?: Orientation.t,
}

let toggleGroupContext = React.createContext({
  variant: Variant.Default,
  size: Size.Default,
  spacing: 0.0,
  orientation: Orientation.Horizontal,
})

module ContextProvider = {
  let make = React.Context.provider(toggleGroupContext)
}

@react.component
let make = (
  ~className="",
  ~variant: option<Variant.t>=?,
  ~size: option<Size.t>=?,
  ~spacing=0.,
  ~orientation=Orientation.Horizontal,
  ~children,
  ~id=?,
  ~name=?,
  ~value=?,
  ~defaultValue=?,
  ~onValueChange=?,
  ~disabled=?,
  ~required=?,
  ~readOnly=?,
  ~multiple=?,
  ~onClick=?,
  ~onKeyDown=?,
  ~tabIndex=?,
  ~ariaLabel=?,
) => {
  let dataVariant = variant->Option.map(variant => (variant :> string))
  let dataSize = size->Option.map(size => (size :> string))
  <BaseUi.ToggleGroup
    dataSlot="toggle-group"
    dataVariant=?dataVariant
    dataSize=?dataSize
    dataSpacing={spacing}
    dataOrientation={(orientation :> string)}
    style={ReactDOM.Style.unsafeAddStyle({}, {"--gap": spacing})}
    className={`group/toggle-group flex w-fit flex-row items-center gap-[--spacing(var(--gap))] rounded-lg data-vertical:flex-col data-vertical:items-stretch data-[size=sm]:rounded-[min(var(--radius-md),10px)] ${className}`}
    ?id
    ?name
    ?value
    ?defaultValue
    ?onValueChange
    ?disabled
    ?required
    ?readOnly
    ?multiple
    ?onClick
    ?onKeyDown
    ?tabIndex
    ?ariaLabel
  >
    <ContextProvider value={{?variant, ?size, spacing, orientation}}> {children} </ContextProvider>
  </BaseUi.ToggleGroup>
}

module Item = {
  @react.component
  let make = (
    ~className="",
    ~variant=Variant.Default,
    ~size=Size.Default,
    ~children=?,
    ~id=?,
    ~name=?,
    ~value=?,
    ~defaultValue=?,
    ~onValueChange=?,
    ~checked=?,
    ~defaultChecked=?,
    ~onCheckedChange=?,
    ~disabled=?,
    ~required=?,
    ~readOnly=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~tabIndex=?,
    ~ariaLabel=?,
    ~type_=?,
    ~render=?,
  ) => {
    let context = React.useContext(toggleGroupContext)
    let resolvedVariant = context.variant->Option.getOr(variant)
    let resolvedSize = context.size->Option.getOr(size)

    <BaseUi.Toggle
      dataSlot="toggle-group-item"
      dataVariant={(resolvedVariant :> string)}
      dataSize={(resolvedSize :> string)}
      dataSpacing=?context.spacing
      className={`shrink-0 group-data-[spacing=0]/toggle-group:rounded-none group-data-[spacing=0]/toggle-group:px-2 focus:z-10 focus-visible:z-10 group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-l-lg group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-lg group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-r-lg group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-lg group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:border-l-0 group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0 group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-l group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t ${Toggle.toggleVariants(
          ~variant=resolvedVariant,
          ~size=resolvedSize,
        )} ${className}`}
      ?id
      ?name
      ?value
      ?defaultValue
      ?onValueChange
      ?checked
      ?defaultChecked
      ?onCheckedChange
      ?disabled
      ?required
      ?readOnly
      ?onClick
      ?onKeyDown
      ?tabIndex
      ?ariaLabel
      ?type_
      ?render
      ?children
    />
  }
}
