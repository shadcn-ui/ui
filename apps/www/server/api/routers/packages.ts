import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { packages } from "@/server/db/schema";

export const packagesRouter = createTRPCRouter({
  hello: publicProcedure
    .query(() => {
      return {
        greeting: `Hello`,
      };
    }),

  getSecretMessage: publicProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
