@react.component
let make = () =>
  <div className="flex flex-wrap gap-2">
    <Badge variant=Badge.Variant.Secondary>
      <Icons.BadgeCheck dataIcon="inline-start" />
      {"Verified"->React.string}
    </Badge>
    <Badge variant=Badge.Variant.Outline>
      {"Bookmark"->React.string}
      <Icons.Bookmark dataIcon="inline-end" />
    </Badge>
  </div>
