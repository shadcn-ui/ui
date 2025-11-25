import va from "@vercel/analytics"
import { z } from "zod"

const eventSchema = z.object({
  name: z.enum([
    "copy_npm_command",
    "copy_usage_import_code",
    "copy_usage_code",
    "copy_primitive_code",
    "copy_theme_code",
    "copy_block_code",
    "copy_chunk_code",
    "enable_lift_mode",
    "copy_chart_code",
    "copy_chart_theme",
    "copy_chart_data",
    "copy_color",
    "set_layout",
    "search_query",
  ]),
  // declare type AllowedPropertyValues = string | number | boolean | null
  properties: z
    .record(z.union([z.string(), z.number(), z.boolean(), z.null()]))
    .optional(),
})

export type Event = z.infer<typeof eventSchema>

export function trackEvent(input: Event): void {
  const event = eventSchema.parse(input)
  if (event) {
    va.track(event.name, event.properties)
  }
}
