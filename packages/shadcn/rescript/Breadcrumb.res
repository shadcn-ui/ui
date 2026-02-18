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
  let props: BaseUi.Types.props<string, bool> = {
    ?id,
    ?style,
    ?children,
    ?onClick,
    ?onKeyDown,
    ?onKeyDownCapture,
    className,
    dataSlot: "breadcrumb",
  }
  <nav {...props} ariaLabel="breadcrumb" className ?children />
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
  ) => {
    let props: BaseUi.Types.props<string, bool> = {
      ?id,
      ?style,
      ?children,
      ?onClick,
      ?onKeyDown,
      ?onKeyDownCapture,
      className,
      dataSlot: "breadcrumb-list",
    }
    <ol
      {...props}
      className={`text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm wrap-break-word ${className}`}
      ?children
    />
  }
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
  ) => {
    let props: BaseUi.Types.props<string, bool> = {
      ?id,
      ?style,
      ?children,
      ?onClick,
      ?onKeyDown,
      ?onKeyDownCapture,
      className,
      dataSlot: "breadcrumb-item",
    }
    <li {...props} className={`inline-flex items-center gap-1 ${className}`} ?children />
  }
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
    let props: BaseUi.Types.props<string, bool> = {
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
    }
    BaseUi.Render.use({defaultTagName: "a", ?render, props})
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
  ) => {
    let props: BaseUi.Types.props<string, bool> = {
      ?id,
      ?style,
      ?children,
      ?onClick,
      ?onKeyDown,
      ?onKeyDownCapture,
      className,
      dataSlot: "breadcrumb-page",
    }
    <span
      {...props}
      ariaCurrent="page"
      ariaDisabled=true
      role="link"
      className={`text-foreground font-normal ${className}`}
      ?children
    />
  }
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
    let props: BaseUi.Types.props<string, bool> = {
      ?id,
      ?style,
      ?children,
      ?onClick,
      ?onKeyDown,
      ?onKeyDownCapture,
      className,
      dataSlot: "breadcrumb-separator",
    }

    <li {...props} ariaHidden=true role="presentation" className={`[&>svg]:size-3.5 ${className}`}>
      {content}
    </li>
  }
}

module Ellipsis = {
  @react.component
  let make = (~className="", ~id=?, ~style=?, ~onClick=?, ~onKeyDown=?, ~onKeyDownCapture=?) => {
    let props: BaseUi.Types.props<string, bool> = {
      ?id,
      ?style,
      ?onClick,
      ?onKeyDown,
      ?onKeyDownCapture,
      className,
      dataSlot: "breadcrumb-ellipsis",
    }
    <span
      {...props}
      ariaHidden=true
      role="presentation"
      className={`flex size-5 items-center justify-center [&>svg]:size-4 ${className}`}
    >
      <Icons.MoreHorizontal />
      <span className="sr-only"> {"More"->React.string} </span>
    </span>
  }
}
