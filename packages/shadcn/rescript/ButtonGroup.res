type props<'value, 'checked> = BaseUi.Types.props<'value, 'checked>
external toDomProps: props<'value, 'checked> => JsxDOM.domProps = "%identity"

let buttonGroupVariants = (~orientation="horizontal") => {
  let base =
    "has-[>[data-slot=button-group]]:gap-2 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-lg flex w-fit items-stretch *:focus-visible:z-10 *:focus-visible:relative [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1"
  let orientationClass =
    switch orientation {
    | "vertical" =>
      "[&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-lg! flex-col [&>[data-slot]~[data-slot]]:rounded-t-none [&>[data-slot]~[data-slot]]:border-t-0 *:data-slot:rounded-b-none"
    | _ =>
      "[&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-lg! [&>[data-slot]~[data-slot]]:rounded-l-none [&>[data-slot]~[data-slot]]:border-l-0 *:data-slot:rounded-r-none"
    }
  `${base} ${orientationClass}`
}

@react.componentWithProps
let make = (props: props<'value, 'checked>) => {
  let orientation = props.dataOrientation->Option.getOr("horizontal")
  let props = {...props, dataSlot: "button-group"}
  <div
    {...toDomProps(props)}
    role="group"
    className={`${buttonGroupVariants(~orientation)} ${props.className->Option.getOr("")}`}
  >
    {props.children->Option.getOr(React.null)}
  </div>
}

module Text = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <div
      {...toDomProps(props)}
      className={`bg-muted gap-2 rounded-lg border px-2.5 text-sm font-medium [&_svg:not([class*='size-'])]:size-4 flex items-center [&_svg]:pointer-events-none ${props.className->Option.getOr("")}`}
    >
      {props.children->Option.getOr(React.null)}
    </div>
}

module Separator = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.Separator
      {...props}
      dataSlot="button-group-separator"
      orientation={props.orientation->Option.getOr(BaseUi.Types.Vertical)}
      className={`bg-input relative self-stretch shrink-0 data-horizontal:mx-px data-horizontal:h-px data-horizontal:w-auto data-vertical:my-px data-vertical:h-auto data-vertical:w-px data-vertical:self-stretch ${props.className->Option.getOr("")}`}
    />
}
