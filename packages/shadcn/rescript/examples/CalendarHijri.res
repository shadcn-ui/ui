@@directive("'use client'")
@@jsxConfig({version: 4, mode: "automatic", module_: "BaseUi.BaseUiJsxDOM"})

@new external makeDate: (int, int, int) => Date.t = "Date"
@send external focusElement: Dom.element => unit = "focus"
@get external getDayDate: Calendar.Day.t => Date.t = "date"

@module("tailwind-merge")
external twMerge: string => string = "twMerge"

module NextFontGoogle = {
  type t = {className: string}

  @module("next/font/google")
  external vazirmatn: (~subsets: array<string>) => t = "Vazirmatn"
}

let vazirmatn = NextFontGoogle.vazirmatn(~subsets=[|"arabic"|])

module PersianDayPicker = {
  @react.component @module("react-day-picker/persian")
  external make: (
    ~showOutsideDays: bool=?,
    ~className: string=?,
    ~captionLayout: Calendar.CaptionLayout.t=?,
    ~formatters: Calendar.DayPickerFormattersOverride.t=?,
    ~classNames: Calendar.DayPickerClassNames.t=?,
    ~mode: string=?,
    ~selected: 'selected=?,
    ~onSelect: 'selected => unit=?,
    ~defaultMonth: Date.t=?,
    ~components: Calendar.DayPickerComponentsOverride.t=?,
  ) => React.element = "DayPicker"
}

module CalendarDayButton = {
  @react.componentWithProps
  let make = ({
    Calendar.DayButtonProps.className: ?className,
    ?children,
    day,
    modifiers,
    locale: _locale,
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
    let defaultClassNames = Calendar.getDefaultClassNames()
    let buttonRef = React.useRef(null)

    React.useEffect(() => {
      if modifiers.focused->Option.getOr(false) {
        buttonRef.current->Nullable.forEach(focusElement)
      }
      None
    }, [modifiers.focused])

    let selectedSingle = switch modifiers.selected {
    | Some(true) =>
      Some(
        !(modifiers.rangeStart->Option.getOr(false)) &&
        !(modifiers.rangeEnd->Option.getOr(false)) &&
        !(modifiers.rangeMiddle->Option.getOr(false)),
      )
    | _ => None
    }

    <Button
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
      type_=?{switch type_ {
      | Some(value) => Some(value)
      | None => Some("button")
      }}
      ?ariaLabel
      ref={buttonRef->ReactDOM.Ref.domRef}
      dataDay={day->getDayDate->Date.toLocaleDateString}
      dataSelectedSingle=?selectedSingle
      dataRangeStart=?{modifiers.rangeStart}
      dataRangeEnd=?{modifiers.rangeEnd}
      dataRangeMiddle=?{modifiers.rangeMiddle}
      variant=Button.Variant.Ghost
      size=Button.Size.Icon
      className={twMerge(
        `data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 dark:hover:text-accent-foreground flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md [&>span]:text-xs [&>span]:opacity-70 ${defaultClassNames.day} ${className->Option.getOr("")}`,
      )}
      ?children
    />
  }
}

module HijriCalendar = {
  @react.component
  let make = (
    ~className="",
    ~classNames: Calendar.DayPickerClassNamesOverride.t={},
    ~showOutsideDays=true,
    ~captionLayout=Calendar.CaptionLayout.Label,
    ~buttonVariant=Button.Variant.Ghost,
    ~formatters: Calendar.DayPickerFormattersOverride.t={},
    ~components: Calendar.DayPickerComponentsOverride.t={},
    ~mode=?,
    ~selected: option<'selected>=?,
    ~onSelect: option<'selected => unit>=?,
    ~defaultMonth=?,
  ) => {
    let defaultClassNames = Calendar.getDefaultClassNames()
    let captionLabelClassName = switch captionLayout {
    | Label => "text-sm"
    | Dropdown
    | DropdownMonths
    | DropdownYears =>
      "rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5"
    }

    <PersianDayPicker
      showOutsideDays
      className={twMerge(
        `bg-background group/calendar p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent ${className}`,
      )}
      captionLayout
      formatters={{
        formatMonthDropdown: formatters.formatMonthDropdown->Option.getOr(date =>
          date->Date.toLocaleDateStringWithLocaleAndOptions("default", {month: #short})
        ),
        formatCaption: formatters.formatCaption,
        formatDay: formatters.formatDay,
        formatWeekdayName: formatters.formatWeekdayName,
        formatWeekNumber: formatters.formatWeekNumber,
        formatYearDropdown: formatters.formatYearDropdown,
        formatMonthCaption: formatters.formatMonthCaption,
      }}
      classNames={{
        root: classNames.root->Option.getOr(twMerge(`w-fit ${defaultClassNames.root}`)),
        months: classNames.months->Option.getOr(
          twMerge(`flex gap-4 flex-col md:flex-row relative ${defaultClassNames.months}`),
        ),
        month: classNames.month->Option.getOr(
          twMerge(`flex flex-col w-full gap-4 ${defaultClassNames.month}`),
        ),
        nav: classNames.nav->Option.getOr(
          twMerge(
            `flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between ${defaultClassNames.nav}`,
          ),
        ),
        button_previous: classNames.button_previous->Option.getOr(
          twMerge(
            `${Button.buttonVariants(
                ~variant=buttonVariant,
              )} size-(--cell-size) aria-disabled:opacity-50 p-0 select-none ${defaultClassNames.button_previous}`,
          ),
        ),
        button_next: classNames.button_next->Option.getOr(
          twMerge(
            `${Button.buttonVariants(
                ~variant=buttonVariant,
              )} size-(--cell-size) aria-disabled:opacity-50 p-0 select-none ${defaultClassNames.button_next}`,
          ),
        ),
        month_caption: classNames.month_caption->Option.getOr(
          twMerge(
            `flex items-center justify-center h-(--cell-size) w-full px-(--cell-size) ${defaultClassNames.month_caption}`,
          ),
        ),
        dropdowns: classNames.dropdowns->Option.getOr(
          twMerge(
            `w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5 ${defaultClassNames.dropdowns}`,
          ),
        ),
        dropdown_root: classNames.dropdown_root->Option.getOr(
          twMerge(
            `relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md ${defaultClassNames.dropdown_root}`,
          ),
        ),
        dropdown: classNames.dropdown->Option.getOr(
          twMerge(`absolute inset-0 opacity-0 ${defaultClassNames.dropdown}`),
        ),
        caption_label: classNames.caption_label->Option.getOr(
          twMerge(`select-none font-medium ${captionLabelClassName} ${defaultClassNames.caption_label}`),
        ),
        table: classNames.table->Option.getOr("w-full border-collapse"),
        weekdays: classNames.weekdays->Option.getOr(twMerge(`flex ${defaultClassNames.weekdays}`)),
        weekday: classNames.weekday->Option.getOr(
          twMerge(
            `text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none ${defaultClassNames.weekday}`,
          ),
        ),
        week: classNames.week->Option.getOr(twMerge(`flex w-full mt-2 ${defaultClassNames.week}`)),
        week_number_header: classNames.week_number_header->Option.getOr(
          twMerge(`select-none w-(--cell-size) ${defaultClassNames.week_number_header}`),
        ),
        week_number: classNames.week_number->Option.getOr(
          twMerge(`text-[0.8rem] select-none text-muted-foreground ${defaultClassNames.week_number}`),
        ),
        day: classNames.day->Option.getOr(
          twMerge(
            `relative w-full h-full p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none ${defaultClassNames.day}`,
          ),
        ),
        range_start: classNames.range_start->Option.getOr(
          twMerge(`rounded-l-md bg-accent ${defaultClassNames.range_start}`),
        ),
        range_middle: classNames.range_middle->Option.getOr(
          twMerge(`rounded-none ${defaultClassNames.range_middle}`),
        ),
        range_end: classNames.range_end->Option.getOr(
          twMerge(`rounded-r-md bg-accent ${defaultClassNames.range_end}`),
        ),
        today: classNames.today->Option.getOr(
          twMerge(
            `bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none ${defaultClassNames.today}`,
          ),
        ),
        outside: classNames.outside->Option.getOr(
          twMerge(
            `text-muted-foreground aria-selected:text-muted-foreground ${defaultClassNames.outside}`,
          ),
        ),
        disabled: classNames.disabled->Option.getOr(
          twMerge(`text-muted-foreground opacity-50 ${defaultClassNames.disabled}`),
        ),
        hidden: classNames.hidden->Option.getOr(twMerge(`invisible ${defaultClassNames.hidden}`)),
      }}
      components={{
        root: components.root->Option.getOr(({
          ?className,
          ?children,
          ?rootRef,
          ?id,
          ?style,
          ?onClick,
          ?onKeyDown,
          ?dataMode,
          ?dataWeekNumbers,
          ?dataMultipleMonths,
        }) =>
          <div
            dataSlot="calendar"
            ref=?rootRef
            ?className
            ?children
            ?id
            ?style
            ?onClick
            ?onKeyDown
            ?dataMode
            ?dataWeekNumbers
            ?dataMultipleMonths
          />
        ),
        chevron: components.chevron->Option.getOr((props: Calendar.ChevronProps.t) => {
          let className = props.className->Option.getOr("")
          let orientation = props.orientation
          let iconProps = ({...props, orientation: ?None} :> Icons.props)
          switch orientation {
          | Some(Left) => <Icons.ChevronLeft {...iconProps} className={`size-4 ${className}`} />
          | Some(Right) => <Icons.ChevronRight {...iconProps} className={`size-4 ${className}`} />
          | Some(Up | Down) | None =>
            <Icons.ChevronDown {...iconProps} className={`size-4 ${className}`} />
          }
        }),
        dayButton: components.dayButton->Option.getOr((props: Calendar.DayButtonProps.t) =>
          <CalendarDayButton {...props} />
        ),
        weekNumber: components.weekNumber->Option.getOr(({
          ?children,
          ?className,
          ?ariaLabel,
          ?role,
          ?scope,
          ?week,
        }) =>
          <td ?className ?ariaLabel ?role ?scope ?week>
            <div className="flex size-(--cell-size) items-center justify-center text-center" ?children />
          </td>
        ),
      }}
      ?mode
      ?selected
      ?onSelect
      ?defaultMonth
    />
  }
}

@react.component
let make = () => {
  let (date, setDate) = React.useState(() => Some(makeDate(2025, 5, 12)))

  <div className={vazirmatn.className}>
    <HijriCalendar
      mode="single"
      defaultMonth=?date
      selected=date
      onSelect={(value: option<Date.t>) => setDate(_ => value)}
      className="rounded-lg border"
    />
  </div>
}
