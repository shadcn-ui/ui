/** Shared types for Base UI ReScript bindings. */
type eventDetails = JSON.t
type htmlProps = JSON.t

@unboxed
type side =
  | @as("top") Top
  | @as("bottom") Bottom
  | @as("left") Left
  | @as("right") Right
  | @as("inline-start") InlineStart
  | @as("inline-end") InlineEnd

@unboxed
type align =
  | @as("start") Start
  | @as("center") Center
  | @as("end") End

@unboxed
type orientation =
  | @as("horizontal") Horizontal
  | @as("vertical") Vertical

@unboxed
type modal =
  | Modal(bool)
  | @as("trap-focus") TrapFocus

@unboxed
type checkedState =
  | Checked(bool)
  | @as("indeterminate") Indeterminate

@unboxed
type positionMethod =
  | @as("absolute") Absolute
  | @as("fixed") Fixed

@unboxed
type thumbAlignment =
  | @as("center") ThumbCenter
  | @as("edge") ThumbEdge
  | @as("edge-client-only") ThumbEdgeClientOnly

@unboxed
type thumbCollisionBehavior =
  | @as("push") Push
  | @as("swap") Swap
  | @as("none") NoCollisionBehavior

@unboxed
type textDirection =
  | @as("ltr") Ltr
  | @as("rtl") Rtl

type props<'value, 'checked> = {
  children?: React.element,
  className?: string,
  style?: ReactDOM.Style.t,
  ratio?: float,
  render?: React.element,
  id?: string,
  name?: string,
  label?: string,
  title?: string,
  description?: string,
  placeholder?: string,
  containerClassName?: string,
  showCloseButton?: bool,
  spellCheck?: bool,
  withHandle?: bool,
  theme?: string,
  onClick?: JsxEvent.Mouse.t => unit,
  onKeyDown?: JsxEvent.Keyboard.t => unit,
  onKeyDownCapture?: JsxEvent.Keyboard.t => unit,
  errors?: array<{message?: string}>,
  @as("open") open_?: bool,
  defaultOpen?: bool,
  onOpenChange?: (bool, eventDetails) => unit,
  onOpenChangeComplete?: bool => unit,
  value?: 'value,
  defaultValue?: 'value,
  onValueChange?: ('value, eventDetails) => unit,
  checked?: 'checked,
  defaultChecked?: 'checked,
  onCheckedChange?: ('checked, eventDetails) => unit,
  disabled?: bool,
  readOnly?: bool,
  required?: bool,
  indeterminate?: bool,
  multiple?: bool,
  modal?: modal,
  orientation?: orientation,
  side?: side,
  sideOffset?: float,
  align?: align,
  alignOffset?: float,
  alignItemWithTrigger?: bool,
  loopFocus?: bool,
  delay?: float,
  closeDelay?: float,
  keepMounted?: bool,
  forceRender?: bool,
  closeOnClick?: bool,
  focusableWhenDisabled?: bool,
  nativeButton?: bool,
  initialFocus?: htmlProps,
  finalFocus?: htmlProps,
  container?: Dom.element,
  anchor?: htmlProps,
  positionMethod?: positionMethod,
  href?: string,
  target?: string,
  src?: string,
  alt?: string,
  index?: int,
  tabIndex?: int,
  inputValue?: string,
  onInputValueChange?: (string, eventDetails) => unit,
  onItemHighlighted?: ('value, eventDetails) => unit,
  itemToStringLabel?: 'value => string,
  itemToStringValue?: 'value => string,
  isItemEqualToValue?: ('value, 'value) => bool,
  items?: array<'value>,
  item?: 'value,
  xStart?: float,
  xEnd?: float,
  yStart?: float,
  yEnd?: float,
  activateOnFocus?: bool,
  renderBeforeHydration?: bool,
  timeout?: float,
  max?: float,
  min?: float,
  step?: float,
  largeStep?: float,
  thumbAlignment?: thumbAlignment,
  thumbCollisionBehavior?: thumbCollisionBehavior,
  @as("type") type_?: string,
  @as("aria-label") ariaLabel?: string,
  @as("aria-current") ariaCurrent?: string,
  @as("aria-hidden") ariaHidden?: bool,
  @as("data-slot") dataSlot?: string,
  @as("data-sidebar") dataSidebar?: string,
  @as("data-side") dataSide?: string,
  @as("data-align") dataAlign?: string,
  @as("data-icon") dataIcon?: string,
  @as("data-mobile") dataMobile?: string,
  @as("data-chips") dataChips?: bool,
  @as("data-collapsible") dataCollapsible?: string,
  @as("data-content") dataContent?: bool,
  @as("data-chart") dataChart?: string,
  @as("data-day") dataDay?: string,
  @as("data-active") dataActive?: bool,
  @as("data-selected-single") dataSelectedSingle?: bool,
  @as("data-range-start") dataRangeStart?: bool,
  @as("data-range-end") dataRangeEnd?: bool,
  @as("data-range-middle") dataRangeMiddle?: bool,
  @as("data-size") dataSize?: string,
  @as("data-variant") dataVariant?: string,
  @as("data-state") dataState?: string,
  @as("data-orientation") dataOrientation?: string,
  @as("data-align-trigger") dataAlignTrigger?: bool,
  @as("data-spacing") dataSpacing?: float,
  @as("data-inset") dataInset?: bool,
}
