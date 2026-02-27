@react.component
let make = () =>
  <Resizable
    orientation=BaseUi.Types.Orientation.Horizontal
    className="min-h-[200px] max-w-sm rounded-lg border"
  >
    <Resizable.Panel defaultSize="25%">
      <div className="flex h-full items-center justify-center p-6">
        <span className="font-semibold"> {"Sidebar"->React.string} </span>
      </div>
    </Resizable.Panel>
    <Resizable.Handle withHandle={true} />
    <Resizable.Panel defaultSize="75%">
      <div className="flex h-full items-center justify-center p-6">
        <span className="font-semibold"> {"Content"->React.string} </span>
      </div>
    </Resizable.Panel>
  </Resizable>
