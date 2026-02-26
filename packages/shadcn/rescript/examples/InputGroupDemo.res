@react.component
let make = () =>
  <InputGroup className="max-w-xs">
    <InputGroup.Input placeholder="Search..."> {React.null} </InputGroup.Input>
    <InputGroup.Addon>
      <Icons.Search />
    </InputGroup.Addon>
    <InputGroup.Addon dataAlign=InputGroup.DataAlign.InlineEnd>
      {"12 results"->React.string}
    </InputGroup.Addon>
  </InputGroup>
