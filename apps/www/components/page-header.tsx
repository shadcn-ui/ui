import { fontHeading } from "@/lib/fonts"
import { cn } from "@/lib/utils"

function PageHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn(
        "flex max-w-[980px] flex-col items-start gap-2 pt-4 pb-6",
        className
      )}
      {...props}
    />
  )
}

function PageHeaderHeading({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        "text-3xl font-bold leading-tight md:text-5xl lg:text-6xl lg:leading-[1.1]",
        fontHeading.className,
        className
      )}
      {...props}
    />
  )
}

function PageHeaderDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "max-w-[750px] text-lg text-slate-700 dark:text-slate-400 sm:text-xl",
        className
      )}
      {...props}
    />
  )
}

export { PageHeader, PageHeaderHeading, PageHeaderDescription }
