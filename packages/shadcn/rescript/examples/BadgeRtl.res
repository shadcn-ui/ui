@@directive("'use client'")

@module("tailwind-merge")
external twMerge: string => string = "twMerge"

module RtlBadge = {
  let badgeVariantClass = (~variant: Badge.Variant.t) =>
    switch variant {
    | Secondary => "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80"
    | Destructive => "bg-destructive/10 [a]:hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive dark:bg-destructive/20"
    | Outline => "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground"
    | Ghost => "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50"
    | Link => "text-primary underline-offset-4 hover:underline"
    | Default => "bg-primary text-primary-foreground [a]:hover:bg-primary/80"
    }

  let badgeVariants = (~variant=Badge.Variant.Default) => {
    let base = "h-5 gap-1 rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium transition-all has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&>svg]:size-3! inline-flex items-center justify-center w-fit whitespace-nowrap shrink-0 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive overflow-hidden group/badge"
    `${base} ${badgeVariantClass(~variant)}`
  }

  @react.component
  let make = (
    ~className="",
    ~children=?,
    ~variant=Badge.Variant.Default,
    ~id=?,
    ~onClick=?,
    ~onKeyDown=?,
    ~style=?,
    ~render=?,
  ) => {
    let resolvedClassName = twMerge(`${badgeVariants(~variant)} ${className}`)
    let props: BaseUi.Types.props<string, bool> = {
      ?id,
      ?style,
      ?onClick,
      ?onKeyDown,
      ?children,
      dataSlot: "badge",
      dataVariant: (variant :> string),
      className: resolvedClassName,
    }
    BaseUi.Render.use({defaultTagName: "span", props, ?render})
  }
}

@react.component
let make = () =>
  <div className="flex w-full flex-wrap justify-center gap-2" dir="rtl">
    <RtlBadge> {"شارة"->React.string} </RtlBadge>
    <RtlBadge variant=Badge.Variant.Secondary> {"ثانوي"->React.string} </RtlBadge>
    <RtlBadge variant=Badge.Variant.Destructive> {"مدمر"->React.string} </RtlBadge>
    <RtlBadge variant=Badge.Variant.Outline> {"مخطط"->React.string} </RtlBadge>
    <RtlBadge variant=Badge.Variant.Secondary>
      <Icons.BadgeCheck dataIcon="inline-start" />
      {"متحقق"->React.string}
    </RtlBadge>
    <RtlBadge variant=Badge.Variant.Outline>
      {"إشارة مرجعية"->React.string}
      <Icons.Bookmark dataIcon="inline-end" />
    </RtlBadge>
  </div>
