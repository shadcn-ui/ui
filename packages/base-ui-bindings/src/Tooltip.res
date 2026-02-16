module Root = {
  @module("@base-ui/react/tooltip")
  @scope("Tooltip")
  external make: React.component<Types.propsWithChildren<'value, 'checked>> = "Root"
}

module Trigger = {
  @module("@base-ui/react/tooltip")
  @scope("Tooltip")
  external make: React.component<Types.propsWithChildren<'value, 'checked>> = "Trigger"
}

module Portal = {
  @module("@base-ui/react/tooltip")
  @scope("Tooltip")
  external make: React.component<Types.propsWithChildren<'value, 'checked>> = "Portal"
}

module Positioner = {
  @module("@base-ui/react/tooltip")
  @scope("Tooltip")
  external make: React.component<Types.propsWithChildren<'value, 'checked>> = "Positioner"
}

module Popup = {
  @module("@base-ui/react/tooltip")
  @scope("Tooltip")
  external make: React.component<Types.propsWithChildren<'value, 'checked>> = "Popup"
}

module Arrow = {
  @module("@base-ui/react/tooltip")
  @scope("Tooltip")
  external make: React.component<Types.props<'value, 'checked>> = "Arrow"
}

module Provider = {
  @module("@base-ui/react/tooltip")
  @scope("Tooltip")
  external make: React.component<Types.propsWithChildren<'value, 'checked>> = "Provider"
}

module Viewport = {
  @module("@base-ui/react/tooltip")
  @scope("Tooltip")
  external make: React.component<Types.propsWithOptionalChildren<'value, 'checked>> = "Viewport"
}
