# Название образа и контейнера для Telegram-бота
IMAGE_NAME=telegram-bot
CONTAINER_NAME=my-telegram-bot

# Путь к папке с логами на сервере
LOGS_PATH=~/dmt-tgbot_gpt/logs

# Сборка Docker-образа для Telegram-бота
build:
	docker build -t $(IMAGE_NAME) .

# Запуск контейнера Telegram-бота в фоновом режиме с volume для логов
run:
	docker run -d --name $(CONTAINER_NAME) -v $(LOGS_PATH):/app/logs $(IMAGE_NAME)

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
