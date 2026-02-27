@react.component
let make = () =>
  <div className="flex items-center justify-between gap-4">
    <Field orientation=BaseUi.Types.Orientation.Horizontal className="w-fit">
      <Field.Label htmlFor="select-rows-per-page"> {"Rows per page"->React.string} </Field.Label>
      <Select defaultValue="25">
        <Select.Trigger className="w-20" id="select-rows-per-page">
          <Select.Value />
        </Select.Trigger>
        <Select.Content align=BaseUi.Types.Align.Start>
          <Select.Group>
            <Select.Item value="10"> {"10"->React.string} </Select.Item>
            <Select.Item value="25"> {"25"->React.string} </Select.Item>
            <Select.Item value="50"> {"50"->React.string} </Select.Item>
            <Select.Item value="100"> {"100"->React.string} </Select.Item>
          </Select.Group>
        </Select.Content>
      </Select>
    </Field>
    <Pagination className="mx-0 w-auto">
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous href="#" />
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Next href="#" />
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  </div>
