@react.component
let make = () =>
  <Resizable orientation=BaseUi.Types.Orientation.Horizontal className="max-w-sm rounded-lg border">
    <Resizable.Panel defaultSize="50%">
      <div className="flex h-[200px] items-center justify-center p-6">
        <span className="font-semibold"> {"One"->React.string} </span>
      </div>
    </Resizable.Panel>
    <Resizable.Handle withHandle={true} />
    <Resizable.Panel defaultSize="50%">
      <Resizable orientation=BaseUi.Types.Orientation.Vertical>
        <Resizable.Panel defaultSize="25%">
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold"> {"Two"->React.string} </span>
          </div>
        </Resizable.Panel>
        <Resizable.Handle withHandle={true} />
        <Resizable.Panel defaultSize="75%">
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold"> {"Three"->React.string} </span>
          </div>
        </Resizable.Panel>
      </Resizable>
    </Resizable.Panel>
  </Resizable>
