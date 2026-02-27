@react.component
let make = () =>
  <div className="flex items-center gap-2 text-sm md:gap-4">
    <div className="flex flex-col gap-1">
      <span className="font-medium"> {"Settings"->React.string} </span>
      <span className="text-muted-foreground text-xs"> {"Manage preferences"->React.string} </span>
    </div>
    <Separator orientation=BaseUi.Types.Orientation.Vertical />
    <div className="flex flex-col gap-1">
      <span className="font-medium"> {"Account"->React.string} </span>
      <span className="text-muted-foreground text-xs"> {"Profile & security"->React.string} </span>
    </div>
    <Separator orientation=BaseUi.Types.Orientation.Vertical className="hidden md:block" />
    <div className="hidden flex-col gap-1 md:flex">
      <span className="font-medium"> {"Help"->React.string} </span>
      <span className="text-muted-foreground text-xs"> {"Support & docs"->React.string} </span>
    </div>
  </div>
