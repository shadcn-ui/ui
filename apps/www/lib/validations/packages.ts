import { z } from "zod";

const allowedFiles = "tsx|js|ts|md"
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
        dir: z.string(),
        name: z.string().refine((input) => fileExtensionRegex.test(input), {
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