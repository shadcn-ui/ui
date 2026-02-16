open BaseUi.Types

external toDomProps: 'a => JsxDOM.domProps = "%identity"

module DayPickerPrimitive = {
  @module("react-day-picker")
  external make: React.component<propsWithOptionalChildren<string, bool>> = "DayPicker"
}

@react.componentWithProps
let make = (props: propsWithOptionalChildren<string, bool>) => {
  let wrapperProps: propsWithOptionalChildren<string, bool> = {
    className: "",
    children: React.null,
    dataSlot: "calendar",
  }
  <div {...toDomProps(wrapperProps)}>
    <DayPickerPrimitive
      {...props}
      className={`bg-background group/calendar p-2 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(7)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent rtl:**:[.rdp-button\\_next>svg]:rotate-180 rtl:**:[.rdp-button\\_previous>svg]:rotate-180 ${props.className->Option.getOr(
          "",
        )}`}
    />
  </div>
}

module DayButton = {
  @react.componentWithProps
  let make = (props: propsWithOptionalChildren<string, bool>) =>
    <Button
      {...props}
      dataVariant=Ghost
      dataSize=Icon
      className={`data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-muted data-[range-middle=true]:text-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 leading-none font-normal data-[range-end=true]:rounded-(--cell-radius) data-[range-end=true]:rounded-r-(--cell-radius) data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-(--cell-radius) data-[range-start=true]:rounded-l-(--cell-radius) [&>span]:text-xs [&>span]:opacity-70 ${props.className->Option.getOr(
          "",
        )}`}
    />
}
