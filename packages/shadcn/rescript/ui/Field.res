@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

@@directive("'use client'")

open BaseUi.Types

@module("tailwind-merge")
external twMerge: string => string = "twMerge"

module DataOrientation = {
  @unboxed
  type t =
    | @as("horizontal") Horizontal
    | @as("vertical") Vertical
    | @as("responsive") Responsive
}

module Variant = {
  @unboxed
  type t =
    | @as("legend") Legend
    | @as("label") Label
}

let fieldOrientationClass = (~orientation: DataOrientation.t) =>
  switch orientation {
  | Horizontal => "flex-row items-center *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px"
  | Responsive => "flex-col *:w-full [&>.sr-only]:w-auto @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:*:data-[slot=field-label]:flex-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px"
  | Vertical => "flex-col *:w-full [&>.sr-only]:w-auto"
  }

let fieldVariants = (~orientation=DataOrientation.Vertical) => {
  let base = "data-[invalid=true]:text-destructive gap-2 group/field flex w-full"
  `${base} ${fieldOrientationClass(~orientation)}`
}

module Set = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
    <fieldset
      ?id
      ?children
      ?style
      ?onClick
      ?onKeyDown
      dataSlot="field-set"
      className={`flex flex-col gap-4 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3 ${className}`}
    />
}

module Legend = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~dataVariant=Variant.Legend,
  ) => {
    let variant = dataVariant
    <legend
      ?id
      ?children
      ?style
      ?onClick
      ?onKeyDown
      dataSlot="field-legend"
      dataVariant={(variant :> string)}
      className={`mb-1.5 font-medium data-[variant=label]:text-sm data-[variant=legend]:text-base ${className}`}
    />
  }
}

module Group = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
    <div
      ?id
      ?children
      ?style
      ?onClick
      ?onKeyDown
      dataSlot="field-group"
      className={twMerge(
        `group/field-group @container/field-group flex w-full flex-col gap-5 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4 ${className}`,
      )}
    />
}

@react.component
let make = (
  ~className="",
  ~children=?,
  ~id=?,
  ~style=?,
  ~onClick=?,
  ~onKeyDown=?,
  ~orientation=?,
  ~dataOrientation=?,
  ~disabled=?,
  ~dataDisabled=?,
  ~dataInvalid=?,
) => {
  let resolvedOrientation = switch dataOrientation {
  | Some(value) => value
  | None =>
    switch orientation {
    | Some(Orientation.Horizontal) => DataOrientation.Horizontal
    | Some(Orientation.Vertical) => DataOrientation.Vertical
    | None => DataOrientation.Vertical
    }
  }
  <div
    ?id
    ?children
    ?style
    ?onClick
    ?onKeyDown
    ?disabled
    ?dataDisabled
    ?dataInvalid
    role="group"
    dataSlot="field"
    dataOrientation={(resolvedOrientation :> string)}
    className={twMerge(`${fieldVariants(~orientation=resolvedOrientation)} ${className}`)}
  />
}

module Content = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
    <div
      ?id
      ?children
      ?style
      ?onClick
      ?onKeyDown
      dataSlot="field-content"
      className={`group/field-content flex flex-1 flex-col gap-0.5 leading-snug ${className}`}
    />
}

module Label = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~htmlFor=?, ~onClick=?, ~onKeyDown=?, ~style=?) =>
    <Label
      ?id
      ?htmlFor
      ?onClick
      ?onKeyDown
      ?style
      dataSlot="field-label"
      className={`has-data-checked:bg-primary/5 has-data-checked:border-primary/30 dark:has-data-checked:border-primary/20 dark:has-data-checked:bg-primary/10 group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50 has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border *:data-[slot=field]:p-2.5 has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col ${className}`}
      ?children
    />
}

module Title = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
    <div
      ?id
      ?children
      ?style
      ?onClick
      ?onKeyDown
      dataSlot="field-label"
      className={`flex w-fit items-center gap-2 text-sm leading-snug font-medium group-data-[disabled=true]/field:opacity-50 ${className}`}
    />
}

module Description = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
    <p
      ?id
      ?children
      ?style
      ?onClick
      ?onKeyDown
      dataSlot="field-description"
      className={`text-muted-foreground text-left text-sm leading-normal font-normal group-has-data-horizontal/field:text-balance [[data-variant=legend]+&]:-mt-1.5 last:mt-0 nth-last-2:-mt-1 [&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4 ${className}`}
    />
}

module Separator = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) => {
    let hasContent = children->Option.isSome
    <div
      ?id
      ?style
      ?onClick
      ?onKeyDown
      dataSlot="field-separator"
      dataContent={hasContent}
      className={`relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2 ${className}`}
    >
      <BaseUi.Separator
        orientation=Orientation.Horizontal
        className="absolute inset-0 top-1/2 bg-border shrink-0 data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch"
      />
      {switch children {
      | Some(value) =>
        <span
          className="text-muted-foreground bg-background relative mx-auto block w-fit px-2"
          dataSlot="field-separator-content"
        >
          {value}
        </span>
      | None => React.null
      }}
    </div>
  }
}

module Error = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
    <div
      ?id
      ?children
      ?style
      ?onClick
      ?onKeyDown
      role="alert"
      dataSlot="field-error"
      className={`text-destructive text-sm font-normal ${className}`}
    />
}
