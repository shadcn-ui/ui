type props<'value, 'checked> = BaseUi.Types.props<'value, 'checked>

let toggleVariantClass = (~variant: BaseUi.Types.Variant.t) =>
  switch variant {
    | Outline => "border-input hover:bg-muted border bg-transparent"
    | Default
    | Secondary
    | Destructive
    | Ghost
    | Muted
    | Line
    | Link
    | Icon
    | Image
    | Legend
    | Label => "bg-transparent"
    }

let toggleSizeClass = (~size: BaseUi.Types.Size.t) =>
  switch size {
    | Sm =>
      "h-7 min-w-7 rounded-[min(var(--radius-md),12px)] px-1.5 text-[0.8rem]"
    | Lg => "h-9 min-w-9 px-2.5"
    | Default
    | Xs
    | Md
    | Icon
    | IconXs
    | IconSm
    | IconLg => "h-8 min-w-8 px-2"
    }

let toggleVariants = (~variant=BaseUi.Types.Variant.Default, ~size=BaseUi.Types.Size.Default) => {
  let base =
    "hover:text-foreground aria-pressed:bg-muted focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[state=on]:bg-muted gap-1 rounded-lg text-sm font-medium transition-all [&_svg:not([class*='size-'])]:size-4 group/toggle hover:bg-muted inline-flex items-center justify-center whitespace-nowrap outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0"
  `${base} ${toggleVariantClass(~variant)} ${toggleSizeClass(~size)}`
}

@react.componentWithProps
let make = (props: props<'value, 'checked>) => {
  let variant = props.dataVariant->Option.getOr(BaseUi.Types.Variant.Default)
  let size = props.dataSize->Option.getOr(BaseUi.Types.Size.Default)
  <BaseUi.Toggle
    {...props}
    dataSlot="toggle"
    className={`${toggleVariants(~variant, ~size)} ${props.className->Option.getOr("")}`}
  />
}
