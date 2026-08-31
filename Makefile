.PHONY: dev build test clean

# Start the full stack locally
dev:
	docker compose up --build

# Rebuild without cache (useful if package.json changed significantly)
rebuild:
	docker compose build --no-cache
	docker compose up

# Stop all containers
stop:
	docker compose down

# Clean up docker volumes and dangling images
clean:
	docker compose down -v
	docker system prune -f
