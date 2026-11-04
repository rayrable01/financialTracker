# ─────────────────────────────────────────────
# Stage 1: Builder — сборка фронтенда
# ─────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Копируем манифесты для кэширования слоя зависимостей
COPY package*.json ./
RUN npm ci

# Копируем исходники и собираем продакшен-бандл
COPY . .
RUN npm run build

# ─────────────────────────────────────────────
# Stage 2: Runtime — статический веб-сервер Nginx (~25MB)
# ─────────────────────────────────────────────
FROM nginx:alpine AS runtime

# Копируем оптимизированную конфигурацию Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем готовый бандл фронтенда из builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
