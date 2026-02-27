@react.component
let make = () =>
  <Card className="relative mx-auto w-full max-w-sm pt-0">
    <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
    <img
      src="https://avatar.vercel.sh/shadcn1"
      alt="Event cover"
      className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
    />
    <Card.Header>
      <Card.Action>
        <Badge variant=Badge.Variant.Secondary> {"Featured"->React.string} </Badge>
      </Card.Action>
      <Card.Title> {"Design systems meetup"->React.string} </Card.Title>
      <Card.Description>
        {"A practical talk on component APIs, accessibility, and shipping faster."->React.string}
      </Card.Description>
    </Card.Header>
    <Card.Footer>
      <Button className="w-full"> {"View Event"->React.string} </Button>
    </Card.Footer>
  </Card>
