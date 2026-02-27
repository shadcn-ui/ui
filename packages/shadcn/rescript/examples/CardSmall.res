@react.component
let make = () => {
  let featureName = "Scheduled reports"

  <Card dataSize=Card.Size.Sm className="mx-auto w-full max-w-xs">
    <Card.Header>
      <Card.Title> {featureName->React.string} </Card.Title>
      <Card.Description>
        {"Weekly snapshots. No more manual exports."->React.string}
      </Card.Description>
    </Card.Header>
    <Card.Content>
      <ul className="grid gap-2 py-2 text-sm">
        <li className="flex gap-2">
          <Icons.ChevronRight className="text-muted-foreground mt-0.5 size-4 shrink-0" />
          <span> {"Choose a schedule (daily, or weekly)."->React.string} </span>
        </li>
        <li className="flex gap-2">
          <Icons.ChevronRight className="text-muted-foreground mt-0.5 size-4 shrink-0" />
          <span> {"Send to channels or specific teammates."->React.string} </span>
        </li>
        <li className="flex gap-2">
          <Icons.ChevronRight className="text-muted-foreground mt-0.5 size-4 shrink-0" />
          <span> {"Include charts, tables, and key metrics."->React.string} </span>
        </li>
      </ul>
    </Card.Content>
    <Card.Footer className="flex-col gap-2">
      <Button size=Button.Size.Sm className="w-full">
        {"Set up scheduled reports"->React.string}
      </Button>
      <Button variant=Button.Variant.Outline size=Button.Size.Sm className="w-full">
        {"See what's new"->React.string}
      </Button>
    </Card.Footer>
  </Card>
}
