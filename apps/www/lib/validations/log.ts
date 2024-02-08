import { z } from "zod"

export const logSchema = z.object({
  event: z.enum(["copy_primitive"]),
  data: z.record(z.string()),
})
