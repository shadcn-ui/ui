export type SiteData = {
  image: string
  title: string
  url: string
}

export function fetchSiteData(url: string) {
  return fetch(url)
    .then((response) => response.text())
    .then((html) => {
      let title = ""
      let image = ""

      const titleMatch = html.match(/<title>([^<]+)<\/title>/i)
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].trim()
      }

      const imageMatch = html.match(
        /<meta\s+(?:[^>]*?\s+)?property="og:image"\s+content="([^"]+)"|<meta\s+content="([^"]+)"\s+property="og:image"/i
      )
      if (imageMatch && (imageMatch[1] || imageMatch[2])) {
        image = imageMatch[1] ? imageMatch[1].trim() : imageMatch[2].trim()
      }

      // filter url, like https://ui.shadcn.com/ -> ui.shadcn.com
      const urlMatch = url.match(
        /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im
      )
      const formatedUrl = urlMatch ? urlMatch[1] : ""

      return {
        image,
        title,
        url: formatedUrl,
      } as SiteData
    })
}
