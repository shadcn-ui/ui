import { packages } from "@/server/db/schema";
import { z } from "zod";

const allowedFiles = "tsx|js|ts|md|html|css|scss|yml|yaml|mdx"
const fileExtensionRegex = new RegExp(`\\.(${allowedFiles})$`);

export const packageZod = z.object({
    name: z.string(),
    description: z.string(),
    type: z.string().refine((x) => x === "components:addons", {
        message: "type of component must be addons"
    }).optional(),
    dependencies: z.array(
        z.string()
    ).optional(),
    registryDependencies: z.array(
        z.string()
    ).optional(),
    files: z.array(
      z.object({
        content: z.string(),
        dir: z.string().transform(x => x.replaceAll(" ", "").split("/").filter(e => e.length).join("/")),
        name: z.string().refine((x) => fileExtensionRegex.test(x), {
            message: 'File must have a .tsx or .js extension',
          })
      })
    )
  })
  

  export const packageAdditionalZod = z.object({
    version: z.string().refine((x) => /^\d+\.\d+\.\d+$/.test(x), {
      message: 'Invalid version format. Must be in the form of "x.y.z" in digit'
    }),
  })

  export type PackageType = z.infer<typeof packageZod>

  export type PackageFilterZod = Exclude<keyof typeof packages["$inferInsert"], (keyof z.infer<typeof packageZod>) | (keyof typeof packageAdditionalZod)>

  

  export const packageFilterZod = z.object({
    filter: z.string().optional(),
    order: z.union([z.literal("desc"), z.literal("asc")]).optional(),
    limit: z.number().optional()
  })