type drawerDatum = {goal: int}

module Recharts = {
  type responsiveContainerProps = {
    width: string,
    height: string,
    children: React.element,
  }

  module ResponsiveContainer = {
    @module("recharts")
    external make: React.component<responsiveContainerProps> = "ResponsiveContainer"
  }

  type barChartProps = {
    data: array<drawerDatum>,
    children: React.element,
  }

  module BarChart = {
    @module("recharts")
    external make: React.component<barChartProps> = "BarChart"
  }

  type barStyle = {@as("fill") fill: string}
  external toStyle: barStyle => ReactDOM.Style.t = "%identity"

  type barProps = {
    dataKey: string,
    style?: ReactDOM.Style.t,
  }

  module Bar = {
    @module("recharts")
    external make: React.component<barProps> = "Bar"
  }
}

let data: array<drawerDatum> = [
  {goal: 400},
  {goal: 300},
  {goal: 200},
  {goal: 300},
  {goal: 200},
  {goal: 278},
  {goal: 189},
  {goal: 239},
  {goal: 300},
  {goal: 200},
  {goal: 278},
  {goal: 189},
  {goal: 349},
]

@react.component
let make = () => {
  let goal = 350
  <Drawer>
    <Drawer.Trigger asChild={true}>
      <Button dataVariant=BaseUi.Types.Variant.Outline>{"Open Drawer"->React.string}</Button>
    </Drawer.Trigger>
    <Drawer.Content>
      <div className="mx-auto w-full max-w-sm">
        <Drawer.Header>
          <Drawer.Title>{"Move Goal"->React.string}</Drawer.Title>
          <Drawer.Description>{"Set your daily activity goal."->React.string}</Drawer.Description>
        </Drawer.Header>
        <div className="p-4 pb-0">
          <div className="flex items-center justify-center space-x-2">
            <Button
              dataVariant=BaseUi.Types.Variant.Outline
              dataSize=BaseUi.Types.Size.Icon
              className="h-8 w-8 shrink-0 rounded-full"
              onClick={_ => ()}
              disabled={goal <= 200}
            >
              <Icons.Minus />
              <span className="sr-only">{"Decrease"->React.string}</span>
            </Button>
            <div className="flex-1 text-center">
              <div className="text-7xl font-bold tracking-tighter">{Int.toString(goal)->React.string}</div>
              <div className="text-muted-foreground text-[0.70rem] uppercase">
                {"Calories/day"->React.string}
              </div>
            </div>
            <Button
              dataVariant=BaseUi.Types.Variant.Outline
              dataSize=BaseUi.Types.Size.Icon
              className="h-8 w-8 shrink-0 rounded-full"
              onClick={_ => ()}
              disabled={goal >= 400}
            >
              <Icons.Plus />
              <span className="sr-only">{"Increase"->React.string}</span>
            </Button>
          </div>
          <div className="mt-3 h-[120px]">
            <Recharts.ResponsiveContainer width="100%" height="100%">
              <Recharts.BarChart data>
                <Recharts.Bar
                  dataKey="goal"
                  style={Recharts.toStyle({fill: "var(--chart-1)"})}
                />
              </Recharts.BarChart>
            </Recharts.ResponsiveContainer>
          </div>
        </div>
        <Drawer.Footer>
          <Button>{"Submit"->React.string}</Button>
          <Drawer.Close asChild={true}>
            <Button dataVariant=BaseUi.Types.Variant.Outline>{"Cancel"->React.string}</Button>
          </Drawer.Close>
        </Drawer.Footer>
      </div>
    </Drawer.Content>
  </Drawer>
}
