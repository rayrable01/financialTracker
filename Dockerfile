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

# Копируем готовый бандл фронтенда из builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Настройка SPA-роутинга (fallback на index.html для React Router)
RUN printf 'server {\n\
    listen 80;\n\
    location / {\n\
        root /usr/share/nginx/html;\n\
        index index.html;\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
