module Root = {
  @module("@base-ui/react/accordion")
  @scope("Accordion")
  external make: React.component<Types.props<'value, 'checked>> = "Root"
}

module Item = {
  @module("@base-ui/react/accordion")
  @scope("Accordion")
  external make: React.component<Types.props<'value, 'checked>> = "Item"
}

module Header = {
  @module("@base-ui/react/accordion")
  @scope("Accordion")
  external make: React.component<Types.props<'value, 'checked>> = "Header"
}

module Trigger = {
  @module("@base-ui/react/accordion")
  @scope("Accordion")
  external make: React.component<Types.props<'value, 'checked>> = "Trigger"
}

module Panel = {
  @module("@base-ui/react/accordion")
  @scope("Accordion")
  external make: React.component<Types.props<'value, 'checked>> = "Panel"
}
