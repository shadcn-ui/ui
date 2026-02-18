module Root = {
  @module("@base-ui/react/slider") @scope("Slider")
  external make: React.component<Types.props<'value, 'checked>> = "Root"
}

module Value = {
  @module("@base-ui/react/slider") @scope("Slider")
  external make: React.component<Types.props<'value, 'checked>> = "Value"
}

module Control = {
  @module("@base-ui/react/slider") @scope("Slider")
  external make: React.component<Types.props<'value, 'checked>> = "Control"
}

module Track = {
  @module("@base-ui/react/slider") @scope("Slider")
  external make: React.component<Types.props<'value, 'checked>> = "Track"
}

module Thumb = {
  @module("@base-ui/react/slider") @scope("Slider")
  external make: React.component<Types.props<'value, 'checked>> = "Thumb"
}

module Indicator = {
  @module("@base-ui/react/slider") @scope("Slider")
  external make: React.component<Types.props<'value, 'checked>> = "Indicator"
}
