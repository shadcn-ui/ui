ARG NEXT_PUBLIC_APP_URL=https://ui.sciol.ac.cn
ARG NODE_VERSION=24

FROM node:${NODE_VERSION} AS base
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PNPM_HOME=/pnpm
RUN corepack enable \
    && corepack prepare pnpm@latest --activate
ENV PATH=$PNPM_HOME:$PATH

# 1) Install dependencies with maximal cache reuse
FROM base AS deps
WORKDIR /app

# Only copy lockfile and workspace manifests for better caching
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json tsconfig.json ./
COPY packages/shadcn/package.json packages/shadcn/
COPY packages/tests/package.json packages/tests/
COPY apps/v4/package.json apps/v4/

# If you have other apps/packages with postinstall/build hooks required for dependency graph,
# add their package.json similarly above to warm the install cache.

RUN pnpm fetch \
    && pnpm install --no-frozen-lockfile

# 2) Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app /app

ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

# Copy the full workspace (respect .dockerignore to keep context small)
COPY . .

# Build the v4 app (its script builds workspace package "shadcn" first)
RUN pnpm --filter v4 build

# 3) Create a minimal deployable directory for the v4 app with only prod deps
# This leverages pnpm deploy to gather exactly what's needed to run the app
FROM base AS deployer
WORKDIR /app
COPY --from=builder /app /app

ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

# Prune to production-only files for the v4 application
RUN pnpm deploy --filter v4 --prod /runtime

# 4) Final runtime image
FROM node:${NODE_VERSION} AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL


# Bring in the pruned app produced by pnpm deploy
COPY --from=deployer /runtime /app

# Expose the port used by apps/v4 (see scripts:start)
EXPOSE 3000

# Switch to the app workspace and drop privileges
WORKDIR /app/apps/v4

# Start Next.js in production
CMD ["node", "node_modules/next/dist/bin/next", "start", "-p", "3000"]
