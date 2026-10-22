# syntax=docker/dockerfile:1
ARG NEXT_PUBLIC_SERVER_URL=https://viettelnet.store
FROM node:24-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm install --global pnpm@10.11.1

FROM base AS dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Includes the Payload CLI and source for running database migrations.
FROM base AS tooling
COPY --from=dependencies --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node . .
RUN mkdir -p media && chown node:node /app media
USER node

FROM tooling AS builder
ARG NEXT_PUBLIC_SERVER_URL
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
# Dynamic pages don't access the database during build. No real secret enters the image.
RUN PAYLOAD_SECRET=build-only-placeholder-never-used-at-runtime \
    DATABASE_URL=postgresql://unused:unused@localhost:5432/unused \
    PAYLOAD_DB_PUSH=false \
    pnpm build

FROM node:24-bookworm-slim AS runner
WORKDIR /app
ARG NEXT_PUBLIC_SERVER_URL
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000 \
    NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL \
    PAYLOAD_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public
RUN mkdir -p media && chown node:node media
USER node
EXPOSE 3000
CMD ["node", "server.js"]
