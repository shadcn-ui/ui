@react.component
let make = () =>
  <Toggle
    ariaLabel="Toggle bookmark"
    dataSize=BaseUi.Types.Size.Sm
    dataVariant=BaseUi.Types.Variant.Outline
  >
    <Icons.Bookmark className="group-aria-pressed/toggle:fill-foreground" />
    {"Bookmark"->React.string}
  </Toggle>
