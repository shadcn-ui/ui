import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export function ButtonAsChild() {
  return (
    <Button asChild>
      <a
        href={siteConfig.links.github}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icons.gitHub className="mr-2 h-4 w-4" />
        View source code
      </a>
    </Button>
  )
}
