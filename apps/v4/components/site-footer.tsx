import { siteConfig } from "@/lib/config"

export function SiteFooter() {
  return (
    <footer className="border-grid border-t">
      <div className="container-wrapper">
        <div className="container flex h-(--footer-height) items-center justify-between">
          <div className="text-muted-foreground w-full text-center text-xs leading-loose sm:text-sm md:text-left">
            Built by{" "}
            <a
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              shadcn
            </a>
            . The source code is available on{" "}
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </div>
        </div>
      </div>
    </footer>
  )
}
