@@directive("'use client'")

open BaseUi.Types

module CalendarPrimitive = {
  module Calendar = {
    @module("../../../apps/v4/examples/base/ui/calendar")
    external make: React.component<propsWithOptionalChildren<string, bool>> = "Calendar"
  }

  module DayButton = {
    @module("../../../apps/v4/examples/base/ui/calendar")
    external make: React.component<propsWithOptionalChildren<string, bool>> = "CalendarDayButton"
  }
}

@react.componentWithProps
let make = (props: propsWithOptionalChildren<string, bool>) => <CalendarPrimitive.Calendar {...props} />

module DayButton = {
  @react.componentWithProps
  let make = (props: propsWithOptionalChildren<string, bool>) => <CalendarPrimitive.DayButton {...props} />
}
