import * as React from "react"

type ReactElementWithDisplayName = React.ReactElement & {
  type: { displayName: string }
}

const isElement = (
  element: unknown | undefined
): element is ReactElementWithDisplayName => {
  return (
    (element as ReactElementWithDisplayName)?.type?.displayName !== undefined
  )
}

export function useComposition(
  children: React.ReactNode,
  component: string | undefined
) {
  const Children = React.useMemo(
    () =>
      React.Children.toArray(children).filter((child) => {
        if (isElement(child)) return child.type.displayName === component
        return false
      }),
    [children, component]
  )

  return Children
}
