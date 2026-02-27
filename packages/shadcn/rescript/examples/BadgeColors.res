@react.component
let make = () =>
  <div className="flex flex-wrap gap-2">
    <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
      {"Blue"->React.string}
    </Badge>
    <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
      {"Green"->React.string}
    </Badge>
    <Badge className="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
      {"Sky"->React.string}
    </Badge>
    <Badge className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
      {"Purple"->React.string}
    </Badge>
    <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
      {"Red"->React.string}
    </Badge>
  </div>
