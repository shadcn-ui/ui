FROM node:24.12.0-slim

RUN npm install -g pnpm@10.28.0

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Configure pnpm to use Nexus registry
# Use host.docker.internal for Mac/Windows, or 'nexus' if building via docker-compose
ARG NEXUS_REGISTRY=http://host.docker.internal:8081/repository/my-npm/
ENV PNPM_REGISTRY=${NEXUS_REGISTRY}
ENV PUPPETEER_SKIP_DOWNLOAD=true

WORKDIR /app

COPY . .

# Configure registry in .npmrc
RUN echo "registry=${NEXUS_REGISTRY}" >> .npmrc || true

RUN pnpm config set registry ${NEXUS_REGISTRY}

RUN pnpm install

RUN pnpm --filter=shadcn build 

RUN cd apps/v4 && pnpm next build

WORKDIR /app/apps/v4

CMD ["pnpm", "start"]
