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
  ~dataSize=Size.Default,
) => {
  let size = dataSize
  let props: BaseUi.Types.props<string, bool> = {
    ?id,
    ?children,
    ?style,
    ?onClick,
    ?onKeyDown,
    ?onKeyDownCapture,
    className,
    dataSlot: "card",
    dataSize: size,
  }
  <div
    {...props}
    className={`ring-foreground/10 bg-card text-card-foreground group/card flex flex-col gap-4 overflow-hidden rounded-xl py-4 text-sm ring-1 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl ${className}`}
  />
}

module Header = {
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
      ?children,
      ?style,
      ?onClick,
      ?onKeyDown,
      ?onKeyDownCapture,
      className,
      dataSlot: "card-header",
    }
    <div
      {...props}
      className={`group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-4 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3 ${className}`}
    />
  }
}

module Title = {
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
      ?children,
      ?style,
      ?onClick,
      ?onKeyDown,
      ?onKeyDownCapture,
      className,
      dataSlot: "card-title",
    }
    <div
      {...props}
      className={`text-base leading-snug font-medium group-data-[size=sm]/card:text-sm ${className}`}
    />
  }
}

module Description = {
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
      ?children,
      ?style,
      ?onClick,
      ?onKeyDown,
      ?onKeyDownCapture,
      className,
      dataSlot: "card-description",
    }
    <div {...props} className={`text-muted-foreground text-sm ${className}`} />
  }
}

module Action = {
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
      ?children,
      ?style,
      ?onClick,
      ?onKeyDown,
      ?onKeyDownCapture,
      className,
      dataSlot: "card-action",
    }
    <div
      {...props}
      className={`col-start-2 row-span-2 row-start-1 self-start justify-self-end ${className}`}
    />
  }
}

module Content = {
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
      ?children,
      ?style,
      ?onClick,
      ?onKeyDown,
      ?onKeyDownCapture,
      className,
      dataSlot: "card-content",
    }
    <div {...props} className={`px-4 group-data-[size=sm]/card:px-3 ${className}`} />
  }
}

module Footer = {
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
      ?children,
      ?style,
      ?onClick,
      ?onKeyDown,
      ?onKeyDownCapture,
      className,
      dataSlot: "card-footer",
    }
    <div
      {...props}
      className={`bg-muted/50 flex items-center rounded-b-xl border-t p-4 group-data-[size=sm]/card:p-3 ${className}`}
    />
  }
}
