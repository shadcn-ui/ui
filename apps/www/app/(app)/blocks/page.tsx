import { BlockDisplay } from "@/components/block-display"

const FEATURED_BLOCKS = ["sidebar-07", "sidebar-03", "login-03", "login-04"]

export default async function BlocksPage() {
  return (
    <div>
      {FEATURED_BLOCKS.map((block) => (
        <div
          key={block}
          className="border-grid container border-b py-8 first:pt-6 last:border-b-0 md:py-12"
        >
          <BlockDisplay name={block} />
        </div>
      ))}
    </div>
  )
}
