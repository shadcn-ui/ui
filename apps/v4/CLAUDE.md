# shadcn/ui v4 App

This is the documentation site and registry for shadcn/ui components.

## Custom Agents

### shadcn/ui Demo Creator

When asked to create a demo component for the bases registry, read the instructions at:
`.claude/agents/shadcn-ui-demo-creator.md`

**Trigger phrases:**
- "create a demo for [component]"
- "add a [component]-[variant] demo"
- "new demo component"

**Quick reference:**
1. Read source from `registry/new-york-v4/examples/{demo-name}.tsx`
2. Create demo in `registry/radix-nova/demo/` and `registry/base-nova/demo/`
3. Update `_registry.ts` in both demo folders
4. Add `<ComponentPreview>` to docs in `content/docs/components/radix/` and `content/docs/components/base/`

**Import paths:**
- Radix: `@/registry/radix-nova/ui/{component}`
- Base: `@/registry/base-nova/ui/{component}`

**PRD:** `.claude/prd/demo-components.md`

## Registry Structure

- `registry/radix-nova/` - Radix UI based components (radix-nova style)
- `registry/base-nova/` - Base UI based components (base-nova style)
- `registry/new-york-v4/` - Legacy style (source for demos)

## Documentation

- Component docs: `content/docs/components/{base}/{component}.mdx`
- Radix uses `styleName="radix-nova"`
- Base uses `styleName="base-nova"`
