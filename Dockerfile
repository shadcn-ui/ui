# Multi-stage Dockerfile for the monorepo, targeting the Next.js app in apps/v4
# - Uses pnpm workspaces and Turbo build scripts
# - Builds in a separate stage and runs "next start" on port 4000

# syntax=docker/dockerfile:1.6
ARG NODE_VERSION=24
ARG NEXT_PUBLIC_APP_URL=https://ui.sciol.ac.cn

FROM node:${NODE_VERSION}-slim AS base
# Re-declare build args inside the stage to use them in RUN/ENV/etc.
ARG NEXT_PUBLIC_APP_URL
ENV PNPM_HOME=/usr/local/share/pnpm \
    NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ------------------------------
# deps: install workspace deps
# ------------------------------
FROM base AS deps
WORKDIR /app

# Only copy files needed to resolve and fetch deps for better layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.json ./
# Workspace manifests used by the v4 build
COPY apps/v4/package.json apps/v4/package.json
COPY packages/shadcn/package.json packages/shadcn/package.json

# Pre-fetch dependencies to leverage pnpm store cache
RUN pnpm fetch

# Bring in the full repo and link deps
COPY . .
RUN pnpm -w install --frozen-lockfile

# ------------------------------
# build: compile the v4 app
# ------------------------------
FROM deps AS build
ENV NODE_ENV=production \
    NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
WORKDIR /app

# Build the local package and then the Next.js app
RUN pnpm --filter=shadcn build \
    && pnpm --filter=v4 build

# ------------------------------
# runner: minimal runtime image
# ------------------------------
FROM node:${NODE_VERSION}-slim AS runner
# Re-declare to make the arg available in this stage as well
ARG NEXT_PUBLIC_APP_URL
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}

# Use a non-root user for security
USER node
WORKDIR /app

# Copy standalone output only (no pnpm/npm needed in runtime)
# Next.js standalone contains the server and minimal node_modules tree
COPY --chown=node:node --from=build /app/apps/v4/.next/standalone ./
COPY --chown=node:node --from=build /app/apps/v4/.next/static ./apps/v4/.next/static
COPY --chown=node:node --from=build /app/apps/v4/public ./apps/v4/public

# Expose the v4 app port
EXPOSE 3000

# Run the standalone server
WORKDIR /app/apps/v4
CMD ["node", "server.js"]
