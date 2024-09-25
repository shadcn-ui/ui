import React from "react"
import clsx from "clsx"

type TextProps = {
  variant:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    //
    | "lead"
    | "p"
    | "large"
    | "small"
    | "muted"
    //
    | "codeBlock"
    //
    | "blockquote"
    | "highlighted"
    //
    | "list"
    | "orderedList"
    //
    | "table"
    | "thead"
    | "tbody"
    | "tr"
    | "th"
    | "td"
  children: React.ReactNode
  className?: string
}

const Text = ({ variant, children, className }: TextProps) => {
  const baseStyles = {
    /* Heading */
    h1: "scroll-m-20 text-6xl font-semibold tracking-tight lg:text-7xl",
    h2: "scroll-m-20 text-5xl font-semibold tracking-tight lg:text-6xl",
    h3: "scroll-m-20 text-4xl font-semibold tracking-tight lg:text-5xl",
    h4: "scroll-m-20 text-3xl font-semibold tracking-tight",
    h5: "scroll-m-20 text-2xl font-semibold",
    h6: "scroll-m-20 text-xl font-semibold",

    /* Base */
    lead: "text-xl font-medium",
    large: "text-lg font-medium",
    p: "leading-normal text-base",
    small: "text-sm font-base leading-tight",
    muted: "text-sm font-medium text-muted-foreground",

    /* Code */
    codeBlock:
      "relative rounded-lg bg-muted text-foreground px-8 py-10 font-mono text-sm font-medium overflow-x-auto whitespace-pre",

    /* Styled */
    blockquote: "mt-4 border-l-2 pl-4 italic",
    highlighted: "bg-yellow-200",

    /* List */
    list: "my-4 ml-6 list-disc [&>li]:mt-2",
    orderedList: "my-4 ml-6 list-decimal [&>li]:mt-2",

    /* Table */
    table: "w-full border-collapse",
    thead: "border-b bg-muted",
    tbody: "",
    tr: "",
    th: "border px-4 py-2 text-left font-bold",
    td: "border px-4 py-2 text-left",
  }

  const classes = clsx(baseStyles[variant], className)

  switch (variant) {
    /* Heading */

    case "h1":
      return <h1 className={classes}>{children}</h1>
    case "h2":
      return <h2 className={classes}>{children}</h2>
    case "h3":
      return <h3 className={classes}>{children}</h3>
    case "h4":
      return <h4 className={classes}>{children}</h4>
    case "h5":
      return <h5 className={classes}>{children}</h5>
    case "h6":
      return <h6 className={classes}>{children}</h6>

    /* Base */
    case "lead":
      return <p className={classes}>{children}</p>
    case "large":
      return <div className={classes}>{children}</div>
    case "p":
      return <p className={classes}>{children}</p>
    case "small":
      return <small className={classes}>{children}</small>
    case "muted":
      return <p className={classes}>{children}</p>

    /* Styled */
    case "blockquote":
      return <blockquote className={classes}>{children}</blockquote>
    case "highlighted":
      return <mark className={classes}>{children}</mark>

    /* List */
    case "list":
      return <ul className={classes}>{children}</ul>
    case "orderedList":
      return <ol className={classes}>{children}</ol>

    /* Code */
    case "codeBlock":
      return (
        <pre className={classes}>
          <code>{children}</code>
        </pre>
      )

    /* Table */
    case "table":
      return <table className={classes}>{children}</table>
    case "thead":
      return <thead className={classes}>{children}</thead>
    case "tbody":
      return <tbody className={classes}>{children}</tbody>
    case "tr":
      return <tr className={classes}>{children}</tr>
    case "th":
      return <th className={classes}>{children}</th>
    case "td":
      return <td className={classes}>{children}</td>

    default:
      return <p className={classes}>{children}</p>
  }
}

export { Text }
