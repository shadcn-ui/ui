import { type Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { CopyPresetButton } from "./copy-preset-button"
import { decodePreset } from "shadcn/preset"

import { EXPLORE_PRESETS } from "@/lib/explore"

export const dynamic = "force-static"
export const revalidate = false

const title = "Explore"
const description =
  "Browse curated design system presets. Pick one and make it your own."

export const metadata: Metadata = {
  title,
  description,
}

export default function ExplorePage() {
  const presets = EXPLORE_PRESETS.map((code) => ({
    code,
    config: decodePreset(code),
  })).filter(
    (p): p is { code: string; config: NonNullable<typeof p.config> } =>
      p.config !== null
  )

  return (
    <div className="container-wrapper section-soft flex-1 py-16">
      <div className="container">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {presets.map(({ code, config }) => (
            <Link
              key={code}
              href={`/create?preset=${code}`}
              className="group focus-visible:ring-ring rounded-lg focus-visible:ring-2 focus-visible:outline-none"
            >
              <div className="border-border bg-card relative flex h-[240px] flex-col overflow-hidden rounded-lg border">
                <div
                  className="pointer-events-none absolute inset-0 rounded-lg bg-linear-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:from-black/50"
                  aria-hidden
                />
                <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <CopyPresetButton code={code} />
                </div>
                <div className="w-[480px] flex-1">
                  <Image
                    src={`/presets/${code}-light.png`}
                    alt={`${config.style} preset - light mode`}
                    width={1280}
                    height={720}
                    className="block h-full w-full object-contain dark:hidden"
                  />
                  <Image
                    src={`/presets/${code}-dark.png`}
                    alt={`${config.style} preset - dark mode`}
                    width={1280}
                    height={720}
                    className="hidden h-full w-full object-contain dark:block"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
