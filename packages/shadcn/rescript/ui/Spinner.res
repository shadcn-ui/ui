@react.component
let make = (~className="", ~role="status", ~ariaLabel="Loading", ~children=?) => {
  let _ignoredChildren = children
  <Icons.Loader2 role ariaLabel className={`size-4 animate-spin ${className}`} />
}
