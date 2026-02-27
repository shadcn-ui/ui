@react.component
let make = () => {
  let triggerClassName =
    "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 border bg-clip-padding font-medium focus-visible:ring-3 aria-invalid:ring-3 inline-flex items-center justify-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none group/button select-none border-border bg-background hover:bg-muted hover:text-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 aria-expanded:bg-muted aria-expanded:text-foreground h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5"

  <div className="flex gap-6">
    <Popover>
      <Popover.Trigger className=triggerClassName type_="button">
        {"Start"->React.string}
      </Popover.Trigger>
      <Popover.Content align=BaseUi.Types.Align.Start className="w-40">
        {"Aligned to start"->React.string}
      </Popover.Content>
    </Popover>
    <Popover>
      <Popover.Trigger className=triggerClassName type_="button">
        {"Center"->React.string}
      </Popover.Trigger>
      <Popover.Content align=BaseUi.Types.Align.Center className="w-40">
        {"Aligned to center"->React.string}
      </Popover.Content>
    </Popover>
    <Popover>
      <Popover.Trigger className=triggerClassName type_="button">
        {"End"->React.string}
      </Popover.Trigger>
      <Popover.Content align=BaseUi.Types.Align.End className="w-40">
        {"Aligned to end"->React.string}
      </Popover.Content>
    </Popover>
  </div>
}
