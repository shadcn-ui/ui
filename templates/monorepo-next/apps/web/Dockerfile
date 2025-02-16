###############################################################################
# Base Images
###############################################################################
# Use Node.js 20 Alpine for both build and runtime stages.
# - base-build: Includes build dependencies (e.g. libc6-compat) for compiling assets.
# - base-runner: A minimal runtime image without build dependencies.
FROM node:20-alpine AS base-build
# Update APK and install libc6-compat in one layer.
RUN apk update && apk add --no-cache libc6-compat

FROM node:20-alpine AS base-runner

###############################################################################
# Builder Stage
###############################################################################
# Install build tools and prune the monorepo for the web scope.
FROM base-build AS builder
WORKDIR /app

# Install Turbo CLI globally for monorepo task orchestration.
RUN npm install -g turbo

# Copy the entire monorepo into the container.
COPY . .

# Prune the repository for the 'web' package, optimizing for Docker.
RUN turbo prune --scope=web --docker

###############################################################################
# Installer Stage
###############################################################################
# Install Node.js dependencies and build the web application.
FROM base-build AS installer
WORKDIR /app

# Copy pruned project files and the pnpm lockfile from the builder stage.
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Install Corepack, enable it, and prepare pnpm (matching the version in package.json).
RUN npm install -g corepack@latest \
  && corepack enable \
  && corepack prepare pnpm@9.12.3 --activate

# Install dependencies using pnpm with a frozen lockfile.
RUN pnpm install --frozen-lockfile

# Copy the complete pruned project files needed for the build.
COPY --from=builder /app/out/full/ .

# Ensure that the public directory exists for static assets.
RUN mkdir -p /app/apps/web/public

# Build the web application using Turbo, filtering for the 'web' package.
RUN pnpm dlx turbo run build --filter=web

###############################################################################
# Runner Stage (Final Image)
###############################################################################
# Create a minimal runtime environment with only the necessary runtime assets.
FROM base-runner AS runner
WORKDIR /app

# Create a dedicated non-root user for security.
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Switch to the non-root user.
USER nextjs

# Copy configuration files and metadata from the installer stage.
COPY --from=installer /app/apps/web/next.config.mjs .
COPY --from=installer /app/apps/web/package.json .

# Copy the built Next.js server, static assets, and public files.
# The --chown flag sets correct ownership for the non-root user.
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

# Expose the default Next.js port.
EXPOSE 3000

# Start the Next.js server.
CMD ["node", "apps/web/server.js"]
