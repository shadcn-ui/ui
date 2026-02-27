let tooltipSides = [
  (BaseUi.Types.Side.Left, "left"),
  (BaseUi.Types.Side.Top, "top"),
  (BaseUi.Types.Side.Bottom, "bottom"),
  (BaseUi.Types.Side.Right, "right"),
]

@react.component
let make = () => {
  let triggerClassName =
    Button.twMerge(`${Button.buttonVariants(~variant=Button.Variant.Outline)} w-fit capitalize`)

  <div className="flex flex-wrap gap-2">
    {tooltipSides
    ->Array.map(((side, label)) =>
      <Tooltip key=label>
        <Tooltip.Trigger render={<button className=triggerClassName type_="button" tabIndex=0 />}>
          {label->React.string}
        </Tooltip.Trigger>
        <Tooltip.Content side>
          <p> {"Add to library"->React.string} </p>
        </Tooltip.Content>
      </Tooltip>
    )
    ->React.array}
  </div>
}
