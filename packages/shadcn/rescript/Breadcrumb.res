type props<'value, 'checked> = BaseUi.Types.props<'value, 'checked>
external toDomProps: props<'value, 'checked> => JsxDOM.domProps = "%identity"

@react.componentWithProps
let make = (props: props<'value, 'checked>) => {
  let props = {...props, dataSlot: "breadcrumb"}
  <nav
    {...toDomProps(props)}
    ariaLabel="breadcrumb"
    className={`${props.className->Option.getOr("")}`}
  >
    {props.children->Option.getOr(React.null)}
  </nav>
}

module List = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) => {
    let props = {...props, dataSlot: "breadcrumb-list"}
    <ol
      {...toDomProps(props)}
      className={`text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm wrap-break-word ${props.className->Option.getOr("")}`}
    >
      {props.children->Option.getOr(React.null)}
    </ol>
  }
}

module Item = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) => {
    let props = {...props, dataSlot: "breadcrumb-item"}
    <li
      {...toDomProps(props)}
      className={`inline-flex items-center gap-1 ${props.className->Option.getOr("")}`}
    >
      {props.children->Option.getOr(React.null)}
    </li>
  }
}

module Link = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) => {
    let props = {...props, dataSlot: "breadcrumb-link"}
    <a
      {...toDomProps(props)}
      className={`hover:text-foreground transition-colors ${props.className->Option.getOr("")}`}
    >
      {props.children->Option.getOr(React.null)}
    </a>
  }
}

module Page = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) => {
    let props = {...props, dataSlot: "breadcrumb-page"}
    <span
      {...toDomProps(props)}
      ariaCurrent=#page
      ariaDisabled=true
      role="link"
      className={`text-foreground font-normal ${props.className->Option.getOr("")}`}
    >
      {props.children->Option.getOr(React.null)}
    </span>
  }
}

module Separator = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) => {
    let props = {...props, dataSlot: "breadcrumb-separator"}
    let content =
      switch props.children {
      | Some(children) => children
      | None => <Icons.chevronRight className="cn-rtl-flip" />
      }

    <li
      {...toDomProps(props)}
      ariaHidden=true
      role="presentation"
      className={`[&>svg]:size-3.5 ${props.className->Option.getOr("")}`}
    >
      {content}
    </li>
  }
}

module Ellipsis = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) => {
    let props = {...props, dataSlot: "breadcrumb-ellipsis"}
    <span
      {...toDomProps(props)}
      ariaHidden=true
      role="presentation"
      className={`flex size-5 items-center justify-center [&>svg]:size-4 ${props.className->Option.getOr("")}`}
    >
      <Icons.moreHorizontal />
      <span className="sr-only">{"More"->React.string}</span>
    </span>
  }
}
