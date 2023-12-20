import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { packages } from "@/server/db/schema";
import { packageAdditionalZod, packageZod } from "@/lib/validations/packages";
import { db } from "@/server/db";
import { desc, eq } from "drizzle-orm";

export const packagesRouter = createTRPCRouter({
  newPackages: publicProcedure
    .query(async () => {
      const data = await db.query.packages.findMany({
        limit: 10,
        orderBy: desc(packages.created_at),
        columns: {
          files: false,
          author: false
        },
        with: {
          author: {
            columns: {
              image: true,
              name: true,
              username: true
            },
          }
        }
      })

      return data
    }),
  getPackage: publicProcedure
    .input(packageZod
      .pick({
        name: true
      })
    )
    .query(async ({ input }) => {
      const data = await db.query.packages.findFirst({
        where: (packages, {eq}) => eq(packages.name, input.name),
        columns: {
          files: false,
          author: false
        },
        with: {
          author: {
            columns: {
              image: true,
              name: true,
              username: true,
            },
          }
        }
      })

      return data
    }),

  createPackage: protectedProcedure
    .input(packageZod)
    .mutation(async ({ ctx, input }) => {

      await ctx.db.insert(packages).values({
        version: "1.0.0",
        type: "components:addons",
        author: ctx.session.user.id,
        created_at: new Date,
        updated_at: new Date,
        downloads: 0,
        ...input,
      });
    }),

  updatePackage: protectedProcedure
    .input(
      packageZod
        .merge(packageAdditionalZod)
        .deepPartial().required({
          name: true
        })
    )
    .mutation(async ({ ctx, input }) => {

      await ctx.db.update(packages).set({
        updated_at: new Date,
        ...input,
      }).where(eq(packages.name, input.name))

    }),

  deletePackage: protectedProcedure
    .input(packageZod
      .pick({
        name: true
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(packages).where(eq(packages.name, input.name))
    }),
});