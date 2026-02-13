type props<'value, 'checked> = BaseUi.Types.props<'value, 'checked>
external toDomProps: props<'value, 'checked> => JsxDOM.domProps = "%identity"

@react.componentWithProps
let make = (props: props<'value, 'checked>) =>
  <BaseUi.Dialog.Root {...props} dataSlot="dialog" />

module Trigger = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.Dialog.Trigger {...props} dataSlot="dialog-trigger" />
}

module Portal = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.Dialog.Portal {...props} dataSlot="dialog-portal" />
}

module Close = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.Dialog.Close {...props} dataSlot="dialog-close" />
}

module Overlay = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.Dialog.Backdrop
      {...props}
      dataSlot="dialog-overlay"
      className={`data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs ${props.className->Option.getOr("")}`}
    />
}

module Content = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <Portal>
      <Overlay />
      <BaseUi.Dialog.Popup
        {...props}
        dataSlot="dialog-content"
        className={`bg-background data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 ring-foreground/10 fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl p-4 text-sm ring-1 duration-100 outline-none sm:max-w-sm ${props.className->Option.getOr("")}`}
      >
        {props.children->Option.getOr(React.null)}
        <BaseUi.Dialog.Close
          dataSlot="dialog-close"
          render={
            <BaseUi.Button className="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 border border-transparent bg-clip-padding text-sm font-medium focus-visible:ring-3 aria-invalid:ring-3 [&_svg:not([class*='size-'])]:size-4 inline-flex items-center justify-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none group/button select-none hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 aria-expanded:bg-muted aria-expanded:text-foreground size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg absolute top-2 right-2" />
          }
        >
          <Icons.x />
          <span className="sr-only">{"Close"->React.string}</span>
        </BaseUi.Dialog.Close>
      </BaseUi.Dialog.Popup>
    </Portal>
}

module Header = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) => {
    let props = {...props, dataSlot: "dialog-header"}
    <div
      {...toDomProps(props)}
      className={`flex flex-col gap-2 ${props.className->Option.getOr("")}`}
    >
      {props.children->Option.getOr(React.null)}
    </div>
  }
}

module Footer = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) => {
    let props = {...props, dataSlot: "dialog-footer"}
    <div
      {...toDomProps(props)}
      className={`bg-muted/50 -mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t p-4 sm:flex-row sm:justify-end ${props.className->Option.getOr("")}`}
    >
      {props.children->Option.getOr(React.null)}
    </div>
  }
}

module Title = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.Dialog.Title
      {...props}
      dataSlot="dialog-title"
      className={`text-base leading-none font-medium ${props.className->Option.getOr("")}`}
    />
}

module Description = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.Dialog.Description
      {...props}
      dataSlot="dialog-description"
      className={`text-muted-foreground *:[a]:hover:text-foreground text-sm *:[a]:underline *:[a]:underline-offset-3 ${props.className->Option.getOr("")}`}
    />
}
