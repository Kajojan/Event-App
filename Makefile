DOCKER_COMPOSE_FILE = docker-compose.yaml


build:
	@echo "Budowanie obrazów..."
	    docker compose -f docker-compose.yaml build

build-dev: 
	docker compose -f docker-compose-dev.yaml build

dev:
	@echo "Uruchamianie kontenerów Developer..."
	docker compose -f docker-compose-dev.yaml up 

start:
	@echo "Uruchamianie kontenerów..."
	docker compose -f $(DOCKER_COMPOSE_FILE) up -d

stop:
	@echo "Zatrzymywanie kontenerów..."
	docker compose -f $(DOCKER_COMPOSE_FILE) down
