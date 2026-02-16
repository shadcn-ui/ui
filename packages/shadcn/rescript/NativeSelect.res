open BaseUi.Types

external toDomProps: 'a => JsxDOM.domProps = "%identity"

@react.componentWithProps
let make = (props: propsWithChildren<'value, 'checked>) => {
  let size = props.dataSize->Belt.Option.getWithDefault(Size.Default)
  let wrapperProps = {
    ...props,
    className: "",
    children: React.null,
    dataSlot: "native-select-wrapper",
    dataSize: size,
  }
  let selectProps = {
    ...props,
    dataSlot: "native-select",
    dataSize: size,
  }
  <div
    {...toDomProps(wrapperProps)}
    className={`group/native-select relative w-fit has-[select:disabled]:opacity-50 ${props.className->Belt.Option.getWithDefault("")}`}
  >
    <select
      {...toDomProps(selectProps)}
      className="border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 dark:hover:bg-input/50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 h-8 w-full min-w-0 appearance-none rounded-lg border bg-transparent py-1 pr-8 pl-2.5 text-sm transition-colors outline-none select-none focus-visible:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed aria-invalid:ring-3 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] data-[size=sm]:py-0.5"
    />
    <Icons.chevronDown
      className="text-muted-foreground pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 select-none"
      ariaHidden={true}
      dataSlot="native-select-icon"
    />
  </div>
}

module Option = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let props = {...props, dataSlot: "native-select-option"}
    <option {...toDomProps(props)} />
  }
}

module OptGroup = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) => {
    let props = {...props, dataSlot: "native-select-optgroup"}
    <optgroup
      {...toDomProps(props)}
      className={`${props.className->Belt.Option.getWithDefault("")}`}
    />
  }
}
