@@directive("'use client'")

@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

open BaseUi.Types

module Locale = {
  type t = private {
    code: string,
  }
}

type day = {date: Date.t}

type dayModifiers = {
  focused?: bool,
  selected?: bool,
  @as("range_start") rangeStart?: bool,
  @as("range_end") rangeEnd?: bool,
  @as("range_middle") rangeMiddle?: bool,
}

type dayButtonProps = {
  className?: string,
  children?: React.element,
  day: day,
  modifiers: dayModifiers,
  locale?: Locale.t,
  id?: string,
  style?: ReactDOM.Style.t,
  disabled?: bool,
  tabIndex?: int,
  onClick?: JsxEvent.Mouse.t => unit,
  onKeyDown?: JsxEvent.Keyboard.t => unit,
  @as("type") type_?: string,
  @as("aria-label") ariaLabel?: string,
}

type chevronProps = {
  className?: string,
  size?: int,
  disabled?: bool,
  orientation?: string,
}

type dayPickerComponents = {
  @as("Chevron") chevron: chevronProps => React.element,
  @as("DayButton") dayButton: dayButtonProps => React.element,
}

type dayPickerClassNames = {
  root: string,
  months: string,
  month: string,
  nav: string,
  button_previous: string,
  button_next: string,
  month_caption: string,
  dropdowns: string,
  dropdown_root: string,
  dropdown: string,
  caption_label: string,
  table: string,
  weekdays: string,
  weekday: string,
  week: string,
  week_number_header: string,
  week_number: string,
  day: string,
  range_start: string,
  range_middle: string,
  range_end: string,
  today: string,
  outside: string,
  disabled: string,
  hidden: string,
}

type dayPickerFormatters = {
  formatMonthDropdown: Date.t => string,
}

@module("react-day-picker")
external getDefaultClassNames: unit => dayPickerClassNames = "getDefaultClassNames"

module DayPicker = {
  @react.component @module("react-day-picker")
  external make: (
    ~showOutsideDays: bool=?,
    ~className: string=?,
    ~captionLayout: string=?,
    ~locale: Locale.t=?,
    ~formatters: dayPickerFormatters=?,
    ~classNames: dayPickerClassNames=?,
    ~mode: string=?,
    ~selected: 'selected=?,
    ~onSelect: 'selected => unit=?,
    ~defaultMonth: Date.t=?,
    ~month: Date.t=?,
    ~onMonthChange: Date.t => unit=?,
    ~numberOfMonths: int=?,
    ~showWeekNumber: bool=?,
    ~fixedWeeks: bool=?,
    ~disabled: JSON.t=?,
    ~modifiers: JSON.t=?,
    ~modifiersClassNames: JSON.t=?,
    ~components: dayPickerComponents=?,
  ) => React.element = "DayPicker"
}

let appendClass = (base: string, extra: string) => extra == "" ? base : `${base} ${extra}`

module DayButton = {
  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~day,
    ~modifiers,
    ~locale: option<Locale.t>=?,
    ~id=?,
    ~style=?,
    ~disabled=?,
    ~tabIndex=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~type_="button",
    ~ariaLabel=?,
  ) => {
    let defaultClassNames = getDefaultClassNames()
    let dataDay = switch locale {
    | Some({code}) => Date.toLocaleDateStringWithLocale(day.date, code)
    | None => Date.toLocaleDateString(day.date)
    }
    let selected = modifiers.selected->Option.getOr(false)
    let rangeStart = modifiers.rangeStart->Option.getOr(false)
    let rangeEnd = modifiers.rangeEnd->Option.getOr(false)
    let rangeMiddle = modifiers.rangeMiddle->Option.getOr(false)
    <button
      ?id
      ?style
      ?disabled
      ?tabIndex
      ?onClick
      ?onKeyDown
      type_
      ?ariaLabel
      dataDay
      dataSelectedSingle={selected && !rangeStart && !rangeEnd && !rangeMiddle}
      dataRangeStart=rangeStart
      dataRangeEnd=rangeEnd
      dataRangeMiddle=rangeMiddle
      className={`${Button.buttonVariants(
          ~variant=Variant.Ghost,
          ~size=Size.Icon,
        )} data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-muted data-[range-middle=true]:text-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 dark:hover:text-foreground relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-(--cell-radius) data-[range-end=true]:rounded-r-(--cell-radius) data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-(--cell-radius) data-[range-start=true]:rounded-l-(--cell-radius) [&>span]:text-xs [&>span]:opacity-70 ${defaultClassNames.day} ${className}`}
      ?children
    />
  }
}

@react.component
let make = (
  ~className="",
  ~showOutsideDays=true,
  ~captionLayout="label",
  ~buttonVariant=Variant.Ghost,
  ~mode=?,
  ~selected: option<'selected>=?,
  ~onSelect: option<'selected => unit>=?,
  ~defaultMonth=?,
  ~month=?,
  ~onMonthChange=?,
  ~locale: option<Locale.t>=?,
  ~showWeekNumber=false,
  ~numberOfMonths=?,
  ~fixedWeeks=?,
  ~disabled=?,
  ~modifiers=?,
  ~modifiersClassNames=?,
) => {
  let defaultClassNames = getDefaultClassNames()
  let captionLabelClass =
    captionLayout == "label"
      ? "text-sm"
      : "cn-calendar-caption-label rounded-(--cell-radius) flex items-center gap-1 text-sm [&>svg]:text-muted-foreground [&>svg]:size-3.5"
  let hasWeekNumber = showWeekNumber
  let daySelectedClass = hasWeekNumber
    ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-(--cell-radius)"
    : "[&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)"
  let classNames: dayPickerClassNames = {
    root: appendClass("w-fit", defaultClassNames.root),
    months: appendClass("flex gap-4 flex-col md:flex-row relative", defaultClassNames.months),
    month: appendClass("flex flex-col w-full gap-4", defaultClassNames.month),
    nav: appendClass(
      "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
      defaultClassNames.nav,
    ),
    button_previous: appendClass(
      `${Button.buttonVariants(
          ~variant=buttonVariant,
        )} size-(--cell-size) aria-disabled:opacity-50 p-0 select-none`,
      defaultClassNames.button_previous,
    ),
    button_next: appendClass(
      `${Button.buttonVariants(
          ~variant=buttonVariant,
        )} size-(--cell-size) aria-disabled:opacity-50 p-0 select-none`,
      defaultClassNames.button_next,
    ),
    month_caption: appendClass(
      "flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)",
      defaultClassNames.month_caption,
    ),
    dropdowns: appendClass(
      "w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5",
      defaultClassNames.dropdowns,
    ),
    dropdown_root: appendClass(
      "relative cn-calendar-dropdown-root rounded-(--cell-radius)",
      defaultClassNames.dropdown_root,
    ),
    dropdown: appendClass("absolute bg-popover inset-0 opacity-0", defaultClassNames.dropdown),
    caption_label: appendClass(
      `select-none font-medium ${captionLabelClass}`,
      defaultClassNames.caption_label,
    ),
    table: "w-full border-collapse",
    weekdays: appendClass("flex", defaultClassNames.weekdays),
    weekday: appendClass(
      "text-muted-foreground rounded-(--cell-radius) flex-1 font-normal text-[0.8rem] select-none",
      defaultClassNames.weekday,
    ),
    week: appendClass("flex w-full mt-2", defaultClassNames.week),
    week_number_header: appendClass(
      "select-none w-(--cell-size)",
      defaultClassNames.week_number_header,
    ),
    week_number: appendClass(
      "text-[0.8rem] select-none text-muted-foreground",
      defaultClassNames.week_number,
    ),
    day: appendClass(
      `relative w-full rounded-(--cell-radius) h-full p-0 text-center [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius) group/day aspect-square select-none ${daySelectedClass}`,
      defaultClassNames.day,
    ),
    range_start: appendClass(
      "rounded-l-(--cell-radius) bg-muted relative after:bg-muted after:absolute after:inset-y-0 after:w-4 after:right-0 z-0 isolate",
      defaultClassNames.range_start,
    ),
    range_middle: appendClass("rounded-none", defaultClassNames.range_middle),
    range_end: appendClass(
      "rounded-r-(--cell-radius) bg-muted relative after:bg-muted after:absolute after:inset-y-0 after:w-4 after:left-0 z-0 isolate",
      defaultClassNames.range_end,
    ),
    today: appendClass(
      "bg-muted text-foreground rounded-(--cell-radius) data-[selected=true]:rounded-none",
      defaultClassNames.today,
    ),
    outside: appendClass(
      "text-muted-foreground aria-selected:text-muted-foreground",
      defaultClassNames.outside,
    ),
    disabled: appendClass("text-muted-foreground opacity-50", defaultClassNames.disabled),
    hidden: appendClass("invisible", defaultClassNames.hidden),
  }
  let formatters: dayPickerFormatters = {
    formatMonthDropdown: date =>
      switch locale {
      | Some({code}) => date->Date.toLocaleDateStringWithLocaleAndOptions(code, {month: #short})
      | None => date->Date.toLocaleDateStringWithLocaleAndOptions("default", {month: #short})
      },
  }
  let renderChevron = (props: chevronProps) => {
    let className = props.className->Option.getOr("")
    let size = props.size
    let orientation = props.orientation->Option.getOr("down")
    switch orientation {
    | "left" => <Icons.ChevronLeft className={appendClass("cn-rtl-flip size-4", className)} ?size />
    | "right" =>
      <Icons.ChevronRight className={appendClass("cn-rtl-flip size-4", className)} ?size />
    | _ => <Icons.ChevronDown className={appendClass("size-4", className)} ?size />
    }
  }
  let renderDayButton = (props: dayButtonProps) =>
    <DayButton
      className={props.className->Option.getOr("")}
      day={props.day}
      modifiers={props.modifiers}
      ?locale
      children=?props.children
      id=?props.id
      style=?props.style
      disabled=?props.disabled
      tabIndex=?props.tabIndex
      onClick=?props.onClick
      onKeyDown=?props.onKeyDown
      type_={props.type_->Option.getOr("button")}
      ariaLabel=?props.ariaLabel
    />
  let components: dayPickerComponents = {
    chevron: renderChevron,
    dayButton: renderDayButton,
  }
  <DayPicker
    showOutsideDays
    className={`bg-background group/calendar p-2 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(7)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent rtl:**:[.rdp-button\\_next>svg]:rotate-180 rtl:**:[.rdp-button\\_previous>svg]:rotate-180 ${className}`}
    captionLayout
    ?locale
    formatters
    classNames
    ?mode
    ?selected
    ?onSelect
    ?defaultMonth
    ?month
    ?onMonthChange
    ?numberOfMonths
    showWeekNumber
    ?fixedWeeks
    ?disabled
    ?modifiers
    ?modifiersClassNames
    components
  />
}
