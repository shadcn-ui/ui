@react.component
let make = () =>
  <Badge render={<a href="#link" />}>
    {"Open Link "->React.string}
    <Icons.ArrowUpRight dataIcon="inline-end" />
  </Badge>
