module Root = {
  @module("@base-ui/react/progress") @scope("Progress")
  external make: React.component<Types.props<'value, 'checked>> = "Root"
}

module Track = {
  @module("@base-ui/react/progress") @scope("Progress")
  external make: React.component<Types.props<'value, 'checked>> = "Track"
}

module Indicator = {
  @module("@base-ui/react/progress") @scope("Progress")
  external make: React.component<Types.props<'value, 'checked>> = "Indicator"
}

module Value = {
  @module("@base-ui/react/progress") @scope("Progress")
  external make: React.component<Types.props<'value, 'checked>> = "Value"
}

module Label = {
  @module("@base-ui/react/progress") @scope("Progress")
  external make: React.component<Types.props<'value, 'checked>> = "Label"
}
