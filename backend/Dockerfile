# ========================
# СТАДИЯ 1: Сборка проекта
# ========================
FROM node:20-alpine AS builder

WORKDIR /app

# Установка необходимых утилит
RUN apk add --no-cache git

# Копирование package.json и lock-файла
COPY package.json package-lock.json* ./

# Установка зависимостей
RUN npm install --legacy-peer-deps

# Копирование исходников
COPY . .

# Сборка проекта
RUN npm run build

# ==============================
# СТАДИЯ 2: Финальный контейнер
# ==============================
FROM node:20-alpine

WORKDIR /app

# Установка зависимостей для runtime
RUN apk add --no-cache tini

# Создание непривилегированного пользователя
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Копирование собранного приложения
COPY --from=builder /app /app

# Установка переменной окружения
ENV NODE_ENV=production

# Установка только продакшн-зависимостей
RUN npm install --omit=dev --legacy-peer-deps

# Переключение на непривилегированного пользователя
USER appuser

# Используем tini для управления процессами
ENTRYPOINT ["/sbin/tini", "--"]

# ⏳ Сначала миграции, потом запуск сервера
CMD ["sh", "-c", "node dist/migration-runner.js && node dist/main"]
