@@directive("'use client'")

@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

module RtlAvatar = {
  module Badge = {
    @react.component
    let make = (~className="", ~children=React.null) =>
      <span
        dataSlot="avatar-badge"
        className={`bg-primary text-primary-foreground ring-background absolute end-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-blend-color ring-2 select-none group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2 group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2 ${className}`}
      >
        {children}
      </span>
  }
}

@react.component
let make = () =>
  <div className="flex flex-row flex-wrap items-center gap-6 md:gap-12" dir="rtl">
    <Avatar>
      <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" className="grayscale" />
      <Avatar.Fallback> {"CN"->React.string} </Avatar.Fallback>
    </Avatar>
    <Avatar>
      <Avatar.Image src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
      <Avatar.Fallback> {"ER"->React.string} </Avatar.Fallback>
      <RtlAvatar.Badge className="bg-green-600 dark:bg-green-800" />
    </Avatar>
    <Avatar.Group className="grayscale">
      <Avatar>
        <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
        <Avatar.Fallback> {"CN"->React.string} </Avatar.Fallback>
      </Avatar>
      <Avatar>
        <Avatar.Image src="https://github.com/maxleiter.png" alt="@maxleiter" />
        <Avatar.Fallback> {"LR"->React.string} </Avatar.Fallback>
      </Avatar>
      <Avatar>
        <Avatar.Image src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
        <Avatar.Fallback> {"ER"->React.string} </Avatar.Fallback>
      </Avatar>
      <Avatar.GroupCount> {"+٣"->React.string} </Avatar.GroupCount>
    </Avatar.Group>
  </div>
