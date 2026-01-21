.PHONY: help install build dev start clean lint format test

help:
	@echo "Available commands:"
	@echo "  install    - Install dependencies"
	@echo "  build      - Build the application"
	@echo "  dev        - Start development server"
	@echo "  start      - Start production server"
	@echo "  clean      - Clean build artifacts"
	@echo "  lint       - Lint the code"
	@echo "  format     - Format the code"
	@echo "  test       - Run tests"

install:
	@echo "Installing dependencies..."
	npm install

build:
	@echo "Building application..."
	npm run build

dev:
	@echo "Starting development server..."
	npm run dev

start:
	@echo "Starting production server..."
	npm run start

clean:
	@echo "Cleaning build artifacts..."
	rm -rf .next
	rm -rf node_modules/.cache
	rm -rf out

lint:
	@echo "Linting code..."
	npx eslint . --ext .js,.jsx,.ts,.tsx

format:
	@echo "Formatting code..."
	npx prettier --write .

test:
	@echo "Running tests..."
	npm test
