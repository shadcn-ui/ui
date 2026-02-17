@react.component
let make = () =>
  <NativeSelect>
    <NativeSelect.Option value="">{"Select status"->React.string}</NativeSelect.Option>
    <NativeSelect.Option value="todo">{"Todo"->React.string}</NativeSelect.Option>
    <NativeSelect.Option value="in-progress">{"In Progress"->React.string}</NativeSelect.Option>
    <NativeSelect.Option value="done">{"Done"->React.string}</NativeSelect.Option>
    <NativeSelect.Option value="cancelled">{"Cancelled"->React.string}</NativeSelect.Option>
  </NativeSelect>
