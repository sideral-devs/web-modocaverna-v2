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

# Args vindos do Coolify (build-time.env / --build-arg)
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_DEV_URL
ARG NEXT_PUBLIC_PROD_URL
ARG NEXT_PUBLIC_REGISTER
ARG NEXT_PUBLIC_YEARLY_PLAN
ARG NEXT_PUBLIC_MONTHLY_PLAN
ARG NEXT_PUBLIC_GOOGLE_METRIC_ID
ARG NEXT_PUBLIC_ENVIRONMENT

# Exporta como ENV para o Next enxergar no `npm run build`
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_DEV_URL=${NEXT_PUBLIC_DEV_URL}
ENV NEXT_PUBLIC_PROD_URL=${NEXT_PUBLIC_PROD_URL}
ENV NEXT_PUBLIC_REGISTER=${NEXT_PUBLIC_REGISTER}
ENV NEXT_PUBLIC_YEARLY_PLAN=${NEXT_PUBLIC_YEARLY_PLAN}
ENV NEXT_PUBLIC_MONTHLY_PLAN=${NEXT_PUBLIC_MONTHLY_PLAN}
ENV NEXT_PUBLIC_GOOGLE_METRIC_ID=${NEXT_PUBLIC_GOOGLE_METRIC_ID}
ENV NEXT_PUBLIC_ENVIRONMENT=${NEXT_PUBLIC_ENVIRONMENT}

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

# As variáveis públicas usadas pelo client também precisam existir no runtime.
# Aqui você pode:
# - Deixar o Coolify injetar via env (ideal), OU
# - Reutilizar os mesmos ARGs se quiser fixar no image (menos ideal p/ segredos).

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_DEV_URL
ARG NEXT_PUBLIC_PROD_URL
ARG NEXT_PUBLIC_REGISTER
ARG NEXT_PUBLIC_YEARLY_PLAN
ARG NEXT_PUBLIC_MONTHLY_PLAN
ARG NEXT_PUBLIC_GOOGLE_METRIC_ID
ARG NEXT_PUBLIC_ENVIRONMENT

ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_DEV_URL=${NEXT_PUBLIC_DEV_URL}
ENV NEXT_PUBLIC_PROD_URL=${NEXT_PUBLIC_PROD_URL}
ENV NEXT_PUBLIC_REGISTER=${NEXT_PUBLIC_REGISTER}
ENV NEXT_PUBLIC_YEARLY_PLAN=${NEXT_PUBLIC_YEARLY_PLAN}
ENV NEXT_PUBLIC_MONTHLY_PLAN=${NEXT_PUBLIC_MONTHLY_PLAN}
ENV NEXT_PUBLIC_GOOGLE_METRIC_ID=${NEXT_PUBLIC_GOOGLE_METRIC_ID}
ENV NEXT_PUBLIC_ENVIRONMENT=${NEXT_PUBLIC_ENVIRONMENT}

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
