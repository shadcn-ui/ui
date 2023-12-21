import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { packages } from "@/server/db/schema";
import { PackageFilterZod, PackageType, packageAdditionalZod, packageFilterZod, packageZod } from "@/lib/validations/packages";
import { db } from "@/server/db";
import { desc, eq } from "drizzle-orm";

export const packagesRouter = createTRPCRouter({
  nameSomePackages: publicProcedure
    .query(async () => {
      const data = await db.query.packages.findMany({
        limit: 10,
        orderBy: packages.downloads,
        columns: {
          name:true
        }
      })

      return data
    }),
  newPackages: publicProcedure
    .input(packageFilterZod)
    .query(async ({input}) => {
      const filter = input.filter as keyof PackageType ?? "created_at"
      const data = await db.query.packages.findMany({
        limit: input.limit ?? 10,
        orderBy: input.order ? desc(packages[filter]) : packages[filter],
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
        author: ctx.session.user.id,
        created_at: new Date,
        updated_at: new Date,
        downloads: 0,
        ...input,
        type: "components:addons",
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
        type: "components:addons",
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