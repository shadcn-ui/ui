@react.component
let make = () =>
  <Card className="w-full max-w-xs">
    <Card.Header>
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
    </Card.Header>
    <Card.Content>
      <Skeleton className="aspect-video w-full" />
    </Card.Content>
  </Card>
