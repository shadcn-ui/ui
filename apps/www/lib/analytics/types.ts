export enum Topic {
  UiShadcnSiteActivity = "ui_shadcn_site.v0.activity",
}

type AllowNullForUndefined<T extends Record<string, unknown>> = {
  [K in keyof T]: T extends Record<K, T[K]> ? T[K] : T[K] | null
}

export interface TopicRecordPayloads {
  [Topic.UiShadcnSiteActivity]: AllowNullForUndefined<{
    id: string
    stable_id?: string
    event_time?: number
    query_string?: string
    referrer?: string
    utm?: string
    page_title?: string
    page_path?: string
    device_type?: string
    ip_inferred_country?: string
    user_agent?: string
    is_logged_in: false
  }>
}

export const schemaIdByTopic: Record<Topic, number> = {
  [Topic.UiShadcnSiteActivity]: 100600,
}

export enum UiShadcnSiteActivityAction {
  PageView = "PageView",
}
