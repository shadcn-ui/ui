module Root = {
  @module("@base-ui/react/avatar") @scope("Avatar")
  external make: React.component<Types.props<'value, 'checked>> = "Root"
}

module Image = {
  @module("@base-ui/react/avatar") @scope("Avatar")
  external make: React.component<Types.props<'value, 'checked>> = "Image"
}

module Fallback = {
  @module("@base-ui/react/avatar") @scope("Avatar")
  external make: React.component<Types.props<'value, 'checked>> = "Fallback"
}
