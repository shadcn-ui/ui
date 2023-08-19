import { promises as fs } from "fs"
import path from "path"

import { fetchSiteData } from "@/lib/fetch-site-data"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { ThemeWrapper } from "@/components/theme-wrapper"

import { ShowcaseTabs } from "./tabs"

export default async function ShowcasePage({
  params,
}: {
  params: {
    page: string
  }
}) {
  const dataPath = path.join(process.cwd(), "app", "showcase", "data.txt")
  const file = await fs.readFile(dataPath, "utf8")
  const urls = file.split("\n").filter((line) => line !== "")
  const limit = 12
  const page = Number(params.page)
  const pageUrls = urls.slice((page - 1) * limit, page * limit)
  const pageData = await Promise.all(pageUrls.map(fetchSiteData))
  return (
    <div className="container">
      <ThemeWrapper
        defaultTheme="zinc"
        className="relative flex flex-col items-start md:flex-row md:items-center"
      >
        <PageHeader className="relative pb-4 md:pb-8 lg:pb-12">
          <PageHeaderHeading>Showcase</PageHeaderHeading>
          <PageHeaderDescription>
            See what people are building with shadcn/ui.
          </PageHeaderDescription>
        </PageHeader>
      </ThemeWrapper>
      <ShowcaseTabs
        pages={pageData}
        paging={{
          limit,
          page,
          total: urls.length,
        }}
      />
    </div>
  )
}
