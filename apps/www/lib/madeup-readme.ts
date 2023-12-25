import type { inferRouterOutputs } from "@trpc/server"
import type { AppRouter } from "@/server/api/root"

type Data = NonNullable<inferRouterOutputs<AppRouter>["packages"]["getPackage"]>

export const getReadme = (data:Data) => {
    const text = `
    \`\`\`bash
    npx shadcn-ui@latest add ${data.name}
     \`\`\`
    `
    return text
}