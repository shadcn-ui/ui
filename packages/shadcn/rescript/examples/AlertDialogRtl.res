@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

module RtlAlertDialog = {
  @react.component
  let make = (~children=React.null, ~open_=?, ~defaultOpen=?, ~onOpenChange=?, ~onOpenChangeComplete=?) =>
    <BaseUi.AlertDialog.Root
      ?open_
      ?defaultOpen
      ?onOpenChange
      ?onOpenChangeComplete
      dataSlot="alert-dialog"
    >
      {children}
    </BaseUi.AlertDialog.Root>

  module Trigger = {
    @react.component
    let make = (
      ~children=React.null,
      ~className="",
      ~type_="button",
      ~ariaLabel=?,
      ~disabled=?,
    ) =>
      <BaseUi.AlertDialog.Trigger
        className
        type_
        ?ariaLabel
        ?disabled
        dataSlot="alert-dialog-trigger"
      >
        {children}
      </BaseUi.AlertDialog.Trigger>
  }

  module Portal = {
    @react.component
    let make = (~children=React.null, ~container=?) =>
      <BaseUi.AlertDialog.Portal ?container dataSlot="alert-dialog-portal">
        {children}
      </BaseUi.AlertDialog.Portal>
  }

  module Overlay = {
    @react.component
    let make = (~className="", ~keepMounted=?) =>
      <BaseUi.AlertDialog.Backdrop
        ?keepMounted
        dataSlot="alert-dialog-overlay"
        className={`data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs ${className}`}
      />
  }

  module Content = {
    @react.component
    let make = (
      ~children=React.null,
      ~className="",
      ~dir=?,
      ~dataLang=?,
      ~keepMounted=?,
      ~dataSize=Button.Size.Default,
    ) => {
      let size = dataSize
      <Portal>
        <Overlay />
        <BaseUi.AlertDialog.Popup
          ?dir
          ?dataLang
          ?keepMounted
          dataSlot="alert-dialog-content"
          dataSize={(size :> string)}
          className={`data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 bg-background ring-foreground/10 group/alert-dialog-content fixed start-1/2 top-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl p-4 ring-1 duration-100 outline-none data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-sm rtl:translate-x-1/2 ${className}`}
        >
          {children}
        </BaseUi.AlertDialog.Popup>
      </Portal>
    }
  }

  module Header = {
    @react.component
    let make = (~children=React.null, ~className="") =>
      <div
        dataSlot="alert-dialog-header"
        className={`grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-4 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-start sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr] ${className}`}
      >
        {children}
      </div>
  }

  module Footer = {
    @react.component
    let make = (~children=React.null, ~className="") =>
      <div
        dataSlot="alert-dialog-footer"
        className={`bg-muted/50 -mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t p-4 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end ${className}`}
      >
        {children}
      </div>
  }

  module Media = {
    @react.component
    let make = (~children=React.null, ~className="") =>
      <div
        dataSlot="alert-dialog-media"
        className={`bg-muted mb-2 inline-flex size-10 items-center justify-center rounded-md sm:group-data-[size=default]/alert-dialog-content:row-span-2 *:[svg:not([class*='size-'])]:size-6 ${className}`}
      >
        {children}
      </div>
  }

  module Title = {
    @react.component
    let make = (~children=React.null, ~className="") =>
      <BaseUi.AlertDialog.Title
        dataSlot="alert-dialog-title"
        className={`text-base font-medium sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2 ${className}`}
      >
        {children}
      </BaseUi.AlertDialog.Title>
  }

  module Description = {
    @react.component
    let make = (~children=React.null, ~className="") =>
      <BaseUi.AlertDialog.Description
        dataSlot="alert-dialog-description"
        className={`text-muted-foreground *:[a]:hover:text-foreground text-sm text-balance md:text-pretty *:[a]:underline *:[a]:underline-offset-3 ${className}`}
      >
        {children}
      </BaseUi.AlertDialog.Description>
  }

  module Action = {
    @react.component
    let make = (~children=React.null, ~className="", ~variant=Button.Variant.Default, ~size=Button.Size.Default) =>
      <Button className variant size dataSlot="alert-dialog-action">
        {children}
      </Button>
  }

  module Cancel = {
    @react.component
    let make = (
      ~children=React.null,
      ~className="",
      ~dataVariant=Button.Variant.Outline,
      ~dataSize=Button.Size.Default,
    ) => {
      let variant = dataVariant
      let size = dataSize
      <BaseUi.AlertDialog.Close
        dataSlot="alert-dialog-cancel"
        render={<Button variant size className />}
      >
        {children}
      </BaseUi.AlertDialog.Close>
    }
  }
}

let rtlOutlineTriggerClass =
  "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 aria-expanded:bg-muted aria-expanded:text-foreground aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 bg-background bg-clip-padding border border-border dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:bg-input/30 dark:border-input dark:hover:bg-input/50 disabled:opacity-50 disabled:pointer-events-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 font-medium gap-1.5 group/button h-8 has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2 hover:bg-muted hover:text-foreground inline-flex items-center justify-center outline-none px-2.5 rounded-lg select-none shrink-0 text-sm transition-all whitespace-nowrap"

@react.component
let make = () =>
  <div className="flex gap-4" dir="rtl">
    <RtlAlertDialog>
      <RtlAlertDialog.Trigger
        className={rtlOutlineTriggerClass}
        type_="button"
      >
        {"إظهار الحوار"->React.string}
      </RtlAlertDialog.Trigger>
      <RtlAlertDialog.Content dir="rtl" dataLang="ar">
        <RtlAlertDialog.Header>
          <RtlAlertDialog.Title> {"هل أنت متأكد تمامًا؟"->React.string} </RtlAlertDialog.Title>
          <RtlAlertDialog.Description>
            {"لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف حسابك نهائيًا من خوادمنا."->React.string}
          </RtlAlertDialog.Description>
        </RtlAlertDialog.Header>
        <RtlAlertDialog.Footer>
          <RtlAlertDialog.Cancel> {"إلغاء"->React.string} </RtlAlertDialog.Cancel>
          <RtlAlertDialog.Action> {"متابعة"->React.string} </RtlAlertDialog.Action>
        </RtlAlertDialog.Footer>
      </RtlAlertDialog.Content>
    </RtlAlertDialog>
    <RtlAlertDialog>
      <RtlAlertDialog.Trigger
        className={rtlOutlineTriggerClass}
        type_="button"
      >
        {"إظهار الحوار (صغير)"->React.string}
      </RtlAlertDialog.Trigger>
      <RtlAlertDialog.Content dir="rtl" dataLang="ar" dataSize=Button.Size.Sm>
        <RtlAlertDialog.Header>
          <RtlAlertDialog.Media>
            <Icons.Bluetooth />
          </RtlAlertDialog.Media>
          <RtlAlertDialog.Title> {"السماح للملحق بالاتصال؟"->React.string} </RtlAlertDialog.Title>
          <RtlAlertDialog.Description>
            {"هل تريد السماح لملحق USB بالاتصال بهذا الجهاز؟"->React.string}
          </RtlAlertDialog.Description>
        </RtlAlertDialog.Header>
        <RtlAlertDialog.Footer>
          <RtlAlertDialog.Cancel> {"عدم السماح"->React.string} </RtlAlertDialog.Cancel>
          <RtlAlertDialog.Action> {"السماح"->React.string} </RtlAlertDialog.Action>
        </RtlAlertDialog.Footer>
      </RtlAlertDialog.Content>
    </RtlAlertDialog>
  </div>
