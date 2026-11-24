"use client"

import * as React from "react"
import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete"
import { useRender } from "@base-ui/react/use-render"
import { cn } from "cn"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/registry/bases/base/ui/dialog"
import {
  InputGroup,
  InputGroupAddon,
} from "@/registry/bases/base/ui/input-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

type CommandFilter = (
  value: string,
  search: string,
  keywords?: string[]
) => number

// Holds the search and the number of matching items. Items, groups and the
// empty state subscribe to what they need, so typing only re-renders the
// items whose visibility changes.
function createCommandStore(shouldFilter: boolean, filter: CommandFilter) {
  const listeners = new Set<() => void>()
  const countListeners = new Set<() => void>()
  const groupCounts = new Map<string, number>()
  let search = ""
  let count = 0
  let config = { shouldFilter, filter }

  const emitCounts = () => countListeners.forEach((listener) => listener())
  const emit = () => {
    listeners.forEach((listener) => listener())
    emitCounts()
  }
  const subscribeTo = (set: Set<() => void>) => (listener: () => void) => {
    set.add(listener)
    return () => {
      set.delete(listener)
    }
  }

  return {
    subscribe: subscribeTo(listeners),
    subscribeToCounts: subscribeTo(countListeners),
    getSearch: () => search,
    setSearch(next: string) {
      if (next === search) return
      search = next
      emit()
    },
    configure(nextShouldFilter: boolean, nextFilter: CommandFilter) {
      if (
        nextShouldFilter === config.shouldFilter &&
        nextFilter === config.filter
      ) {
        return
      }
      config = { shouldFilter: nextShouldFilter, filter: nextFilter }
      emit()
    },
    isFiltering: () => config.shouldFilter && search !== "",
    matches(value: string, keywords?: string[]) {
      return (
        !config.shouldFilter ||
        search === "" ||
        config.filter(value, search, keywords) > 0
      )
    },
    count: (group?: string) =>
      group === undefined ? count : (groupCounts.get(group) ?? 0),
    register(group?: string) {
      count += 1
      if (group) groupCounts.set(group, (groupCounts.get(group) ?? 0) + 1)
      emitCounts()
      return () => {
        count -= 1
        if (group) groupCounts.set(group, (groupCounts.get(group) ?? 1) - 1)
        emitCounts()
      }
    },
  }
}

type CommandStore = ReturnType<typeof createCommandStore>

const CommandContext = React.createContext<{
  store: CommandStore
  label?: string
  onSearchChangeRef: React.RefObject<((search: string) => void) | undefined>
} | null>(null)

const CommandGroupContext = React.createContext<string | undefined>(undefined)

function useCommandContext() {
  const context = React.useContext(CommandContext)
  if (!context) {
    throw new Error("Command components must be used within <Command>")
  }
  return context
}

function useCommandStore<T>(
  store: CommandStore,
  selector: () => T,
  withCounts = false
) {
  return React.useSyncExternalStore(
    withCounts ? store.subscribeToCounts : store.subscribe,
    selector,
    selector
  )
}

function getNodeText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node)
  }
  if (Array.isArray(node)) {
    return node.map(getNodeText).join("")
  }
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return getNodeText(node.props.children)
  }
  return ""
}

function Command({
  className,
  children,
  shouldFilter = true,
  filter,
  loop = false,
  disablePointerSelection = false,
  label,
  onValueChange,
  ...props
}: React.ComponentProps<"div"> & {
  shouldFilter?: boolean
  filter?: CommandFilter
  loop?: boolean
  disablePointerSelection?: boolean
  label?: string
  onValueChange?: (value: string) => void
}) {
  const { contains } = AutocompletePrimitive.useFilter()
  const defaultFilter = React.useCallback<CommandFilter>(
    (value, search, keywords) =>
      contains([value, ...(keywords ?? [])].join(" "), search) ? 1 : 0,
    [contains]
  )
  const resolvedFilter = filter ?? defaultFilter
  const [store] = React.useState(() =>
    createCommandStore(shouldFilter, resolvedFilter)
  )
  const onSearchChangeRef = React.useRef<
    ((search: string) => void) | undefined
  >(undefined)
  const search = useCommandStore(store, store.getSearch)

  React.useLayoutEffect(() => {
    store.configure(shouldFilter, resolvedFilter)
  }, [store, shouldFilter, resolvedFilter])

  const context = React.useMemo(
    () => ({ store, label, onSearchChangeRef }),
    [store, label]
  )

  return (
    <CommandContext.Provider value={context}>
      <div
        data-slot="command"
        className={cn(
          "cn-command flex size-full flex-col overflow-hidden",
          className
        )}
        {...props}
      >
        <AutocompletePrimitive.Root
          inline
          open
          value={search}
          onValueChange={(next, eventDetails) => {
            // Selecting an item keeps the search, as with cmdk.
            if (eventDetails.reason === "item-press") return
            store.setSearch(next)
            onSearchChangeRef.current?.(next)
          }}
          autoHighlight="always"
          keepHighlight
          loopFocus={loop}
          highlightItemOnHover={!disablePointerSelection}
          onItemHighlighted={(value: string | undefined) => {
            if (value !== undefined) onValueChange?.(value)
          }}
        >
          {children}
        </AutocompletePrimitive.Root>
      </div>
    </CommandContext.Provider>
  )
}

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = false,
  ...props
}: Omit<React.ComponentProps<typeof Dialog>, "children"> & {
  title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
  children: React.ReactNode
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn(
          "cn-command-dialog top-1/3 translate-y-0 overflow-hidden p-0",
          className
        )}
        showCloseButton={showCloseButton}
      >
        {children}
      </DialogContent>
    </Dialog>
  )
}

function CommandInput({
  className,
  value,
  onValueChange,
  ...props
}: Omit<AutocompletePrimitive.Input.Props, "value" | "defaultValue"> & {
  value?: string
  onValueChange?: (search: string) => void
}) {
  const { store, label, onSearchChangeRef } = useCommandContext()

  React.useLayoutEffect(() => {
    onSearchChangeRef.current = onValueChange
  })

  const search = useCommandStore(store, store.getSearch)

  // The search follows the input as you type. A controlled input that rejects
  // or changes the text resets it to `value`.
  React.useLayoutEffect(() => {
    if (value !== undefined && value !== search) store.setSearch(value)
  }, [store, value, search])

  return (
    <div data-slot="command-input-wrapper" className="cn-command-input-wrapper">
      <InputGroup className="cn-command-input-group">
        <AutocompletePrimitive.Input
          data-slot="command-input"
          aria-label={label}
          className={cn(
            "cn-command-input outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        />
        <InputGroupAddon>
          <IconPlaceholder
            lucide="SearchIcon"
            tabler="IconSearch"
            hugeicons="SearchIcon"
            phosphor="MagnifyingGlassIcon"
            remixicon="RiSearchLine"
            className="cn-command-input-icon"
          />
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

function CommandList({
  className,
  ...props
}: AutocompletePrimitive.List.Props) {
  return (
    <AutocompletePrimitive.List
      data-slot="command-list"
      className={cn(
        "cn-command-list overflow-x-hidden overflow-y-auto",
        className
      )}
      {...props}
    />
  )
}

function CommandEmpty({ className, ...props }: React.ComponentProps<"div">) {
  const { store } = useCommandContext()
  const empty = useCommandStore(store, () => store.count() === 0, true)

  if (!empty) {
    return null
  }

  return (
    <div
      data-slot="command-empty"
      role="presentation"
      className={cn("cn-command-empty", className)}
      {...props}
    />
  )
}

function CommandGroup({
  className,
  heading,
  forceMount = false,
  children,
  ...props
}: Omit<AutocompletePrimitive.Group.Props, "items"> & {
  heading?: React.ReactNode
  forceMount?: boolean
}) {
  const { store } = useCommandContext()
  const id = React.useId()
  const visible = useCommandStore(
    store,
    () => forceMount || !store.isFiltering() || store.count(id) > 0,
    true
  )

  return (
    <CommandGroupContext.Provider value={id}>
      <AutocompletePrimitive.Group
        data-slot="command-group"
        hidden={!visible}
        className={cn("cn-command-group", className)}
        {...props}
      >
        {heading && (
          <AutocompletePrimitive.GroupLabel
            data-slot="command-group-heading"
            cmdk-group-heading=""
          >
            {heading}
          </AutocompletePrimitive.GroupLabel>
        )}
        {children}
      </AutocompletePrimitive.Group>
    </CommandGroupContext.Provider>
  )
}

function CommandSeparator({
  className,
  alwaysRender = false,
  ...props
}: AutocompletePrimitive.Separator.Props & {
  alwaysRender?: boolean
}) {
  const { store } = useCommandContext()
  const visible = useCommandStore(
    store,
    () => alwaysRender || store.getSearch() === ""
  )

  if (!visible) {
    return null
  }

  return (
    <AutocompletePrimitive.Separator
      data-slot="command-separator"
      className={cn("cn-command-separator", className)}
      {...props}
    />
  )
}

function CommandItem({
  className,
  children,
  value,
  keywords,
  onSelect,
  onClick,
  disabled = false,
  forceMount = false,
  render,
  ...props
}: Omit<AutocompletePrimitive.Item.Props, "value" | "onSelect"> & {
  value?: string
  keywords?: string[]
  onSelect?: (value: string) => void
  forceMount?: boolean
}) {
  const { store } = useCommandContext()
  const group = React.useContext(CommandGroupContext)
  const itemValue = (value ?? getNodeText(children)).trim()
  const matches = useCommandStore(store, () =>
    store.matches(itemValue, keywords)
  )
  const visible = matches || forceMount

  React.useLayoutEffect(() => {
    if (matches) return store.register(group)
  }, [matches, store, group])

  const itemProps = {
    "data-slot": "command-item",
    className: cn(
      "cn-command-item cn-command-item-base group/command-item data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
      className
    ),
    children: (
      <>
        {children}
        <IconPlaceholder
          lucide="CheckIcon"
          tabler="IconCheck"
          hugeicons="Tick02Icon"
          phosphor="CheckIcon"
          remixicon="RiCheckLine"
          className="cn-command-item-indicator ml-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100"
        />
      </>
    ),
  }

  // Base UI keeps disabled items in the keyboard navigation. cmdk skips them,
  // so disabled items render outside of the Base UI list.
  const disabledItem = useRender({
    enabled: visible && disabled,
    render: render as useRender.RenderProp,
    state: { disabled: true },
    props: {
      ...props,
      ...itemProps,
      role: "option",
      "aria-disabled": true,
    },
  })

  if (!visible) {
    return null
  }

  if (disabled) {
    return disabledItem
  }

  return (
    <AutocompletePrimitive.Item
      value={itemValue}
      render={render}
      onClick={(event) => {
        onClick?.(event)
        onSelect?.(itemValue)
      }}
      {...itemProps}
      {...props}
    />
  )
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn("cn-command-shortcut cn-command-shortcut-base", className)}
      {...props}
    />
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
