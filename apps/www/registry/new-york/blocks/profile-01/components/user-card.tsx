import type { JSX, ReactNode } from "react"

interface UserCardProps {
  title: string
  children: ReactNode
  icon: JSX.Element
}

export default function UserCard({
  children,
  icon,
  title,
}: Readonly<UserCardProps>): JSX.Element {
  return (
    <article className="flex h-fit w-full flex-col gap-4 rounded-lg border border-border bg-background p-4 leading-tight">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-foreground">{title}</h2>
        {icon}
      </div>
      {children}
    </article>
  )
}
