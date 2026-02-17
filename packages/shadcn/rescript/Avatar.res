@@directive("'use client'")

open BaseUi.Types

@react.componentWithProps
let make = (props: propsWithChildren<'value, 'checked>) => {
  let size = props.dataSize->Option.getOr(Size.Default)
  <BaseUi.Avatar.Root
    {...props}
    dataSlot="avatar"
    dataSize={size}
    className={`after:border-border group/avatar relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten ${props.className->Option.getOr("")}`}
  />
}

module Image = {
  @react.componentWithProps
  let make = (props: props<'value, 'checked>) =>
    <BaseUi.Avatar.Image
      {...props}
      dataSlot="avatar-image"
      className={`aspect-square size-full rounded-full object-cover ${props.className->Option.getOr("")}`}
    />
}

module Fallback = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <BaseUi.Avatar.Fallback
      {...props}
      dataSlot="avatar-fallback"
      className={`bg-muted text-muted-foreground flex size-full items-center justify-center rounded-full text-sm group-data-[size=sm]/avatar:text-xs ${props.className->Option.getOr("")}`}
    />
}

module Group = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <div

      className={`*:data-[slot=avatar]:ring-background group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 ${props.className->Option.getOr("")}`}
    >
      {props.children}
    </div>
}

module GroupCount = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <div

      className={`bg-muted text-muted-foreground ring-background relative flex size-8 shrink-0 items-center justify-center rounded-full text-sm ring-2 group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3 ${props.className->Option.getOr("")}`}
    >
      {props.children}
    </div>
}

module Badge = {
  @react.componentWithProps
  let make = (props: propsWithChildren<'value, 'checked>) =>
    <span

      className={`bg-primary text-primary-foreground ring-background absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-blend-color ring-2 select-none group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2 group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2 ${props.className->Option.getOr("")}`}
    >
      {props.children}
    </span>
}
