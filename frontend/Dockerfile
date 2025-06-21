# ===============================
# СТАДИЯ 1: Установка и сборка
# ===============================
FROM node:18.18-alpine AS builder

WORKDIR /app

# Копируем package.json и lock-файл (если есть)
COPY package.json ./
# COPY package-lock.json ./  # Раскомментируй, если файл есть

# Установка зависимостей
RUN npm install

# Копируем исходный код
COPY . .

# Установка переменных окружения для билда
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NODE_ENV=production

# Сборка фронтенда
RUN npm run build

# ===============================
# СТАДИЯ 2: Запуск в production
# ===============================
FROM node:18.18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
EXPOSE 3000

# Копируем только нужное
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Запуск Next.js сервера
CMD ["npm", "start"]
