@react.component
let make = () =>
  <div className="flex flex-col items-center gap-4">
    <Kbd.Group>
      <Kbd> {"⌘"->React.string} </Kbd>
      <Kbd> {"⇧"->React.string} </Kbd>
      <Kbd> {"⌥"->React.string} </Kbd>
      <Kbd> {"⌃"->React.string} </Kbd>
    </Kbd.Group>
    <Kbd.Group>
      <Kbd> {"Ctrl"->React.string} </Kbd>
      <span> {"+"->React.string} </span>
      <Kbd> {"B"->React.string} </Kbd>
    </Kbd.Group>
  </div>
