type params<'state> = {
  render?: React.element,
  props?: Types.props<string, bool>,
  state?: 'state,
  defaultTagName?: string,
  enabled?: bool,
}

@module("@base-ui/react/use-render")
external use: params<'state> => React.element = "useRender"
