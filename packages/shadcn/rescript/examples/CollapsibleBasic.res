@react.component
let make = () =>
  <Card className="mx-auto w-full max-w-sm">
    <Card.Content>
      <Collapsible className="data-open:bg-muted rounded-md">
        <Collapsible.Trigger
          render={<button
            className={`${Button.buttonVariants(
                ~variant=Button.Variant.Ghost,
              )} w-full`}
            type_="button"
          />}
        >
          {"Product details"->React.string}
          <Icons.ChevronDown className="ml-auto group-data-panel-open/button:rotate-180" />
        </Collapsible.Trigger>
        <Collapsible.Content className="flex flex-col items-start gap-2 p-2.5 pt-0 text-sm">
          <div>
            {"This panel can be expanded or collapsed to reveal additional content."->React.string}
          </div>
          <Button size=Button.Size.Xs> {"Learn More"->React.string} </Button>
        </Collapsible.Content>
      </Collapsible>
    </Card.Content>
  </Card>
