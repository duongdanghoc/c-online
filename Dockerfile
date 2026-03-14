FROM node:20-alpine AS base

# 1. Install dependencies only when needed
FROM base AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./

RUN set -e; \
    ARCH=$(uname -m); \
    if [ "$ARCH" = "x86_64" ] || [ "$ARCH" = "amd64" ]; then \
        echo "Installing x64 architecture packages"; \
        npm i @tailwindcss/oxide-linux-x64-musl; \
        npm i lightningcss-linux-x64-musl; \
    elif [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then \
        echo "Installing arm64 architecture packages"; \
        npm i @tailwindcss/oxide-linux-arm64-musl; \
        npm i lightningcss-linux-arm64-musl; \
    else \
        echo "Unsupported architecture: $ARCH"; \
        exit 1; \
    fi

# Install remaining dependencies
RUN npm ci

# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Load environment variables from .env.docker file
ARG ENV_FILE=.env.docker
COPY ${ENV_FILE} .env

RUN npm run build
RUN npm prune --production

# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder /app/scripts ./scripts


# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

RUN chmod +x /app/scripts/replace-variables.sh
RUN chmod +x /app/scripts/start.sh

USER nextjs

EXPOSE 3000

ENV HOSTNAME=0.0.0.0

ENV PORT=3000

CMD ["/app/scripts/start.sh"]