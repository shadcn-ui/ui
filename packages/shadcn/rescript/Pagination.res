open BaseUi.Types

external toDomProps: 'a => JsxDOM.domProps = "%identity"

@react.componentWithProps
let make = (props: propsWithChildren<'value, 'checked>) => {
  let props = {...props, dataSlot: "pagination"}
  <nav
    {...toDomProps(props)}
    role="navigation"
    ariaLabel="pagination"
    className={`mx-auto flex w-full justify-center ${props.className->Option.getOr("")}`}
  />
}

module Content = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let props = {...props, dataSlot: "pagination-content"}
    <ul
      {...toDomProps(props)}
      className={`flex items-center gap-0.5 ${props.className->Option.getOr("")}`}
    />
  }
}

module Item = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let props = {...props, dataSlot: "pagination-item"}
    <li {...toDomProps(props)} />
  }
}

module Link = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let isActive = props.dataActive->Option.getOr(false)
    let size = props.dataSize->Option.getOr(Size.Icon)
    let variant =
      if isActive {Variant.Outline} else {Variant.Ghost}
    let anchorProps = {
      ...props,
      className: "",
      children: React.null,
      dataSlot: "pagination-link",
      dataActive: isActive,
      ariaCurrent: if isActive {"page"} else {""},
    }
    <Button
      dataVariant={variant}
      dataSize={size}
      className={`${props.className->Option.getOr("")}`}
      nativeButton={false}
      disabled={props.disabled->Option.getOr(false)}
      render={<a {...toDomProps(anchorProps)} />}
    >
      {props.children}
    </Button>
  }
}

module Previous = {
  @react.componentWithProps
let make = (props: propsWithChildren<'value, 'checked>) => {
    let text = props.label->Option.getOr("Previous")
    <Link
      {...props}
      ariaLabel="Go to previous page"
      dataSize=Size.Default
      className={`pl-1.5! ${props.className->Option.getOr("")}`}
    >
      <Icons.chevronLeft dataIcon="inline-start" className="cn-rtl-flip" />
      <span className="hidden sm:block">{text->React.string}</span>
    </Link>
  }
}

module Next = {
  @react.componentWithProps
let make = (props: propsWithChildren<'value, 'checked>) => {
    let text = props.label->Option.getOr("Next")
    <Link
      {...props}
      ariaLabel="Go to next page"
      dataSize=Size.Default
      className={`pr-1.5! ${props.className->Option.getOr("")}`}
    >
      <span className="hidden sm:block">{text->React.string}</span>
      <Icons.chevronRight dataIcon="inline-end" className="cn-rtl-flip" />
    </Link>
  }
}

module Ellipsis = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let props = {...props, dataSlot: "pagination-ellipsis"}
    <span
      {...toDomProps(props)}
      ariaHidden={true}
      className={`flex size-8 items-center justify-center [&_svg:not([class*='size-'])]:size-4 ${props.className->Option.getOr("")}`}
    >
      <Icons.moreHorizontal />
      <span className="sr-only">{"More pages"->React.string}</span>
    </span>
  }
}
