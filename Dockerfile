# syntax=docker/dockerfile:1.7

############################################
# 1) Base comum
############################################
FROM node:22-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

############################################
# 2) Dependências (cache eficiente)
############################################
FROM base AS deps
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund \
 && npm cache clean --force

############################################
# 3) Build (standalone)
############################################
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .


# Build Next.js em modo standalone
RUN npm run build

############################################
# 4) Runtime mínimo e não-root
############################################
FROM node:22-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1

# Usuário não-root para rodar a app
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Copiar apenas o necessário do build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs
EXPOSE 4000

CMD ["node", "server.js"]
