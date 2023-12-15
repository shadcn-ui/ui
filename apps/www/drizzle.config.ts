import { type Config } from "drizzle-kit";

import { env } from "@/env.mjs";

export default {
  schema: "./server/db/schema.ts",
  out: "./migrations/",
  driver: "pg",
  verbose: true,
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  tablesFilter: ["shadcn_marketplace_*"],
} satisfies Config;