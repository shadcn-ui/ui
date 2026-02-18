@@directive("'use client'")

@react.component
let make = () => {
  let (isOpen, setIsOpen) = React.useState(() => false)

  <Collapsible
    open_=isOpen
    onOpenChange={(nextOpen, _) => setIsOpen(_ => nextOpen)}
    className="flex w-[350px] flex-col gap-2"
  >
    <div className="flex items-center justify-between gap-4 px-4">
      <h4 className="text-sm font-semibold"> {"Order #4189"->React.string} </h4>
      <Collapsible.Trigger
        render={<Button
          variant=BaseUi.Types.Variant.Ghost
          size=BaseUi.Types.Size.Icon
          className="size-8"
          ariaDisabled={false}
        />}
      >
        <Icons.ChevronsUpDown />
        <span className="sr-only"> {"Toggle details"->React.string} </span>
      </Collapsible.Trigger>
    </div>
    <div className="flex items-center justify-between rounded-md border px-4 py-2 text-sm">
      <span className="text-muted-foreground"> {"Status"->React.string} </span>
      <span className="font-medium"> {"Shipped"->React.string} </span>
    </div>
    <Collapsible.Content className="flex flex-col gap-2">
      <div className="rounded-md border px-4 py-2 text-sm">
        <p className="font-medium"> {"Shipping address"->React.string} </p>
        <p className="text-muted-foreground"> {"100 Market St, San Francisco"->React.string} </p>
      </div>
      <div className="rounded-md border px-4 py-2 text-sm">
        <p className="font-medium"> {"Items"->React.string} </p>
        <p className="text-muted-foreground"> {"2x Studio Headphones"->React.string} </p>
      </div>
    </Collapsible.Content>
  </Collapsible>
}
