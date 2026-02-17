open BaseUi.Types

@react.componentWithProps
let make = (props: propsWithChildren<'value, 'checked>) =>
  <BaseUi.RadioGroup
    {...props}
    dataSlot="radio-group"
    className={`grid w-full gap-2 ${props.className->Option.getOr("")}`}
  />

module Item = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Radio.Root
      {...props}
      dataSlot="radio-group-item"
      className={`border-input text-primary dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 group/radio-group-item peer relative flex aspect-square size-4 shrink-0 rounded-full border outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 ${props.className->Option.getOr("")}`}
    >
    <BaseUi.Radio.Indicator
      dataSlot="radio-group-indicator"
      className="group-aria-invalid/radio-group-item:text-destructive text-primary flex size-4 items-center justify-center"
    >
      <Icons.Circle className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 fill-current" />
    </BaseUi.Radio.Indicator>
  </BaseUi.Radio.Root>
}
