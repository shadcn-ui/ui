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
  TopicRecordPayloads[Topic.UiShadcnSiteActivity]

export function useTrackActivity(): {
  track: typeof trackActivity
} {
  const baseTrackDataRef = useRef<Partial<UiShadcnSiteActivityPayload>>({})
  const { utm } = useAttribution()

  const pathname = usePathname()

  console.log("PATHNAME", pathname)
  console.log("UTM sfasdfa", utm)

  baseTrackDataRef.current = {
    page_path: pathname,
    utm: JSON.stringify(utm),
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
  const { utm, ...rest } = payload

  await runStreamInternal(Topic.UiShadcnSiteActivity, {
    referrer: document.referrer || null,
    user_agent: navigator.userAgent,
    page_title: document.title,
    utm,
    query_string: window.location.search,
    ...rest,
  })
}
