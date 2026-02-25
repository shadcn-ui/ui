@react.component
let make = () =>
  <div className="flex items-center gap-4">
    <Skeleton className="h-12 w-12 rounded-full"> {React.null} </Skeleton>
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]"> {React.null} </Skeleton>
      <Skeleton className="h-4 w-[200px]"> {React.null} </Skeleton>
    </div>
  </div>
