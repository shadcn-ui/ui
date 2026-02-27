@react.component
let make = () =>
  <div className="flex w-full max-w-sm flex-col gap-2 text-sm">
    <dl className="flex items-center justify-between">
      <dt> {"Item 1"->React.string} </dt>
      <dd className="text-muted-foreground"> {"Value 1"->React.string} </dd>
    </dl>
    <Separator />
    <dl className="flex items-center justify-between">
      <dt> {"Item 2"->React.string} </dt>
      <dd className="text-muted-foreground"> {"Value 2"->React.string} </dd>
    </dl>
    <Separator />
    <dl className="flex items-center justify-between">
      <dt> {"Item 3"->React.string} </dt>
      <dd className="text-muted-foreground"> {"Value 3"->React.string} </dd>
    </dl>
  </div>
