/**
 * نصب وابستگی‌ها روی Vercel فقط برای پروژه‌های سازه.
 *
 * pnpm-workspace.yaml مخزن پروژه‌های shadcn (apps/v4، packages/shadcn و …) را هم در بر
 * می‌گیرد، اما pnpm-lock.yaml فقط apps/docs، packages/ui و packages/utils را پوشش می‌دهد؛
 * پس `pnpm install --frozen-lockfile` شکست می‌خورد. این اسکریپت فقط در محیط build ورسل،
 * فهرست `packages:` را به سه پروژه سازه محدود می‌کند (بقیه تنظیمات دست‌نخورده می‌مانند)
 * و سپس نصب قفل‌شده را اجرا می‌کند.
 */
import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

if (process.env.VERCEL !== '1' && !process.argv.includes('--force')) {
  console.error(
    'vercel-install: فقط روی Vercel اجرا می‌شود (VERCEL=1). برای اجرای محلی --force بدهید؛ ' +
      'توجه کنید که pnpm-workspace.yaml را تغییر می‌دهد.',
  )
  process.exit(1)
}

const root = fileURLToPath(new URL('../../../', import.meta.url))
const workspaceFile = `${root}pnpm-workspace.yaml`

const source = readFileSync(workspaceFile, 'utf8')
const scoped = source.replace(
  /^packages:\n(?:[ \t]+-.*\n|[ \t]*\n)*/m,
  "packages:\n  - 'apps/docs'\n  - 'packages/ui'\n  - 'packages/utils'\n\n",
)

if (
  !/^packages:\n {2}- 'apps\/docs'\n {2}- 'packages\/ui'\n {2}- 'packages\/utils'\n/m.test(scoped)
) {
  console.error('vercel-install: فهرست packages در pnpm-workspace.yaml پیدا نشد.')
  process.exit(1)
}

writeFileSync(workspaceFile, scoped)
console.log('vercel-install: workspace limited to apps/docs, packages/ui, packages/utils')

execSync('pnpm install --frozen-lockfile', { cwd: root, stdio: 'inherit' })
