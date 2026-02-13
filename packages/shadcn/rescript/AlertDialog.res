type props<'value, 'checked> = BaseUi.Types.props<'value, 'checked>
external toDomProps: props<'value, 'checked> => JsxDOM.domProps = "%identity"

@react.componentWithProps
let make = (props: props<'value, 'checked>) =>
  <BaseUi.AlertDialog.Root {...props} dataSlot="alert-dialog" />

module Trigger = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.AlertDialog.Trigger {...props} dataSlot="alert-dialog-trigger" />
}

module Portal = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.AlertDialog.Portal {...props} dataSlot="alert-dialog-portal" />
}

module Overlay = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.AlertDialog.Backdrop
      {...props}
      dataSlot="alert-dialog-overlay"
      className={`data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs ${props.className->Option.getOr("")}`}
    />
}

module Content = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) => {
    let size = props.dataSize->Option.getOr(BaseUi.Types.Size.Default)
    <Portal>
      <Overlay />
      <BaseUi.AlertDialog.Popup
        {...props}
        dataSlot="alert-dialog-content"
        dataSize={size}
        className={`data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 bg-background ring-foreground/10 group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl p-4 ring-1 duration-100 outline-none data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-sm ${props.className->Option.getOr("")}`}
      />
    </Portal>
  }
}

module Header = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) => {
    let props = {...props, dataSlot: "alert-dialog-header"}
    <div
      {...toDomProps(props)}
      className={`grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-4 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr] ${props.className->Option.getOr("")}`}
    >
      {props.children->Option.getOr(React.null)}
    </div>
  }
}

module Footer = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) => {
    let props = {...props, dataSlot: "alert-dialog-footer"}
    <div
      {...toDomProps(props)}
      className={`bg-muted/50 -mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t p-4 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end ${props.className->Option.getOr("")}`}
    >
      {props.children->Option.getOr(React.null)}
    </div>
  }
}

module Media = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) => {
    let props = {...props, dataSlot: "alert-dialog-media"}
    <div
      {...toDomProps(props)}
      className={`bg-muted mb-2 inline-flex size-10 items-center justify-center rounded-md sm:group-data-[size=default]/alert-dialog-content:row-span-2 *:[svg:not([class*='size-'])]:size-6 ${props.className->Option.getOr("")}`}
    >
      {props.children->Option.getOr(React.null)}
    </div>
  }
}

module Title = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.AlertDialog.Title
      {...props}
      dataSlot="alert-dialog-title"
      className={`text-base font-medium sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2 ${props.className->Option.getOr("")}`}
    />
}

module Description = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.AlertDialog.Description
      {...props}
      dataSlot="alert-dialog-description"
      className={`text-muted-foreground *:[a]:hover:text-foreground text-sm text-balance md:text-pretty *:[a]:underline *:[a]:underline-offset-3 ${props.className->Option.getOr("")}`}
    />
}

module Action = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <Button
      {...props}
      dataSlot="alert-dialog-action"
      className={`${props.className->Option.getOr("")}`}
    />
}

module Cancel = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.AlertDialog.Close
      {...props}
      dataSlot="alert-dialog-cancel"
      className={`${props.className->Option.getOr("")}`}
      render={
        <BaseUi.Button className="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-lg border bg-clip-padding text-sm font-medium focus-visible:ring-3 aria-invalid:ring-3 [&_svg:not([class*='size-'])]:size-4 inline-flex items-center justify-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none group/button select-none border-border bg-background hover:bg-muted hover:text-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 aria-expanded:bg-muted aria-expanded:text-foreground h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2" />
      }
    />
}
