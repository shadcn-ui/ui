"use client"

import { useEffect, type JSX } from "react"
import { usePathname } from "next/navigation"
import { v4 as uuidv4 } from "uuid"

import {
  Topic,
  type TopicRecordPayloads,
} from "@/app/(tracking)/api/stream/internal/route"

export function VercelInternalAnalytics(): JSX.Element | null {
  useTrackPageView()
  return null
}

enum UiShadcnSiteActivityAction {
  PageView = "PageView",
}

function useTrackPageView(): void {
  // const { track, isReady } = useTrackActivity()
  // const lastPage = useRef<string | undefined>(undefined)
  // const page = usePageKey()
  const pathname = usePathname()

  useEffect(() => {
    // if (
    //   typeof window === "undefined" ||
    //   // !page ||
    //   // !isReady ||
    //   lastPage.current === page
    // ) {
    //   return
    // }

    // lastPage.current = page
    // void track(UiShadcnSiteActivityAction.PageView, {
    //   route: pathname,
    // })
    // eslint-disable-next-line react-hooks/exhaustive-deps

    runStreamInternal(Topic.UiShadcnSiteActivity, {
      id: uuidv4(),
      is_logged_in: false,
    })
  }, [pathname])
}

// function useTrackActivity(): {
//   isReady: boolean
//   track: typeof trackActivity
// } {
//   const baseTrackDataRef = useRef<BaseVercelActivityPayload>({})
//   const isZeitPubUser = useRef<boolean>(false)
//   const { user, team, isLoading, isTeam } = useAccount()
//   const { utm } = useAttribution()

//   // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
//   isZeitPubUser.current = user?.email?.endsWith("@zeit.pub") ?? false

//   const router = useRouter()
//   const params = useParams<{ projectId?: string }>()
//   const searchParams = useSearchParams()

//   baseTrackDataRef.current = {
//     projectId:
//       // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- type-check in vercel-site thinks this is necessary
//       params?.projectId ??
//       // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- type-check in vercel-site thinks this is necessary
//       searchParams?.get("projectId") ??
//       oneParam(router.query.project),
//     userId: user?.uid,
//     teamId: isTeam ? team?.id : null,
//     userRole: isTeam ? team?.membership?.role : null,
//     billingPlan: isTeam ? team?.billing?.plan : user?.billing?.plan,
//     route: router.pathname,
//     utm,
//   }

//   const track = useRef<typeof trackActivity>((action, payload) => {
//     if (isZeitPubUser.current) {
//       return Promise.resolve()
//     }

//     return trackActivity(action, {
//       ...baseTrackDataRef.current,
//       ...payload,
//     })
//   })

//   return {
//     isReady: !isLoading,
//     track: track.current,
//   }
// }

// const trackActivity = async <Action extends VercelActivityAction>(
//   action: Action,
//   payload: Action extends keyof VercelActivityPayloads
//     ? VercelActivityPayloads[Action] & BaseVercelActivityPayload
//     : BaseVercelActivityPayload | undefined
// ): Promise<void> => {
//   const {
//     projectId,
//     deploymentId,
//     teamId,
//     userRole,
//     billingPlan,
//     userId,
//     route,
//     utm,
//     ...rest
//   } = payload

//   await runStreamInternal(Topic.VercelActivity, {
//     session_id: getSessionId(),
//     project_id: projectId,
//     deployment_id: deploymentId,
//     user_id: userId,
//     team_id: teamId,
//     user_role: userRole,
//     billing_plan: billingPlan,
//     origin: window.origin,
//     path: window.location.pathname,
//     referrer: document.referrer || null,
//     vercel_app: "vercel.com",
//     action,
//     user_agent: navigator.userAgent,
//     meta: JSON.stringify(rest),
//     session_referrer: getSessionReferrer(),
//     route,
//     page_title: document.title,
//     utm: JSON.stringify(utm ?? {}),
//     query_params: JSON.stringify(
//       Object.fromEntries(new URLSearchParams(window.location.search).entries())
//     ),
//   })
// }

// This includes the pathname and the query
// Any time that changes, we want to update the key so we can track a PageView event
// We need the observers because `useSearchParams` does not update for shallow replacements
// function usePageKey(): string {
//   const searchParams = useSearchParams()
//   const pathname = usePathname()
//   const [locationKey, setLocationKey] = useState<string>()

//   useEffect(() => {
//     const observer = new MutationObserver(function changed() {
//       // Allow mutations to settle
//       setTimeout(() => {
//         setLocationKey(window.location.pathname + window.location.search)
//       })
//     })

//     observer.observe(window.document, {
//       childList: true,
//       subtree: true,
//     })

//     const listener = (): void => {
//       setLocationKey(window.location.pathname + window.location.search)
//     }

//     window.addEventListener("popstate", listener)

//     return (): void => {
//       window.removeEventListener("popstate", listener)
//       observer.disconnect()
//     }
//   }, [])

//   return useMemo(() => {
//     if (typeof window === "undefined") {
//       return ""
//     }

//     return window.location.pathname + window.location.search
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [locationKey, pathname, searchParams])
// }

const internalStreamEndpoint = "/api/stream/internal"

const runStreamInternal = async <T extends keyof TopicRecordPayloads>(
  topic: T,
  record: TopicRecordPayloads[T]
): Promise<Response | null> => {
  const payload = JSON.stringify({
    topic,
    record,
  })

  if ("sendBeacon" in navigator) {
    const didSend = navigator.sendBeacon(internalStreamEndpoint, payload)

    if (didSend) {
      return null
    }
  }

  return fetch(internalStreamEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: payload,
  }).catch(() => null)
}
