.PHONY: help dev build start test lint type-check clean deploy

help:
	@echo "Available commands:"
	@echo "  make dev         - Start development server"
	@echo "  make build       - Build for production"
	@echo "  make start       - Start production server"
	@echo "  make test        - Run tests"
	@echo "  make lint        - Run linter"
	@echo "  make type-check  - TypeScript type check"
	@echo "  make clean       - Clean build artifacts"
	@echo "  make deploy      - Build and deploy with Docker"

dev:
	pnpm dev

build:
	pnpm build

start:
	pnpm start

test:
	pnpm test

lint:
	pnpm lint

type-check:
	pnpm type-check

clean:
	rm -rf .next out node_modules

deploy:
	docker compose down
	docker compose build
	docker compose up -d
	@echo "✅ Deployed at http://localhost:3009"
