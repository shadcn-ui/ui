type params<'state> = JSON.t

@obj
external makeParams: (
  ~render: React.element=?,
  ~props: Types.htmlProps=?,
  ~state: 'state=?,
  ~defaultTagName: string=?,
  ~enabled: bool=?,
  unit,
) => params<'state> = ""

@module("@base-ui/react/use-render")
external unsafeUseRender: params<'state> => React.element = "useRender"

let useRender = (~render=?, ~props=?, ~state=?, ~defaultTagName=?, ~enabled=?, ()) =>
  unsafeUseRender(makeParams(~render?, ~props?, ~state?, ~defaultTagName?, ~enabled?, ()))
