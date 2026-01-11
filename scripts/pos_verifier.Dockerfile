# pos_verifier.Dockerfile
# Build and run this container to execute the POS verification in an isolated environment.
# Usage:
#  docker build -t pos-verifier -f scripts/pos_verifier.Dockerfile .
#  docker run --rm -e COOKIE='session=abc; other=def' -v "$PWD/tmp/pos-verification":/app/tmp pos-verifier

FROM node:20-slim
WORKDIR /app

# Copy only necessary files
COPY package.json package-lock.json* . || true
COPY scripts/pos_verification.cjs ./scripts/pos_verification.cjs
COPY scripts/pos_verification.js ./scripts/pos_verification.js

# Install pnpm then puppeteer
RUN corepack enable && corepack prepare pnpm@9.0.6 --activate
RUN pnpm add puppeteer@23.6.0 --silent

ENTRYPOINT ["node", "scripts/pos_verification.cjs"]
