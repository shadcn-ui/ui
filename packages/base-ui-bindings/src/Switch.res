module Root = {
  @module("@base-ui/react/switch")
  @scope("Switch")
  external make: React.component<Types.props<'value, 'checked>> = "Root"
}

module Thumb = {
  @module("@base-ui/react/switch")
  @scope("Switch")
  external make: React.component<Types.props<'value, 'checked>> = "Thumb"
}
