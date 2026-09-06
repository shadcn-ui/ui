# use-render

Internal polymorphic-render helper (`useRender`, `mergeProps`) that powers the
`render` prop on `@shadcn/react` primitives. It lets a component render as a
custom element while merging the primitive's props, refs, and state attributes
onto it.

## Attribution

This code is adapted from [Base UI](https://github.com/mui/base-ui)'s
`useRender` implementation (`@base-ui/react/use-render`), MIT licensed,
© MUI. We keep a local copy so the primitives carry no runtime dependency on
Base UI.

If Base UI publishes `useRender` as an independent, standalone package, we will
switch to it and remove this copy.
