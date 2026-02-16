@module("@base-ui/react/direction-provider")
external make: React.component<Types.propsWithChildren<'value, 'checked>> = "DirectionProvider"

@module("@base-ui/react/direction-provider")
external useDirection: unit => Types.TextDirection.t = "useDirection"
