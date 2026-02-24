@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

@react.component
let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) => {
  <kbd
    ?id
    ?style
    ?onClick
    ?onKeyDown
    ?children
    dataSlot="kbd"
    className={`bg-muted text-muted-foreground in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=tooltip-content]:bg-background/10 pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm px-1 font-sans text-xs font-medium select-none [&_svg:not([class*='size-'])]:size-3 ${className}`}
  />
}

module Group = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) =>
    <kbd
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?children
      dataSlot="kbd-group"
      className={`inline-flex items-center gap-1 ${className}`}
    />
}
