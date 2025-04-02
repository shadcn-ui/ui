import { useEffect, useMemo, useState } from "react"

export const PRODUCT_DOMAIN = "vercel.com"

export enum Utm {
  Source = "utm_source",
  Medium = "utm_medium",
  Campaign = "utm_campaign",
  Content = "utm_content",
  Term = "utm_term",
}

export type UtmParameters = Record<Utm, string>

const UtmParameterSet = new Set(Object.values(Utm))

export const DEFAULT_UTM_PARAMETERS: UtmParameters = {
  [Utm.Source]: "",
  [Utm.Medium]: "",
  [Utm.Campaign]: "",
  [Utm.Content]: "",
  [Utm.Term]: "",
}

function isUtmParameter(key: unknown): key is Utm {
  if (typeof key !== "string") return false
  return UtmParameterSet.has(key as Utm)
}

export function isolateUtmParameters(
  query: Record<string, unknown>
): UtmParameters {
  const utmParameters = Object.entries(query)
    .filter(([key]) => isUtmParameter(key))
    .reduce<Partial<UtmParameters>>((acc, [key, val]) => {
      acc[key as Utm] = val as string
      return acc
    }, {})

  console.log("WHAT", utmParameters)

  return {
    ...DEFAULT_UTM_PARAMETERS,
    ...utmParameters,
  }
}
/**
 * Parses search parameters from useFormSubmissionUrl and returns them as an object.
 * We're doing this instead of using the router because for some reason the UTM params
 * are frequently not making it through to the third-party endpoints.
 */
export function useUrlParameters(): Record<string, string> {
  const url = useFormSubmissionUrl()
  try {
    const urlParams = new URL(url).searchParams
    const params = Object.fromEntries(urlParams.entries())
    return params
  } catch {
    return {}
  }
}

/**
 * Gets all UTM parameters from useUrlParameters
 */
export function useUtmParameters(): Partial<Record<Utm, string>> {
  const query = useUrlParameters()
  console.log("QUERY", query)
  return useMemo(() => isolateUtmParameters(query), [query])
}

export interface Gclid {
  value: string
  expiration: Date
}

export interface Attribution {
  referrer: string
  utm: Partial<Record<Utm, string>>
}

function useFormSubmissionUrl(): string {
  const [submissionUrl, setSubmissionUrl] = useState("")

  useEffect(() => {
    const url =
      window.location.hostname === "localhost"
        ? `https://${PRODUCT_DOMAIN}/dev-mode${window.location.pathname}${window.location.search}`
        : window.location.toString()
    setSubmissionUrl(url)
  }, [])

  return submissionUrl
}

export function useReferrer(): string {
  const [referrer, setReferrer] = useState(
    typeof document !== "undefined" ? document.referrer : ""
  )

  useEffect(() => {
    setReferrer(document.referrer)
  }, [])
  return referrer
}

export function useAttribution(): Attribution {
  const utmParameters = useUtmParameters()
  const url = useFormSubmissionUrl()
  const referrer = useReferrer()

  const attribution = useMemo(
    () => ({
      utm: utmParameters,
      url,
      referrer,
    }),
    [utmParameters, url, referrer]
  )

  console.log("ATTRIBUTION", attribution)
  return attribution
}
