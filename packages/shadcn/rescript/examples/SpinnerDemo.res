@react.component
let make = () =>
  <div className="flex w-full max-w-xs flex-col gap-4 [--radius:1rem]">
    <Item variant=Item.Variant.Muted>
      <Item.Media>
        <Spinner> {React.null} </Spinner>
      </Item.Media>
      <Item.Content>
        <Item.Title className="line-clamp-1"> {"Processing payment..."->React.string} </Item.Title>
      </Item.Content>
      <Item.Content className="flex-none justify-end">
        <span className="text-sm tabular-nums"> {"$100.00"->React.string} </span>
      </Item.Content>
    </Item>
  </div>
