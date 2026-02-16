module Root = {
  @module("@base-ui/react/alert-dialog")
  @scope("AlertDialog")
  external make: React.component<Types.propsWithChildren<'value, 'checked>> = "Root"
}

module Backdrop = {
  @module("@base-ui/react/alert-dialog")
  @scope("AlertDialog")
  external make: React.component<Types.props<'value, 'checked>> = "Backdrop"
}

module Close = {
  @module("@base-ui/react/alert-dialog")
  @scope("AlertDialog")
  external make: React.component<Types.propsWithChildren<'value, 'checked>> = "Close"
}

module Description = {
  @module("@base-ui/react/alert-dialog")
  @scope("AlertDialog")
  external make: React.component<Types.propsWithChildren<'value, 'checked>> = "Description"
}

module Popup = {
  @module("@base-ui/react/alert-dialog")
  @scope("AlertDialog")
  external make: React.component<Types.propsWithChildren<'value, 'checked>> = "Popup"
}

module Portal = {
  @module("@base-ui/react/alert-dialog")
  @scope("AlertDialog")
  external make: React.component<Types.propsWithChildren<'value, 'checked>> = "Portal"
}

module Title = {
  @module("@base-ui/react/alert-dialog")
  @scope("AlertDialog")
  external make: React.component<Types.propsWithChildren<'value, 'checked>> = "Title"
}

module Trigger = {
  @module("@base-ui/react/alert-dialog")
  @scope("AlertDialog")
  external make: React.component<Types.propsWithChildren<'value, 'checked>> = "Trigger"
}

module Viewport = {
  @module("@base-ui/react/alert-dialog")
  @scope("AlertDialog")
  external make: React.component<Types.propsWithOptionalChildren<'value, 'checked>> = "Viewport"
}
