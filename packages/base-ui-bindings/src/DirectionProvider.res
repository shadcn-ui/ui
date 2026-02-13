@module("@base-ui/react/direction-provider")
external make: React.component<Types.props<'value, 'checked>> = "DirectionProvider"

@module("@base-ui/react/direction-provider")
external useDirection: unit => Types.textDirection = "useDirection"
