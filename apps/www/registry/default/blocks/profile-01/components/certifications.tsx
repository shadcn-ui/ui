import type { JSX } from "react"
import { Calendar } from "lucide-react"

interface CertificationsProps {
  items: {
    title: string
    issuer: string
    date: string
  }[]
}

export default function Certifications({
  items = [],
}: Readonly<CertificationsProps>): JSX.Element {
  return (
    <article className="rounded-lg border border-border bg-background">
      <h3 className="p-4 text-lg font-semibold">
        Certifications & Achievements
      </h3>
      <ul className="grid max-h-[320px] grid-cols-1 gap-2 overflow-y-auto px-4 pb-4 lg:grid-cols-2">
        {items.map((item) => (
          <li key={item.title} className="rounded-lg border border-border p-4">
            <h4 className="text-sm font-medium text-foreground">
              {item.title}
            </h4>
            <p className="text-xs text-foreground/80">{item.issuer}</p>
            <div className="mt-1 flex items-center">
              <Calendar className="mr-1 h-3 w-3 text-foreground/60" />
              <span className="text-xs text-foreground/60">{item.date}</span>
            </div>
          </li>
        ))}
      </ul>
    </article>
  )
}
