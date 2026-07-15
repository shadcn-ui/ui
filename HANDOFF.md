# HANDOFF — shadcn-ui/ui

## Repo
- **Upstream:** github.com/shadcn-ui/ui (119k stars)
- **Fork:** github.com/gonzoblasco/ui
- **Clone:** `projects/ui`
- **Remotes:** `fork` = gonzoblasco/ui, `upstream` = shadcn-ui/ui

## Estructura del repo
- Monorepo con pnpm + Turborepo + changesets
- `apps/v4/registry/` — componentes del registry (new-york-v4, bases/base, bases/radix)
- `apps/v4/styles/` — variantes de estilo (base-nova, radix-luma, etc.)
- `packages/shadcn` — CLI
- Tests con Vitest (solo para CLI, no para componentes UI)
- Commit convention: `category(scope): message`

## PRs abiertos

| PR | Issue | Estado | Branch |
|----|-------|--------|--------|
| [#11179](https://github.com/shadcn-ui/ui/pull/11179) | #11157 Input OTP keyboard layout shift | Abierto, esperando review | fix/11157-input-otp-keyboard-layout-shift |

## PRs de otros (competencia)

| PR | Issue | Notas |
|----|-------|-------|
| [#11160](https://github.com/shadcn-ui/ui/pull/11160) | #11157 | Emran-Y — mismo enfoque pero no incluyó el registry new-york-v4. Nuestro PR es más completo (15 archivos vs 14). |

## Qué se hizo
- Forkeado y clonado el repo
- Analizado el issue #11157: `transition-all` en InputOTPSlot causa layout shift al hacer Tab/Shift+Tab
- Cambio: `transition-all` → `transition-[color,box-shadow]` en los 15 archivos que lo usaban
- PR #11179 abierto, referenciando #11157

## Qué sigue
- Esperar review del PR #11179 (1-2 semanas)
- Si lo mergean, actualizar CONTRIBUTING.md y PROYECTOS.md
- Siguiente issue objetivo: #11104 (SidebarProvider Cmd+B shortcut) o #11159 (Calendar Range third click)