import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Doc } from "contentlayer/generated"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { NavItem, NavItemWithChildren } from "types/nav"

import { docsConfig } from "@/config/docs"
import { Button } from "@/registry/new-york/ui/button"

interface DocsPagerProps {
  doc: Doc
}

export function DocsPager({ doc }: DocsPagerProps) {
  const pager = getPagerForDoc(doc)
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" && pager?.prev?.href) {
        router.push(pager.prev.href)
      } else if (event.key === "ArrowRight" && pager?.next?.href) {
        router.push(pager.next.href)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [pager?.next?.href, pager?.prev?.href, router])

  if (!pager) {
    return null
  }

  return (
    <div className="flex flex-row items-center justify-between">
      {pager?.prev?.href && (
        <Button variant="ghost" asChild>
          <Link href={pager.prev.href}>
            <ChevronLeft />
            {pager.prev.title}
          </Link>
        </Button>
      )}
      {pager?.next?.href && (
        <Button variant="ghost" className="ml-auto" asChild>
          <Link href={pager.next.href}>
            {pager.next.title}
            <ChevronRight />
          </Link>
        </Button>
      )}
    </div>
  )
}

export function getPagerForDoc(doc: Doc) {
  const nav = doc.slug.startsWith("/docs/charts")
    ? docsConfig.chartsNav
    : docsConfig.sidebarNav
  const flattenedLinks = [null, ...flatten(nav), null]
  const activeIndex = flattenedLinks.findIndex(
    (link) => doc.slug === link?.href
  )
  const prev = activeIndex !== 0 ? flattenedLinks[activeIndex - 1] : null
  const next =
    activeIndex !== flattenedLinks.length - 1
      ? flattenedLinks[activeIndex + 1]
      : null
  return { prev, next }
}

export function flatten(links: NavItemWithChildren[]): NavItem[] {
  return links
    .reduce<NavItem[]>((flat, link) => {
      return flat.concat(link.items?.length ? flatten(link.items) : link)
    }, [])
    .filter((link) => !link?.disabled)
}