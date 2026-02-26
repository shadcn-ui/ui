@react.component
let make = () =>
  <Toggle
    ariaLabel="Toggle bookmark"
    size=Toggle.Size.Sm
    variant=Toggle.Variant.Outline
  >
    <Icons.Bookmark className="group-aria-pressed/toggle:fill-foreground" />
    {"Bookmark"->React.string}
  </Toggle>
