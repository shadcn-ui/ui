/** Shared types for Base UI ReScript bindings. */
type eventDetails = JSON.t

module Side = {
  @unboxed
  type t =
    | @as("top") Top
    | @as("bottom") Bottom
    | @as("left") Left
    | @as("right") Right
    | @as("inline-start") InlineStart
    | @as("inline-end") InlineEnd
}

module Align = {
  @unboxed
  type t =
    | @as("start") Start
    | @as("center") Center
    | @as("end") End
}

module Orientation = {
  @unboxed
  type t =
    | @as("horizontal") Horizontal
    | @as("vertical") Vertical
}

module Modal = {
  @unboxed
  type t =
    | Bool(bool)
    | @as("trap-focus") TrapFocus
}

module CheckedState = {
  @unboxed
  type t =
    | Checked(bool)
    | @as("indeterminate") Indeterminate
}

module PositionMethod = {
  @unboxed
  type t =
    | @as("absolute") Absolute
    | @as("fixed") Fixed
}

module ThumbAlignment = {
  @unboxed
  type t =
    | @as("center") Center
    | @as("edge") Edge
    | @as("edge-client-only") EdgeClientOnly
}

module ThumbCollisionBehavior = {
  @unboxed
  type t =
    | @as("push") Push
    | @as("swap") Swap
    | @as("none") None
}

module TextDirection = {
  @unboxed
  type t =
    | @as("ltr") Ltr
    | @as("rtl") Rtl
}

module DataOrientation = {
  @unboxed
  type t =
    | @as("horizontal") Horizontal
    | @as("vertical") Vertical
    | @as("responsive") Responsive
}

module ExtraDomProps = {
  type t = {
    onKeyDownCapture?: JsxEvent.Keyboard.t => unit,
    @as("data-slot") dataSlot?: string,
    @as("data-sidebar") dataSidebar?: string,
    @as("data-side") dataSide?: string,
    @as("data-align") dataAlign?: string,
    @as("data-icon") dataIcon?: string,
    @as("data-mobile") dataMobile?: string,
    @as("data-chips") dataChips?: bool,
    @as("data-collapsible") dataCollapsible?: string,
    @as("data-content") dataContent?: bool,
    @as("data-disabled") dataDisabled?: bool,
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
}

module DomProps = {
  type t = {
    ...JsxDOM.domProps,
    ...ExtraDomProps.t,
  }
}

type props<'value, 'checked> = {
  children?: React.element,
  className?: string,
  style?: ReactDOM.Style.t,
  ratio?: float,
  render?: React.element,
  content?: React.element,
  id?: string,
  name?: string,
  label?: string,
  heading?: string,
  title?: string,
  role?: string,
  description?: string,
  placeholder?: string,
  locale?: string,
  mode?: string,
  captionLayout?: string,
  containerClassName?: string,
  showCloseButton?: bool,
  showOnHover?: bool,
  spellCheck?: bool,
  withHandle?: bool,
  theme?: string,
  onClick?: JsxEvent.Mouse.t => unit,
  onKeyDown?: JsxEvent.Keyboard.t => unit,
  ref?: ReactDOM.Ref.t,
  errors?: array<{message?: string}>,
  @as("open") open_?: bool,
  defaultOpen?: bool,
  onOpenChange?: (bool, eventDetails) => unit,
  onOpenChangeComplete?: bool => unit,
  value?: 'value,
  defaultValue?: 'value,
  defaultSize?: string,
  onValueChange?: ('value, eventDetails) => unit,
  checked?: 'checked,
  defaultChecked?: 'checked,
  onCheckedChange?: ('checked, eventDetails) => unit,
  selected?: Date.t,
  onSelect?: Date.t => unit,
  disabled?: bool,
  readOnly?: bool,
  required?: bool,
  indeterminate?: bool,
  multiple?: bool,
  modal?: Modal.t,
  orientation?: Orientation.t,
  side?: Side.t,
  sideOffset?: float,
  align?: Align.t,
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
  asChild?: bool,
  container?: Dom.element,
  anchor?: ReactDOM.domRef,
  positionMethod?: PositionMethod.t,
  href?: string,
  target?: string,
  htmlFor?: string,
  src?: string,
  alt?: string,
  index?: int,
  maxLength?: int,
  colSpan?: int,
  tabIndex?: int,
  inputValue?: string,
  onBlur?: ReactEvent.Focus.t => unit,
  onFocus?: ReactEvent.Focus.t => unit,
  onMouseEnter?: ReactEvent.Mouse.t => unit,
  onMouseLeave?: ReactEvent.Mouse.t => unit,
  onInputValueChange?: (string, eventDetails) => unit,
  onItemHighlighted?: ('value, eventDetails) => unit,
  itemToStringLabel?: 'value => string,
  itemToStringValue?: 'value => string,
  nameKey?: string,
  labelFormatter?: string => string,
  tickFormatter?: string => string,
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
  thumbAlignment?: ThumbAlignment.t,
  thumbCollisionBehavior?: ThumbCollisionBehavior.t,
  @as("type") type_?: string,
  @as("aria-label") ariaLabel?: string,
  @as("aria-current")
  ariaCurrent?: [#page | #step | #location | #date | #time | #"true" | #"false"],
  @as("aria-details")
  ariaDetails?: string,
  @as("aria-disabled")
  ariaDisabled?: bool,
  @as("aria-roledescription")
  ariaRoledescription?: string,
  @as("aria-hidden")
  ariaHidden?: bool,
  ...ExtraDomProps.t,
}
