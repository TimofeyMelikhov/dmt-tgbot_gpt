# Название образа и контейнера для Telegram-бота
IMAGE_NAME=telegram-bot
CONTAINER_NAME=my-telegram-bot

# Сборка Docker-образа для Telegram-бота
build:
	docker build -t $(IMAGE_NAME) .

# Запуск контейнера Telegram-бота в фоновом режиме
run:
	docker run -d --name $(CONTAINER_NAME) $(IMAGE_NAME)

# Остановка контейнера Telegram-бота
stop:
	docker stop $(CONTAINER_NAME)

# Удаление контейнера Telegram-бота
remove:
	docker rm $(CONTAINER_NAME)

# Перезапуск контейнера Telegram-бота
restart: stop remove run

# Очистка: остановка и удаление контейнера, а также удаление образа
clean: stop remove
	docker rmi $(IMAGE_NAME)
