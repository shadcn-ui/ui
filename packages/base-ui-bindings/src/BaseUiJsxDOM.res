type element = Jsx.element

type component<'props> = Jsx.component<'props>

type componentLike<'props, 'return> = Jsx.componentLike<'props, 'return>

@module("react/jsx-runtime")
external jsx: (component<'props>, 'props) => element = "jsx"

@module("react/jsx-runtime")
external jsxKeyed: (component<'props>, 'props, ~key: string=?, @ignore unit) => element = "jsx"

@module("react/jsx-runtime")
external jsxs: (component<'props>, 'props) => element = "jsxs"

@module("react/jsx-runtime")
external jsxsKeyed: (component<'props>, 'props, ~key: string=?, @ignore unit) => element = "jsxs"

/* These identity functions and static values below are optional, but lets 
you move things easily to the `element` type. The only required thing to 
define though is `array`, which the JSX transform will output. */
external array: array<element> => element = "%identity"
@val external null: element = "null"

external float: float => element = "%identity"
external int: int => element = "%identity"
external string: string => element = "%identity"

/* These are needed for Fragment (<> </>) support */
type fragmentProps = {children?: element}

@module("react/jsx-runtime") external jsxFragment: component<fragmentProps> = "Fragment"

/* The Elements module is the equivalent to the ReactDOM module in React. This holds things relevant to _lowercase_ JSX elements. */
module Elements = {
  /* Here you can control what props lowercase JSX elements should have. 
  A base that the React JSX transform uses is provided via JsxDOM.domProps, 
  but you can make this anything. The editor tooling will support 
  autocompletion etc for your specific type. */
  type props = Types.DomProps.t

  @module("react/jsx-runtime")
  external jsx: (string, props) => Jsx.element = "jsx"

  @module("react/jsx-runtime")
  external div: (string, props) => Jsx.element = "jsx"

  @module("react/jsx-runtime")
  external jsxKeyed: (string, props, ~key: string=?, @ignore unit) => Jsx.element = "jsx"

  @module("react/jsx-runtime")
  external jsxs: (string, props) => Jsx.element = "jsxs"

  @module("react/jsx-runtime")
  external jsxsKeyed: (string, props, ~key: string=?, @ignore unit) => Jsx.element = "jsxs"

  external someElement: element => option<element> = "%identity"
}
