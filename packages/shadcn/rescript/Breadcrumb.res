@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

open BaseUi.Types

@react.component
let make = (
  ~className="",
  ~children=?,
  ~id=?,
  ~style=?,
  ~onClick=?,
  ~onKeyDown=?,
  ~onKeyDownCapture=?,
) => {
  <nav
    ?id
    ?style
    ?children
    ?onClick
    ?onKeyDown
    ?onKeyDownCapture
    ariaLabel="breadcrumb"
    dataSlot="breadcrumb"
    className
  />
}

module List = {
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
    <ol
      ?id
      ?style
      ?children
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      dataSlot="breadcrumb-list"
      className={`text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm wrap-break-word ${className}`}
    />
}

module Item = {
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
    <li
      ?id
      ?style
      ?children
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      dataSlot="breadcrumb-item"
      className={`inline-flex items-center gap-1 ${className}`}
    />
}

module Link = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~href=?,
    ~target=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
    ~render=?,
  ) => {
    BaseUi.Render.use({
      defaultTagName: "a",
      ?render,
      props: {
        ?id,
        ?style,
        ?children,
        ?onClick,
        ?onKeyDown,
        ?onKeyDownCapture,
        ?href,
        ?target,
        render: React.null,
        dataSlot: "breadcrumb-link",
        className: `hover:text-foreground transition-colors ${className}`,
      },
    })
  }
}

module Page = {
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
    <span
      ?id
      ?style
      ?children
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      ariaCurrent="page"
      ariaDisabled=true
      role="link"
      dataSlot="breadcrumb-page"
      className={`text-foreground font-normal ${className}`}
    />
}

module Separator = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
  ) => {
    let content = switch children {
    | Some(content) => content
    | None => <Icons.ChevronRight className="cn-rtl-flip" />
    }
    <li
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      ariaHidden=true
      role="presentation"
      dataSlot="breadcrumb-separator"
      className={`[&>svg]:size-3.5 ${className}`}
    >
      {content}
    </li>
  }
}

module Ellipsis = {
  @react.component
  let make = (~className="", ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?, ~onKeyDownCapture=?) =>
    <span
      ?id
      ?style
      ?onClick
      ?onKeyDown
      ?onKeyDownCapture
      ariaHidden=true
      role="presentation"
      dataSlot="breadcrumb-ellipsis"
      className={`flex size-5 items-center justify-center [&>svg]:size-4 ${className}`}
    >
      <Icons.MoreHorizontal />
      <span className="sr-only"> {"More"->React.string} </span>
    </span>
}
