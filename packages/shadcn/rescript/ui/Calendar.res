@@directive("'use client'")

@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

@module("tailwind-merge")
external twMerge: string => string = "twMerge"

@send external focusElement: Dom.element => unit = "focus"

module DayPickerClassNames = {
  type t = {
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
}

@module("react-day-picker")
external getDefaultClassNames: unit => DayPickerClassNames.t = "getDefaultClassNames"

module Locale = {
  type t = private {
    code: string,
  }
}

module Day = {
  type t = {date: Date.t}
}

module DayModifiers = {
  type t = {
    focused?: bool,
    selected?: bool,
    @as("range_start") rangeStart?: bool,
    @as("range_end") rangeEnd?: bool,
    @as("range_middle") rangeMiddle?: bool,
  }
}

module Orientation = {
  type t =
    | @as("left") Left
    | @as("right") Right
    | @as("up") Up
    | @as("down") Down
}

module ChevronProps = {
  type t = {
    ...Icons.props,
    orientation?: Orientation.t,
  }
}

module RootProps = {
  type t = {
    className?: string,
    children?: React.element,
    rootRef?: JsxDOM.domRef,
    id?: string,
    style?: ReactDOM.Style.t,
    onClick?: JsxEvent.Mouse.t => unit,
    onKeyDown?: JsxEvent.Keyboard.t => unit,
  }
}

module WeekNumberProps = {
  type t = {
    className?: string,
    children?: React.element,
  }
}

module Modifiers = {
  type t = {
    selected?: bool,
    disabled?: bool,
    today?: bool,
  }
}

module DayButtonProps = {
  type t = {
    className?: string,
    children?: React.element,
    day: Day.t,
    modifiers: DayModifiers.t,
    locale: option<Locale.t>,
    id?: string,
    style?: ReactDOM.Style.t,
    disabled?: bool,
    tabIndex?: int,
    onClick?: JsxEvent.Mouse.t => unit,
    onKeyDown?: JsxEvent.Keyboard.t => unit,
    onBlur?: ReactEvent.Focus.t => unit,
    onFocus?: ReactEvent.Focus.t => unit,
    onMouseEnter?: ReactEvent.Mouse.t => unit,
    onMouseLeave?: ReactEvent.Mouse.t => unit,
    type_?: string,
    ariaLabel?: string,
  }
}

module Props = {
  type t = {
    modifiers?: Modifiers.t,
    ...JsxDOM.domProps,
  }
}

module DayButton = {
  @react.componentWithProps
  let make = ({
    DayButtonProps.className: ?className,
    ?children,
    day,
    modifiers,
    locale,
    ?id,
    ?style,
    ?disabled,
    ?tabIndex,
    ?onClick,
    ?onKeyDown,
    ?onBlur,
    ?onFocus,
    ?onMouseEnter,
    ?onMouseLeave,
    ?type_,
    ?ariaLabel,
  }) => {
    let defaultClassNames = getDefaultClassNames()
    let buttonRef = React.useRef(null)
    React.useEffect(() => {
      if modifiers.focused->Option.getOr(false) {
        buttonRef.current->Nullable.forEach(focusElement)
      }
      None
    }, [modifiers.focused])
    <BaseUi.Button
      ?id
      ?style
      ?disabled
      ?tabIndex
      ?onClick
      ?onKeyDown
      ?onBlur
      ?onFocus
      ?onMouseEnter
      ?onMouseLeave
      ?type_
      ?ariaLabel
      ref={buttonRef->ReactDOM.Ref.domRef}
      dataDay={switch locale {
      | Some({code}) => Date.toLocaleDateStringWithLocale(day.Day.date, code)
      | None => Date.toLocaleDateString(day.Day.date)
      }}
      dataSelectedSingle={modifiers.selected->Option.getOr(false) &&
      !(modifiers.rangeStart->Option.getOr(false)) &&
      !(modifiers.rangeEnd->Option.getOr(false)) &&
      !(modifiers.rangeMiddle->Option.getOr(false))}
      dataRangeStart=?{modifiers.rangeStart}
      dataRangeEnd=?{modifiers.rangeEnd}
      dataRangeMiddle=?{modifiers.rangeMiddle}
      className={`${Button.buttonVariants(
          ~variant=Button.Variant.Ghost,
          ~size=Button.Size.Icon,
        )} data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground 
          data-[range-middle=true]:bg-muted data-[range-middle=true]:text-foreground 
          data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground 
          data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground
          group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 
          dark:hover:text-foreground relative isolate z-10 flex aspect-square size-auto w-full 
          min-w-(--cell-size) flex-col gap-1 border-0 leading-none font-normal 
          group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 
          group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-(--cell-radius) 
          data-[range-end=true]:rounded-r-(--cell-radius) data-[range-middle=true]:rounded-none 
          data-[range-start=true]:rounded-(--cell-radius) data-[range-start=true]:rounded-l-(--cell-radius) 
          [&>span]:text-xs [&>span]:opacity-70 ${defaultClassNames.day} ${className->Option.getOr(
          "",
        )}`}
      ?children
    />
  }
}

type componentRenderer = Props.t => React.element

module DayPickerClassNamesOverride = {
  type t = {
    root?: string,
    months?: string,
    month?: string,
    nav?: string,
    button_previous?: string,
    button_next?: string,
    month_caption?: string,
    dropdowns?: string,
    dropdown_root?: string,
    dropdown?: string,
    caption_label?: string,
    table?: string,
    weekdays?: string,
    weekday?: string,
    week?: string,
    week_number_header?: string,
    week_number?: string,
    day?: string,
    range_start?: string,
    range_middle?: string,
    range_end?: string,
    today?: string,
    outside?: string,
    disabled?: string,
    hidden?: string,
  }
}
module DayPickerFormattersOverride = {
  type t = {
    formatMonthDropdown?: Date.t => string,
    formatCaption?: (Date.t, Locale.t) => string,
    formatDay?: (Date.t, Locale.t) => string,
    formatWeekdayName?: (Date.t, Locale.t) => string,
    formatWeekNumber?: int => string,
    formatYearDropdown?: int => string,
    formatMonthCaption?: (Date.t, Locale.t) => string,
  }
}

module DayPickerComponentsOverride = {
  type t = {
    @as("Root") root?: RootProps.t => React.element,
    @as("Chevron") chevron?: ChevronProps.t => React.element,
    @as("DayButton") dayButton?: DayButtonProps.t => React.element,
    @as("WeekNumber") weekNumber?: WeekNumberProps.t => React.element,
    @as("Months") months?: componentRenderer,
    @as("Month") month?: componentRenderer,
    @as("MonthCaption") monthCaption?: componentRenderer,
    @as("DropdownNav") dropdownNav?: componentRenderer,
    @as("Dropdown") dropdown?: componentRenderer,
    @as("CaptionLabel") captionLabel?: componentRenderer,
    @as("Nav") nav?: componentRenderer,
    @as("Weekdays") weekdays?: componentRenderer,
    @as("Weekday") weekday?: componentRenderer,
    @as("Week") week?: componentRenderer,
    @as("Day") day?: componentRenderer,
    @as("Footer") footer?: componentRenderer,
    @as("PreviousMonthButton") previousMonthButton?: componentRenderer,
    @as("NextMonthButton") nextMonthButton?: componentRenderer,
    @as("MonthGrid") monthGrid?: componentRenderer,
    @as("Select") select?: componentRenderer,
    @as("Option") option?: componentRenderer,
    @as("MonthsDropdown") monthsDropdown?: componentRenderer,
    @as("YearsDropdown") yearsDropdown?: componentRenderer,
    @as("Weeks") weeks?: componentRenderer,
    @as("WeekNumberHeader") weekNumberHeader?: componentRenderer,
    @as("Button") button?: componentRenderer,
  }
}

module CaptionLayout = {
  type t =
    | @as("label") Label
    | @as("dropdown") Dropdown
    | @as("dropdown-months") DropdownMonths
    | @as("dropdown-years") DropdownYears
}

module Labels = {
  type t = {
    labelNav: unit => string,
    labelGrid: Date.t => string,
    labelGridcell: (Date.t, ~modifiers: Modifiers.t=?) => string,
    labelMonthDropdown: unit => string,
    labelYearDropdown: unit => string,
    labelNext: (~nextMonth: Date.t=?) => string,
    labelPrevious: (~previousMonth: Date.t=?) => string,
    labelDayButton: (Date.t, ~modifiers: Modifiers.t=?) => string,
    labelWeekday: Date.t => string,
    labelWeekNumber: int => string,
    labelWeekNumberHeader: unit => string,
  }
}

module DayPicker = {
  @react.component @module("react-day-picker")
  external make: (
    ~showOutsideDays: bool=?,
    ~className: string=?,
    ~captionLayout: CaptionLayout.t=?,
    ~dir: string=?,
    ~locale: Locale.t=?,
    ~formatters: DayPickerFormattersOverride.t=?,
    ~classNames: DayPickerClassNames.t=?,
    ~required: bool=?,
    ~mode: string=?,
    ~selected: 'selected=?,
    ~onSelect: 'selected => unit=?,
    ~defaultMonth: Date.t=?,
    ~month: Date.t=?,
    ~onMonthChange: Date.t => unit=?,
    ~startMonth: Date.t=?,
    ~endMonth: Date.t=?,
    ~numberOfMonths: int=?,
    ~reverseMonths: bool=?,
    ~pagedNavigation: bool=?,
    ~navLayout: string=?,
    ~hideNavigation: bool=?,
    ~disableNavigation: bool=?,
    ~showWeekNumber: bool=?,
    ~fixedWeeks: bool=?,
    ~weekStartsOn: int=?,
    @as("ISOWeek") ~isoWeek: bool=?,
    ~fromDate: Date.t=?,
    ~toDate: Date.t=?,
    ~fromMonth: Date.t=?,
    ~toMonth: Date.t=?,
    ~fromYear: int=?,
    ~toYear: int=?,
    ~broadcastCalendar: bool=?,
    ~timeZone: string=?,
    ~animate: bool=?,
    ~autoFocus: bool=?,
    ~onDayClick: (Date.t, Modifiers.t, JsxEvent.Mouse.t) => unit=?,
    ~onNextClick: Date.t => unit=?,
    ~onPrevClick: Date.t => unit=?,
    ~styles: dict<ReactDOM.Style.t>=?,
    ~labels: Labels.t=?,
    ~hidden: Date.t => bool=?,
    ~footer: React.element=?,
    ~disabled: Date.t => bool=?,
    ~modifiers: dict<Date.t => bool>=?,
    ~modifiersClassNames: dict<string>=?,
    ~components: DayPickerComponentsOverride.t=?,
  ) => React.element = "DayPicker"
}

@react.component
let make = (
  ~className="",
  ~showOutsideDays=true,
  ~captionLayout=CaptionLayout.Label,
  ~dir=?,
  ~buttonVariant=Button.Variant.Ghost,
  ~required=?,
  ~mode=?,
  ~selected: option<'selected>=?,
  ~onSelect: option<'selected => unit>=?,
  ~defaultMonth=?,
  ~month=?,
  ~onMonthChange=?,
  ~startMonth=?,
  ~endMonth=?,
  ~locale: option<Locale.t>=?,
  ~showWeekNumber=false,
  ~numberOfMonths=?,
  ~reverseMonths=?,
  ~pagedNavigation=?,
  ~navLayout=?,
  ~hideNavigation=?,
  ~disableNavigation=?,
  ~fixedWeeks=?,
  ~weekStartsOn=?,
  ~isoWeek=?,
  ~fromDate=?,
  ~toDate=?,
  ~fromMonth=?,
  ~toMonth=?,
  ~fromYear=?,
  ~toYear=?,
  ~broadcastCalendar=?,
  ~timeZone=?,
  ~animate=?,
  ~autoFocus=?,
  ~onDayClick=?,
  ~onNextClick=?,
  ~onPrevClick=?,
  ~styles=?,
  ~labels=?,
  ~hidden=?,
  ~footer=?,
  ~disabled=?,
  ~modifiers=?,
  ~modifiersClassNames=?,
  ~classNames: DayPickerClassNamesOverride.t={},
  ~formatters: DayPickerFormattersOverride.t={},
  ~components: DayPickerComponentsOverride.t={},
) => {
  let defaultClassNames = getDefaultClassNames()

  <DayPicker
    showOutsideDays
    className={`bg-background group/calendar p-2 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(7)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent rtl:**:[.rdp-button\\_next>svg]:rotate-180 rtl:**:[.rdp-button\\_previous>svg]:rotate-180 ${className}`}
    captionLayout
    ?dir
    ?locale
    formatters={{
      ...formatters,
      formatMonthDropdown: formatters.formatMonthDropdown->Option.getOr(date =>
        switch locale {
        | Some({code}) => date->Date.toLocaleDateStringWithLocaleAndOptions(code, {month: #short})
        | None => date->Date.toLocaleDateStringWithLocaleAndOptions("default", {month: #short})
        }
      ),
    }}
    classNames={{
      root: classNames.root->Option.getOr(`w-fit ${defaultClassNames.root}`),
      months: classNames.months->Option.getOr(
        `flex gap-4 flex-col md:flex-row relative ${defaultClassNames.months}`,
      ),
      month: classNames.month->Option.getOr(
        `flex flex-col w-full gap-4 ${defaultClassNames.month}`,
      ),
      nav: classNames.nav->Option.getOr(
        `flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between ${defaultClassNames.nav}`,
      ),
      button_previous: classNames.button_previous->Option.getOr(
        `${Button.buttonVariants(
            ~variant=buttonVariant,
          )} size-(--cell-size) aria-disabled:opacity-50 p-0 select-none ${defaultClassNames.button_previous}`,
      ),
      button_next: classNames.button_next->Option.getOr(
        `${Button.buttonVariants(
            ~variant=buttonVariant,
          )} size-(--cell-size) aria-disabled:opacity-50 p-0 select-none ${defaultClassNames.button_next}`,
      ),
      month_caption: classNames.month_caption->Option.getOr(
        `flex items-center justify-center h-(--cell-size) w-full px-(--cell-size) ${defaultClassNames.month_caption}`,
      ),
      dropdowns: classNames.dropdowns->Option.getOr(
        `w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5 ${defaultClassNames.dropdowns}`,
      ),
      dropdown_root: classNames.dropdown_root->Option.getOr(
        `relative cn-calendar-dropdown-root rounded-(--cell-radius) ${defaultClassNames.dropdown_root}`,
      ),
      dropdown: classNames.dropdown->Option.getOr(
        `absolute bg-popover inset-0 opacity-0 ${defaultClassNames.dropdown}`,
      ),
      caption_label: classNames.caption_label->Option.getOr(
        `select-none font-medium ${switch captionLayout {
          | CaptionLayout.Label => "text-sm"
          | Dropdown
          | DropdownMonths
          | DropdownYears => "cn-calendar-caption-label rounded-(--cell-radius) flex items-center gap-1 text-sm [&>svg]:text-muted-foreground [&>svg]:size-3.5"
          }} ${defaultClassNames.caption_label}`,
      ),
      table: classNames.table->Option.getOr(`w-full border-collapse ${defaultClassNames.table}`),
      weekdays: classNames.weekdays->Option.getOr(`flex ${defaultClassNames.weekdays}`),
      weekday: classNames.weekday->Option.getOr(
        `text-muted-foreground rounded-(--cell-radius) flex-1 font-normal text-[0.8rem] select-none ${defaultClassNames.weekday}`,
      ),
      week: classNames.week->Option.getOr(`flex w-full mt-2 ${defaultClassNames.week}`),
      week_number_header: classNames.week_number_header->Option.getOr(
        `select-none w-(--cell-size) ${defaultClassNames.week_number_header}`,
      ),
      week_number: classNames.week_number->Option.getOr(
        `text-[0.8rem] select-none text-muted-foreground ${defaultClassNames.week_number}`,
      ),
      day: classNames.day->Option.getOr(
        `relative w-full rounded-(--cell-radius) h-full p-0 text-center [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius) group/day aspect-square select-none ${defaultClassNames.day}`,
      ),
      range_start: classNames.range_start->Option.getOr(
        `rounded-l-(--cell-radius) bg-muted relative after:bg-muted after:absolute after:inset-y-0 after:w-4 after:right-0 z-0 isolate ${defaultClassNames.range_start}`,
      ),
      range_middle: classNames.range_middle->Option.getOr(
        `rounded-none ${defaultClassNames.range_middle}`,
      ),
      range_end: classNames.range_end->Option.getOr(
        `rounded-r-(--cell-radius) bg-muted relative after:bg-muted after:absolute after:inset-y-0 after:w-4 after:left-0 z-0 isolate ${defaultClassNames.range_end}`,
      ),
      today: classNames.today->Option.getOr(
        `bg-muted text-foreground rounded-(--cell-radius) data-[selected=true]:rounded-none ${defaultClassNames.today}`,
      ),
      outside: classNames.outside->Option.getOr(
        `text-muted-foreground aria-selected:text-muted-foreground ${defaultClassNames.outside}`,
      ),
      disabled: classNames.disabled->Option.getOr(
        `text-muted-foreground opacity-50 ${defaultClassNames.disabled}`,
      ),
      hidden: classNames.hidden->Option.getOr(`invisible ${defaultClassNames.hidden}`),
    }}
    ?required
    ?mode
    ?selected
    ?onSelect
    ?defaultMonth
    ?month
    ?onMonthChange
    ?startMonth
    ?endMonth
    ?numberOfMonths
    ?reverseMonths
    ?pagedNavigation
    ?navLayout
    ?hideNavigation
    ?disableNavigation
    showWeekNumber
    ?fixedWeeks
    ?weekStartsOn
    ?isoWeek
    ?fromDate
    ?toDate
    ?fromMonth
    ?toMonth
    ?fromYear
    ?toYear
    ?broadcastCalendar
    ?timeZone
    ?animate
    ?autoFocus
    ?onDayClick
    ?onNextClick
    ?onPrevClick
    ?styles
    ?labels
    ?hidden
    ?footer
    ?disabled
    ?modifiers
    ?modifiersClassNames
    components={{
      root: components.root->Option.getOr(({
        ?className,
        ?children,
        ?rootRef,
        ?id,
        ?style,
        ?onClick,
        ?onKeyDown,
      }) =>
        <div dataSlot="calendar" ref=?rootRef ?className ?children ?id ?style ?onClick ?onKeyDown />
      ),
      chevron: (props: ChevronProps.t) => {
        let className = props.className->Option.getOr("")
        let orientation = props.orientation
        let props = (props :> Icons.props)
        switch orientation {
        | Some(Left) =>
          <Icons.ChevronLeft {...props} className={`cn-rtl-flip size-4 ${className}`} />
        | Some(Right) =>
          <Icons.ChevronRight {...props} className={`cn-rtl-flip size-4 ${className}`} />
        | Some(Up | Down) | None =>
          <Icons.ChevronDown {...props} className={`size-4 ${className}`} />
        }
      },
      dayButton: (props: DayButtonProps.t) => <DayButton {...props} />,
      weekNumber: ({?children, ?className}) =>
        <td ?className>
          <div
            className="flex size-(--cell-size) items-center justify-center text-center" ?children
          />
        </td>,
    }}
  />
}
