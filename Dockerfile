# Базовый образ Node.js
FROM node:18-alpine

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем все файлы приложения в контейнер
COPY . .

# Указываем команду для запуска приложения
CMD ["npm", "start"]

# Открываем порт (по необходимости)
EXPOSE 3000
