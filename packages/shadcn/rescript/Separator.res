open BaseUi.Types

@react.componentWithProps
let make = (props: propsWithOptionalChildren<'value, 'checked>) =>
  <BaseUi.Separator
    {...props}
    orientation={props.orientation->Option.getOr(Orientation.Horizontal)}
    dataSlot="separator"
    className={`bg-border shrink-0 data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch ${props.className->Option.getOr(
        "",
      )}`}
  />
