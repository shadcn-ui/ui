module Root = {
  @module("@base-ui/react/scroll-area")
  @scope("ScrollArea")
  external make: React.component<Types.propsWithChildren<'value, 'checked>> = "Root"
}

module Viewport = {
  @module("@base-ui/react/scroll-area")
  @scope("ScrollArea")
  external make: React.component<Types.propsWithChildren<'value, 'checked>> = "Viewport"
}

module Scrollbar = {
  @module("@base-ui/react/scroll-area")
  @scope("ScrollArea")
  external make: React.component<Types.propsWithChildren<'value, 'checked>> = "Scrollbar"
}

module Content = {
  @module("@base-ui/react/scroll-area")
  @scope("ScrollArea")
  external make: React.component<Types.propsWithOptionalChildren<'value, 'checked>> = "Content"
}

module Thumb = {
  @module("@base-ui/react/scroll-area")
  @scope("ScrollArea")
  external make: React.component<Types.props<'value, 'checked>> = "Thumb"
}

module Corner = {
  @module("@base-ui/react/scroll-area")
  @scope("ScrollArea")
  external make: React.component<Types.props<'value, 'checked>> = "Corner"
}
