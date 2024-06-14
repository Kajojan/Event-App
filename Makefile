DOCKER_COMPOSE_FILE = docker-compose.yaml



build:
	@echo "Budowanie obrazów..."
	docker-compose -f $(DOCKER_COMPOSE_FILE) build

start:
	@echo "Uruchamianie kontenerów..."
	docker-compose -f $(DOCKER_COMPOSE_FILE) up -d

stop:
	@echo "Zatrzymywanie kontenerów..."
	docker-compose -f $(DOCKER_COMPOSE_FILE) down
