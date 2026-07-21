# Force UI docs + component registry site (apps/v4).
#
# Build from the repo root:
#   docker build -t force-ui \
#     --build-arg NEXT_PUBLIC_APP_URL=https://force-ui.example.com \
#     --build-arg NEXT_PUBLIC_V0_URL=https://v0.dev \
#     .
#   docker run -p 4000:4000 force-ui
#
# On Coolify: set NEXT_PUBLIC_APP_URL / NEXT_PUBLIC_V0_URL as Build Variables
# (not just runtime env) — Next.js inlines NEXT_PUBLIC_* vars into the client
# bundle at build time, so changing them requires a rebuild/redeploy.

FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.33.4 --activate
WORKDIR /app

# ---- builder: full source, install, build ----
# Note: apps/v4's postinstall runs fumadocs-mdx, which needs apps/v4/source.config.ts
# present at install time — so full source is copied in before `pnpm install`
# rather than caching a manifests-only install layer.
FROM base AS builder
RUN apk add --no-cache curl bash \
    && curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"
ENV NEXT_TELEMETRY_DISABLED=1

ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_V0_URL
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV NEXT_PUBLIC_V0_URL=${NEXT_PUBLIC_V0_URL}

COPY . .
RUN pnpm install --frozen-lockfile

# Mirrors apps/v4/package.json's "build" script, but caps the preview-apps
# turbo run to --concurrency=1 (default build memory footprint is too high
# for typical CI/Coolify build hosts when vue+svelte+ember build at once).
# Keep this in sync if that script changes.
WORKDIR /app/apps/v4
RUN pnpm registry:build
RUN pnpm exec turbo run preview:build --filter=preview-vue --filter=preview-svelte --filter=preview-ember --concurrency=1 \
    && rm -rf public/preview \
    && mkdir -p public/preview/vue public/preview/svelte public/preview/ember \
    && cp -r ../preview-vue/dist/. public/preview/vue/ \
    && cp -r ../preview-svelte/dist/. public/preview/svelte/ \
    && cp -r ../preview-ember/dist/. public/preview/ember/ \
    && cp ../preview-router/index.html public/preview/index.html
RUN pnpm exec next build

# ---- runner: minimal standalone Next.js server ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=4000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/v4/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/v4/.next/static ./apps/v4/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/v4/public ./apps/v4/public

USER nextjs
EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD node -e "require('http').get('http://127.0.0.1:'+process.env.PORT+'/', r => process.exit(r.statusCode < 500 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "apps/v4/server.js"]
