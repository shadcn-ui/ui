"use client"

import {
  Analytics as VercelAnalytics,
  type BeforeSendEvent,
} from "@vercel/analytics/react"

export function Analytics() {
  return (
    <VercelAnalytics
      beforeSend={(event: BeforeSendEvent) => {
        return {
          ...event,
          attributes: {
            title: document.title,
          },
        }
      }}
    />
  )
}
