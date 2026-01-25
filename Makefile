# Docker Auto-Update Makefile

.PHONY: help dev prod watch clean rebuild logs

help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev: ## Start development environment with hot reload
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

prod: ## Start production environment
	docker-compose up --build -d

watch: ## Start with Watchtower auto-updates
	docker-compose -f docker-compose.watchtower.yml up --build -d

clean: ## Stop and remove all containers
	docker-compose down --remove-orphans
	docker system prune -f

rebuild: ## Force rebuild all containers
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d

logs: ## Show logs for all services
	docker-compose logs -f

backend-logs: ## Show backend logs only
	docker-compose logs -f backend

frontend-logs: ## Show frontend logs only
	docker-compose logs -f frontend

restart-backend: ## Restart backend service
	docker-compose restart backend

restart-frontend: ## Restart frontend service
	docker-compose restart frontend