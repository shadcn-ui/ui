import * as React from "react"
import type { ChatStatus } from "ai"

export function useDelayedStatus(status: ChatStatus, delay: number) {
  const [delayedStatus, setDelayedStatus] = React.useState(status)

  React.useEffect(() => {
    const timeout = window.setTimeout(
      () => {
        setDelayedStatus(status)
      },
      status === "submitted" ? delay : 0
    )

    return () => window.clearTimeout(timeout)
  }, [delay, status])

  return delayedStatus
}
