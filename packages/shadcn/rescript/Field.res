type props<'value, 'checked> = BaseUi.Types.props<'value, 'checked>
external toDomProps: props<'value, 'checked> => JsxDOM.domProps = "%identity"

module UiLabel = Label
module UiSeparator = Separator

let fieldOrientationClass = (~orientation: string) =>
  switch orientation {
  | "horizontal" =>
    "flex-row items-center *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px"
  | "responsive" =>
    "flex-col *:w-full [&>.sr-only]:w-auto @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:*:data-[slot=field-label]:flex-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px"
  | _ => "flex-col *:w-full [&>.sr-only]:w-auto"
  }

let fieldVariants = (~orientation="vertical") => {
  let base = "data-[invalid=true]:text-destructive gap-2 group/field flex w-full"
  `${base} ${fieldOrientationClass(~orientation)}`
}

module Set = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) => {
    let props = {...props, dataSlot: "field-set"}
    <fieldset
      {...toDomProps(props)}
      className={`flex flex-col gap-4 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3 ${props.className->Option.getOr("")}`}
    />
  }
}

module Legend = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) => {
    let variant = props.dataVariant->Option.getOr("legend")
    let props = {...props, dataSlot: "field-legend", dataVariant: variant}
    <legend
      {...toDomProps(props)}
      className={`mb-1.5 font-medium data-[variant=label]:text-sm data-[variant=legend]:text-base ${props.className->Option.getOr("")}`}
    />
  }
}

module Group = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) => {
    let props = {...props, dataSlot: "field-group"}
    <div
      {...toDomProps(props)}
      className={`group/field-group @container/field-group flex w-full flex-col gap-5 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4 ${props.className->Option.getOr("")}`}
    />
  }
}

@react.componentWithProps
let make = (props: props<'value, 'checked>) => {
  let orientation = props.dataOrientation->Option.getOr("vertical")
  let props = {...props, dataSlot: "field", dataOrientation: orientation}
  <div
    {...toDomProps(props)}
    role="group"
    className={`${fieldVariants(~orientation)} ${props.className->Option.getOr("")}`}
  />
}

module Content = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) => {
    let props = {...props, dataSlot: "field-content"}
    <div
      {...toDomProps(props)}
      className={`group/field-content flex flex-1 flex-col gap-0.5 leading-snug ${props.className->Option.getOr("")}`}
    />
  }
}

module Label = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <UiLabel.make
      {...props}
      dataSlot="field-label"
      className={`has-data-checked:bg-primary/5 has-data-checked:border-primary/30 dark:has-data-checked:border-primary/20 dark:has-data-checked:bg-primary/10 group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50 has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border *:data-[slot=field]:p-2.5 has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col ${props.className->Option.getOr("")}`}
    />
}

module Title = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) => {
    let props = {...props, dataSlot: "field-label"}
    <div
      {...toDomProps(props)}
      className={`flex w-fit items-center gap-2 text-sm leading-snug font-medium group-data-[disabled=true]/field:opacity-50 ${props.className->Option.getOr("")}`}
    />
  }
}

module Description = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) => {
    let props = {...props, dataSlot: "field-description"}
    <p
      {...toDomProps(props)}
      className={`text-muted-foreground text-left text-sm leading-normal font-normal group-has-data-horizontal/field:text-balance [[data-variant=legend]+&]:-mt-1.5 last:mt-0 nth-last-2:-mt-1 [&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4 ${props.className->Option.getOr("")}`}
    />
  }
}

module Separator = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) => {
    let hasContent =
      switch props.children {
      | Some(_) => true
      | None => false
      }
    let props = {...props, dataSlot: "field-separator", dataContent: hasContent}
    <div
      {...toDomProps(props)}
      className={`relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2 ${props.className->Option.getOr("")}`}
    >
      <UiSeparator.make className="absolute inset-0 top-1/2" />
      {
        switch props.children {
        | Some(children) =>
          <span
            className="text-muted-foreground bg-background relative mx-auto block w-fit px-2"
          >
            {children}
          </span>
        | None => React.null
        }
      }
    </div>
  }
}

module Error = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) => {
    let content =
      switch props.children {
      | Some(children) => Some(children)
      | None => None
      }
    switch content {
    | None => React.null
    | Some(content) =>
      let props = {...props, dataSlot: "field-error"}
      <div
        {...toDomProps(props)}
        role="alert"
        className={`text-destructive text-sm font-normal ${props.className->Option.getOr("")}`}
      >
        {content}
      </div>
    }
  }
}
