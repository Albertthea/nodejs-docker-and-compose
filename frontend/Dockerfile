# ==========================================
# Stage 1 — Build React
# ==========================================
FROM node:16-alpine AS builder

WORKDIR /app

# Копируем package.json и package-lock.json — для кеширования зависимостей
COPY package*.json ./

# Установка зависимостей
RUN npm ci

# Копируем весь проект
COPY . .

# Сборка фронтенда
RUN npm run build


# ==========================================
# Stage 2 — Nginx (production)
# ==========================================
FROM nginx:stable-alpine

# Удаляем дефолтный конфиг nginx
RUN rm /etc/nginx/conf.d/default.conf

# Копируем наш nginx-конфиг внутрь образа
COPY nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

# Копируем собранный build из первого этапа
COPY --from=builder /app/build /usr/share/nginx/html

# Порт nginx внутри контейнера
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
