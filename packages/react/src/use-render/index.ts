// A poor man's version of base-ui useRender.
// see https://base-ui.com/react/utils/use-render.
// TODO: Replace if base-ui useRender is published as a package.
import * as React from "react"

type RenderState = Record<string, unknown>

type RenderFunction<TState extends RenderState> = (
  props: Record<string, unknown>,
  state: TState
) => React.ReactElement | null

type RenderProp<TState extends RenderState> =
  | React.ReactElement
  | RenderFunction<TState>

type StateAttributesMapping<TState extends RenderState> = Partial<{
  [K in keyof TState]: (
    value: TState[K]
  ) => Record<string, string | undefined> | null | undefined
}>

type UseRenderComponentProps<
  TElement extends React.ElementType,
  TState extends RenderState = RenderState,
> = React.ComponentPropsWithRef<TElement> & {
  render?: RenderProp<TState>
}

type UseRenderOptions<
  TElement extends React.ElementType,
  TState extends RenderState,
> = {
  defaultTagName: TElement
  props?: React.ComponentPropsWithRef<TElement>
  render?: RenderProp<TState>
  state?: TState
  stateAttributesMapping?: StateAttributesMapping<TState>
}

function useRender<
  TElement extends React.ElementType,
  TState extends RenderState = RenderState,
>({
  defaultTagName,
  props,
  render,
  state = {} as TState,
  stateAttributesMapping,
}: UseRenderOptions<TElement, TState>) {
  const elementProps = mergeProps<TElement>(
    getStateAttributes(state, stateAttributesMapping),
    props
  )

  if (!render) {
    return React.createElement(defaultTagName, elementProps)
  }

  if (typeof render === "function") {
    return render(elementProps, state)
  }

  if (!React.isValidElement(render)) {
    return null
  }

  const renderProps = render.props as Record<string, unknown>
  const propsWithRenderProps = mergeProps<TElement>(elementProps, renderProps)
  const propsWithRef = {
    ...propsWithRenderProps,
    ref: composeRefs(
      elementProps.ref as React.Ref<unknown> | undefined,
      renderProps.ref as React.Ref<unknown> | undefined
    ),
  }

  return React.cloneElement(
    render,
    propsWithRef as React.Attributes & Record<string, unknown>
  )
}

function mergeProps<TElement extends React.ElementType>(
  ...sources: Array<
    React.ComponentPropsWithRef<TElement> | Record<string, unknown> | undefined
  >
) {
  const result: Record<string, unknown> = {}

  for (const source of sources) {
    if (!source) {
      continue
    }

    const sourceProps = source as Record<string, unknown>

    for (const key of Object.keys(sourceProps)) {
      const value = sourceProps[key]

      if (value === undefined) {
        continue
      }

      const current = result[key]

      if (key === "className") {
        result[key] = [current, value].filter(Boolean).join(" ")
      } else if (key === "style") {
        result[key] = {
          ...(current as React.CSSProperties | undefined),
          ...(value as React.CSSProperties | undefined),
        }
      } else if (key === "ref") {
        result[key] = composeRefs(
          current as React.Ref<unknown> | undefined,
          value as React.Ref<unknown> | undefined
        )
      } else if (
        isEventHandler(key) &&
        typeof current === "function" &&
        typeof value === "function"
      ) {
        result[key] = composeEventHandlers(
          value as EventHandler,
          current as EventHandler
        )
      } else {
        result[key] = value
      }
    }
  }

  return result as React.ComponentPropsWithRef<TElement>
}

function getStateAttributes<TState extends RenderState>(
  state: TState,
  mapping?: StateAttributesMapping<TState>
) {
  const props: Record<string, unknown> = {}

  for (const key of Object.keys(state) as Array<keyof TState>) {
    const value = state[key]
    const attributes = mapping?.[key]?.(value)

    if (attributes) {
      Object.assign(props, attributes)
      continue
    }

    if (key === "slot") {
      props["data-slot"] = value
      continue
    }

    const attribute = `data-${String(key).replace(
      /[A-Z]/g,
      (letter) => `-${letter.toLowerCase()}`
    )}`

    if (typeof value === "boolean") {
      props[attribute] = value ? "" : undefined
    } else if (value !== null && value !== undefined) {
      props[attribute] = String(value)
    }
  }

  return props
}

type EventHandler = (event: React.SyntheticEvent) => void

function composeEventHandlers(theirs: EventHandler, ours: EventHandler) {
  return function handleEvent(event: React.SyntheticEvent) {
    theirs(event)

    if (!event.defaultPrevented) {
      ours(event)
    }
  }
}

function isEventHandler(key: string) {
  return /^on[A-Z]/.test(key)
}

function composeRefs<T>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> | undefined {
  const validRefs = refs.filter(Boolean)

  if (validRefs.length === 0) {
    return undefined
  }

  return (value) => {
    for (const ref of validRefs) {
      if (typeof ref === "function") {
        ref(value)
      } else if (ref) {
        ref.current = value
      }
    }
  }
}

export { composeRefs, mergeProps, useRender, type UseRenderComponentProps }
