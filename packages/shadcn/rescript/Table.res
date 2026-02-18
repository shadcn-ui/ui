@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

@@directive("'use client'")

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
  let containerProps: BaseUi.Types.props<string, bool> = {
    ?id,
    ?style,
    ?onClick,
    ?onKeyDown,
    ?onKeyDownCapture,
    className: "",
    children: React.null,
    dataSlot: "table-container",
  }
  let tableProps: BaseUi.Types.props<string, bool> = {
    ?id,
    ?style,
    ?onClick,
    ?onKeyDown,
    ?onKeyDownCapture,
    ?children,
    className,
    dataSlot: "table",
  }
  <div {...containerProps} className="relative w-full overflow-x-auto">
    <table {...tableProps} className={`w-full caption-bottom text-sm ${className}`} />
  </div>
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
      dataSlot: "table-header",
    }
    <thead {...props} className={`[&_tr]:border-b ${className}`} />
  }
}

module Body = {
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
      dataSlot: "table-body",
    }
    <tbody {...props} className={`[&_tr:last-child]:border-0 ${className}`} />
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
      dataSlot: "table-footer",
    }
    <tfoot
      {...props}
      className={`bg-muted/50 border-t font-medium [&>tr]:last:border-b-0 ${className}`}
    />
  }
}

module Row = {
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
      dataSlot: "table-row",
    }
    <tr
      {...props}
      className={`hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors ${className}`}
    />
  }
}

module Head = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~colSpan=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
  ) => {
    let props: BaseUi.Types.props<string, bool> = {
      ?id,
      ?children,
      ?style,
      ?colSpan,
      ?onClick,
      ?onKeyDown,
      ?onKeyDownCapture,
      className,
      dataSlot: "table-head",
    }
    <th
      {...props}
      className={`text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 ${className}`}
    />
  }
}

module Cell = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~id=?,
    ~style=?,
    ~colSpan=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~onKeyDownCapture=?,
  ) => {
    let props: BaseUi.Types.props<string, bool> = {
      ?id,
      ?children,
      ?style,
      ?colSpan,
      ?onClick,
      ?onKeyDown,
      ?onKeyDownCapture,
      className,
      dataSlot: "table-cell",
    }
    <td
      {...props}
      className={`p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 ${className}`}
    />
  }
}

module Caption = {
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
      dataSlot: "table-caption",
    }
    <caption {...props} className={`text-muted-foreground mt-4 text-sm ${className}`} />
  }
}
