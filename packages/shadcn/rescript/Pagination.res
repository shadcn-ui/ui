open BaseUi.Types

@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

@react.component
let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) => {
  <nav
    dataSlot="pagination"
    ?id
    ?style
    ?onClick
    ?onKeyDown
    role="navigation"
    ariaLabel="pagination"
    className={`mx-auto flex w-full justify-center ${className}`}
    ?children
  />
}

module Content = {
  @react.component
  let make = (~className="", ~children=?, ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?) => {
    <ul
      dataSlot="pagination-content"
      ?id
      ?style
      ?onClick
      ?onKeyDown
      className={`flex items-center gap-0.5 ${className}`}
      ?children
    />
  }
}

module Item = {
  @react.component
  let make = (~className=?, ~children=?, ~id=?, ~style=?) =>
    <li dataSlot="pagination-item" ?id ?style ?className ?children />
}

module Link = {
  @react.component
  let make = (
    ~className="",
    ~isActive=false,
    ~size=BaseUi.Types.Size.Icon,
    ~children=?,
    ~href=?,
    ~target=?,
    ~id=?,
    ~style=?,
    ~ariaLabel=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~dataActive=isActive,
  ) =>
    <Button
      variant={isActive ? Outline : Ghost}
      size
      className
      nativeButton={false}
      render={<a
        ?id
        ?style
        ?href
        ?target
        ?ariaLabel
        ?onClick
        ?onKeyDown
        ariaCurrent=?{isActive ? Some(#page) : None}
        dataSlot="pagination-link"
        dataActive
      />}
      ?children
    />
}

module Previous = {
  @react.component
  let make = (
    ~className="",
    ~text="Previous",
    ~href=?,
    ~target=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~dataActive=?,
  ) => {
    <Link
      ariaLabel="Go to previous page"
      size={Size.Default}
      className={`pl-1.5! ${className}`}
      ?href
      ?target
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?dataActive
    >
      <Icons.ChevronLeft dataIcon="inline-start" className="cn-rtl-flip" />
      <span className="hidden sm:block"> {text->React.string} </span>
    </Link>
  }
}

module Next = {
  @react.component
  let make = (
    ~className="",
    ~text="Next",
    ~href=?,
    ~target=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~dataActive=?,
  ) => {
    <Link
      ariaLabel="Go to next page"
      size={Size.Default}
      className={`pr-1.5! ${className}`}
      ?href
      ?target
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?dataActive
    >
      <span className="hidden sm:block"> {text->React.string} </span>
      <Icons.ChevronRight dataIcon="inline-end" className="cn-rtl-flip" />
    </Link>
  }
}

module Ellipsis = {
  @react.component
  let make = (~className="", ~id=?, ~style=?) => {
    <span
      dataSlot="pagination-ellipsis"
      ?id
      ?style
      ariaHidden={true}
      className={`flex size-8 items-center justify-center [&_svg:not([class*='size-'])]:size-4 ${className}`}
    >
      <Icons.MoreHorizontal />
      <span className="sr-only"> {"More pages"->React.string} </span>
    </span>
  }
}
