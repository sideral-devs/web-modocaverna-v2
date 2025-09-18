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
# Aproveita cache por arquivo lock
COPY --link package*.json ./
RUN --mount=type=cache,id=npm,target=/root/.npm \
    npm ci --no-audit --no-fund && \
    npm cache clean --force

############################################
# 3) Build (standalone)
############################################
FROM base AS builder
# Reaproveita node_modules da etapa "deps"
COPY --link --from=deps /app/node_modules ./node_modules
# Copia o resto do código
COPY --link . .

# Cache de build do Next (incremental)
RUN --mount=type=cache,target=/app/.next/cache \
    npm run build

############################################
# 4) Runtime mínimo e não-root
############################################
FROM node:22-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1

# Usuário não-root
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 --ingroup nodejs nextjs

# Copia só o necessário do build, já com proprietário correto
COPY --link --chown=nextjs:nodejs --from=builder /app/public ./public
COPY --link --chown=nextjs:nodejs --from=builder /app/.next/standalone ./
COPY --link --chown=nextjs:nodejs --from=builder /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
