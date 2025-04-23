import { useRef } from "react"
import { usePathname } from "next/navigation"

import { runStreamInternal } from "./run-stream-internal"
import {
  Topic,
  type TopicRecordPayloads,
  type UiShadcnSiteActivityAction,
} from "./types"
import { useAttribution } from "./use-attribution"

type UiShadcnSiteActivityPayload =
  TopicRecordPayloads[Topic.UiShadcnSiteV0Activity]

export function useTrackActivity(): {
  track: typeof trackActivity
} {
  const baseTrackDataRef = useRef<Partial<UiShadcnSiteActivityPayload>>({})
  const { utm } = useAttribution()

  const pathname = usePathname()

  baseTrackDataRef.current = {
    page_path: pathname,
    utm_source: utm.utm_source || undefined,
    utm_medium: utm.utm_medium || undefined,
    utm_campaign: utm.utm_campaign || undefined,
    utm_term: utm.utm_term || undefined,
    utm_content: utm.utm_content || undefined,
  }

  const track = useRef<typeof trackActivity>((action, payload) => {
    return trackActivity(action, {
      ...baseTrackDataRef.current,
      ...payload,
    })
  })

  return {
    track: track.current,
  }
}

export const trackActivity = async <Action extends UiShadcnSiteActivityAction>(
  action: Action,
  payload: Partial<UiShadcnSiteActivityPayload>
): Promise<void> => {
  const { ...rest } = payload

  await runStreamInternal(Topic.UiShadcnSiteV0Activity, {
    referrer: document.referrer || null,
    user_agent: navigator.userAgent,
    page_title: document.title,
    utm_source: payload.utm_source || undefined,
    utm_medium: payload.utm_medium || undefined,
    utm_campaign: payload.utm_campaign || undefined,
    utm_term: payload.utm_term || undefined,
    utm_content: payload.utm_content || undefined,
    query_string: window.location.search,
    ...rest,
  })
}
