import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { Check } from "lucide-react"
import { twMerge } from "tailwind-merge"

import { cn } from "@/lib/utils"
import { Button, ButtonProps } from "@/registry/default/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/default/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/default/ui/popover"

type Accessor<T> = (data: T) => string | number

type TriggerProps = Omit<ButtonProps, "onClick">

type UnselectReselectMode<T> = {
  onSelectedClick?: "unselect"
  onSelectChange: (props: {
    added?: T | undefined
    removed?: T | undefined
  }) => void
}

type DefaultReselectMode<T> = {
  onSelectedClick: "reselect" | "ignore"
  onSelectChange: (props: { added: T; removed?: never }) => void
}

type SingleProps<T, R extends (...args: any[]) => any = Accessor<T>> = {
  mode?: "single"
  valueAccessor: R
  selected?: ReturnType<R> | null
  renderLabel?: (value: T) => NonNullable<ReactNode>
}

type MultipleProps<T, R extends (...args: any[]) => any = Accessor<T>> = {
  mode: "multiple"
  valueAccessor: R
  selected?: ReturnType<R>[]
  renderLabel?: (value: T[]) => NonNullable<ReactNode>
}

type SelectorSearch<T, DataT> = {
  accessor?: (data: T) => Array<string | null>
  filter?: (value: string, search: string) => number
  renderSearch?: (InputComponent: typeof CommandInput, data: DataT) => ReactNode
  query?: string
  onSearchChange?: (search: string) => void
  suppressFiltering?: boolean
}

type CoreProps<T, DataT = T[] | Record<string, T[]>> = {
  data: DataT
  renderValue?: (
    value: T,
    disabled?: boolean | undefined
  ) => NonNullable<ReactNode>
  renderSelectedIcon?: (value: T) => ReactNode
  customId?: (data: T) => string | number
  filters?: Array<{
    label: string
    filter: (data: T) => boolean
    defaultEnabled?: boolean
  }>
  triggerProps?: TriggerProps
  contentStyles?: string
  placeholder?: ReactNode
  search?: SelectorSearch<T, DataT>
  disabledAccessor?: (value: T) => boolean
}

function Selector<T>({
  mode = "single",
  data,
  selected: selectedExt,
  onSelectedClick = "unselect",
  onSelectChange,
  search,
  valueAccessor,
  renderLabel,
  renderValue,
  renderSelectedIcon,
  triggerProps,
  contentStyles,
  placeholder,
  disabledAccessor,
  customId = valueAccessor,
  filters = [],
}: CoreProps<T> &
  (SingleProps<T> | MultipleProps<T>) &
  (UnselectReselectMode<T> | DefaultReselectMode<T>)) {
  const [selected, setSelected] = useState(
    mode === "single"
      ? typeof selectedExt === "string"
        ? selectedExt || null
        : selectedExt ?? null
      : selectedExt ?? []
  )
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const separator = "~"

  const searchAccessor = search?.accessor
  const createChoiceNameId = useCallback(
    (choice: T) => {
      const res =
        searchAccessor?.(choice).reduce(
          (acc, curr) => (acc += curr ? `${curr} ` : ""),
          ""
        ) ?? ""

      return `${res}${separator}${valueAccessor(choice)}` as const
    },
    [searchAccessor, valueAccessor]
  )
  type CustomId = ReturnType<typeof createChoiceNameId>
  const getCustomChoiceId = useCallback(
    (id: CustomId) => id.split(separator)[1]!,
    []
  )

  const flattenedChoices = useMemo(
    () => (Array.isArray(data) ? data : Object.values(data).flat()),
    [data]
  )

  const label = useMemo(() => {
    if (mode === "multiple" && Array.isArray(selected)) {
      const options = flattenedChoices.filter((v) =>
        selected.includes(valueAccessor(v))
      )

      return options.length > 0
        ? (renderLabel as MultipleProps<T>["renderLabel"])?.(options) ??
            options.map(valueAccessor).join(", ")
        : placeholder ?? "-"
    } else if (mode === "single" && !Array.isArray(selected)) {
      const option = flattenedChoices.find((v) => valueAccessor(v) == selected)

      return selected !== null && typeof option !== "undefined"
        ? (renderLabel as SingleProps<T>["renderLabel"])?.(option) ??
            renderValue?.(option, disabledAccessor?.(option)) ??
            valueAccessor(option)
        : placeholder ?? triggerProps?.value ?? triggerProps?.children ?? "-"
    } else return `!invalid label state!`
  }, [
    selected,
    flattenedChoices,
    mode,
    valueAccessor,
    renderValue,
    disabledAccessor,
    renderLabel,
    placeholder,
    triggerProps?.value,
    triggerProps?.children,
  ])

  const [filtersState, setFilters] = useState(
    filters.map((v) => ({ ...v, enabled: v.defaultEnabled ?? false }))
  )

  //resolve nullish `selected` values
  useEffect(() => {
    setSelected(
      mode === "single"
        ? typeof selectedExt === "string"
          ? selectedExt || null
          : selectedExt ?? null
        : selectedExt ?? []
    )
  }, [mode, selectedExt])

  const handleSelect = useCallback(
    (mixedValue: string, choices: T[]) => {
      const value = getCustomChoiceId(mixedValue as CustomId)
      const choice = choices.find(
        //? normalized comparison, radix lowers caps
        (v) => valueAccessor(v).toString().toLowerCase() == value
      )
      if (typeof choice === "undefined") return
      if (mode === "single" && !Array.isArray(selected)) {
        //is already selected
        if (selected !== null && valueAccessor(choice) == selected) {
          switch (onSelectedClick) {
            case "unselect": {
              setSelected(null)
              ;(onSelectChange as UnselectReselectMode<T>["onSelectChange"])({
                removed: choice,
              })

              break
            }

            case "reselect": {
              onSelectChange({ added: choice })
              break
            }

            case "ignore":
            default: {
              break
            }
          }
        } else {
          //* re-access to avoid normalization
          setSelected(valueAccessor(choice))
          onSelectChange({ added: choice })
        }

        return setOpen(false)
      } else if (mode === "multiple" && Array.isArray(selected)) {
        const existingIndex = selected.findIndex(
          (v) => v == valueAccessor(choice)
        )

        if (existingIndex === -1) {
          const newSelected = [...(selected as []), valueAccessor(choice)]

          setSelected(newSelected)
          onSelectChange({ added: choice })
        } else {
          switch (onSelectedClick) {
            case "unselect": {
              const newSelected = (selected as (string | number)[]).filter(
                (v, i) => i !== existingIndex
              )
              setSelected(newSelected)
              ;(onSelectChange as UnselectReselectMode<T>["onSelectChange"])({
                removed: choice,
              })
              break
            }

            case "reselect": {
              const newSelected = [...(selected as []), valueAccessor(choice)]

              setSelected(newSelected)
              onSelectChange({ added: choice })
              break
            }

            case "ignore":
            default: {
              break
            }
          }
        }
      }
    },

    [
      mode,
      selected,
      onSelectedClick,
      valueAccessor,
      onSelectChange,
      getCustomChoiceId,
    ]
  )

  const renderOptions = useMemo(
    () => (data: T[]) => {
      return data
        .filter((v) => {
          const enabledFilters = filtersState.filter((v) => v.enabled)

          return enabledFilters.length > 0
            ? enabledFilters.some((f) => f.filter(v))
            : true
        })
        .map((choice) => (
          <CommandItem
            disabled={disabledAccessor?.(choice)}
            key={customId(choice)}
            value={createChoiceNameId(choice)}
            onSelect={(v) => handleSelect(v, data)}
          >
            {renderSelectedIcon?.(choice) ?? (
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  selected !== null
                    ? mode === "single" &&
                      !Array.isArray(selected) &&
                      selected == valueAccessor(choice)
                      ? "opacity-100"
                      : Array.isArray(selected) &&
                        selected.find((v) => v == valueAccessor(choice))
                      ? "opacity-100"
                      : "opacity-0"
                    : "opacity-0"
                )}
              />
            )}
            <span
              className={disabledAccessor?.(choice) ? "cursor-not-allowed" : ""}
            >
              {renderValue?.(choice, disabledAccessor?.(choice)) ?? (
                <span
                  className={disabledAccessor?.(choice) ? "opacity-50" : ""}
                >
                  {valueAccessor(choice) ?? "-"}
                </span>
              )}
            </span>
          </CommandItem>
        ))
    },
    [
      mode,
      selected,
      filtersState,
      customId,
      renderValue,
      handleSelect,
      valueAccessor,
      disabledAccessor,
      createChoiceNameId,
      renderSelectedIcon,
    ]
  )

  return (
    <div id="selector-container" ref={containerRef}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            {...triggerProps}
            className={twMerge("w-fit", triggerProps?.className)}
            type="button"
            variant="outline"
          >
            {label}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={twMerge("z-[60000] min-w-max max-w-0", contentStyles)}
          style={{ width: containerRef.current?.offsetWidth }}
          side="bottom"
          hideWhenDetached
        >
          <Command
            shouldFilter={!search?.suppressFiltering}
            filter={search?.filter}
          >
            {search
              ? search.renderSearch?.(CommandInput, data) ?? (
                  <div>
                    <CommandInput
                      value={search.query}
                      onValueChange={(v) => search.onSearchChange?.(v)}
                    />
                  </div>
                )
              : null}

            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              {Array.isArray(data) ? (
                <CommandGroup>{renderOptions(data)}</CommandGroup>
              ) : (
                Object.entries(data).map(([group, choices]) =>
                  choices.length > 0 ? (
                    <CommandGroup heading={group} key={group}>
                      {renderOptions(choices)}
                    </CommandGroup>
                  ) : null
                )
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export { Selector }
