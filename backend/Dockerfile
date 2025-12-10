# ==========================================
# 1. Stage — Build
# ==========================================
FROM node:16-alpine AS builder

# Рабочая директория
WORKDIR /app

# Устанавливаем зависимости
COPY package*.json ./

# npm ci — оптимальный вариант для CI/CD (если есть package-lock.json)
RUN npm ci

# Копируем исходники
COPY . .

# Сборка NestJS → dist
RUN npm run build


# ==========================================
# 2. Stage — Production
# ==========================================
FROM node:16-alpine AS production

WORKDIR /app

# Установка pm2 для запуска в Docker
RUN npm install -g pm2

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем только production-зависимости
RUN npm ci --only=production

# Копируем собранный dist из builder
COPY --from=builder /app/dist ./dist

# Копируем ecosystem.config.js (файл песочницы pm2)
COPY ecosystem.config.js ./

# Открываем порт (тот, который использует NestJS)
EXPOSE 3000

# Запуск приложения через pm2-runtime
CMD ["pm2-runtime", "ecosystem.config.js"]
