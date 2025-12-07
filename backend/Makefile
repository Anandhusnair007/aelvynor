.PHONY: install dev run test lint format type-check clean help

# Default Python interpreter
PYTHON := python3
VENV := venv
VENV_BIN := $(VENV)/bin
PIP := $(VENV_BIN)/pip
PYTHON_VENV := $(VENV_BIN)/python

help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Create virtual environment and install dependencies
	@echo "Creating virtual environment..."
	$(PYTHON) -m venv $(VENV)
	@echo "Installing dependencies..."
	$(PIP) install --upgrade pip
	$(PIP) install -r requirements.txt
	@echo "Installation complete! Activate with: source $(VENV)/bin/activate"

dev: ## Run development server with auto-reload
	@if [ ! -d "$(VENV)" ]; then \
		echo "Virtual environment not found. Run 'make install' first."; \
		exit 1; \
	fi
	$(PYTHON_VENV) -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

run: ## Run production server
	@if [ ! -d "$(VENV)" ]; then \
		echo "Virtual environment not found. Run 'make install' first."; \
		exit 1; \
	fi
	$(PYTHON_VENV) -m uvicorn app.main:app --host 0.0.0.0 --port 8000

db-init: ## Initialize database and create tables
	@if [ ! -d "$(VENV)" ]; then \
		echo "Virtual environment not found. Run 'make install' first."; \
		exit 1; \
	fi
	$(PYTHON_VENV) -c "from app.models import create_db_and_tables; from app.deps import engine; create_db_and_tables(engine)"

seed: ## Seed database with sample data
	@if [ ! -d "$(VENV)" ]; then \
		echo "Virtual environment not found. Run 'make install' first."; \
		exit 1; \
	fi
	$(PYTHON_VENV) scripts/seed.py

migration-create: ## Create a new migration (usage: make migration-create MESSAGE="description")
	@if [ ! -d "$(VENV)" ]; then \
		echo "Virtual environment not found. Run 'make install' first."; \
		exit 1; \
	fi
	@if [ -z "$(MESSAGE)" ]; then \
		echo "Error: MESSAGE is required. Usage: make migration-create MESSAGE=\"your message\""; \
		exit 1; \
	fi
	$(PYTHON_VENV) -m alembic revision --autogenerate -m "$(MESSAGE)"

migration-upgrade: ## Apply all pending migrations
	@if [ ! -d "$(VENV)" ]; then \
		echo "Virtual environment not found. Run 'make install' first."; \
		exit 1; \
	fi
	$(PYTHON_VENV) -m alembic upgrade head

migration-downgrade: ## Rollback one migration
	@if [ ! -d "$(VENV)" ]; then \
		echo "Virtual environment not found. Run 'make install' first."; \
		exit 1; \
	fi
	$(PYTHON_VENV) -m alembic downgrade -1

migration-history: ## Show migration history
	@if [ ! -d "$(VENV)" ]; then \
		echo "Virtual environment not found. Run 'make install' first."; \
		exit 1; \
	fi
	$(PYTHON_VENV) -m alembic history

migration-current: ## Show current migration version
	@if [ ! -d "$(VENV)" ]; then \
		echo "Virtual environment not found. Run 'make install' first."; \
		exit 1; \
	fi
	$(PYTHON_VENV) -m alembic current

test: ## Run tests
	@if [ ! -d "$(VENV)" ]; then \
		echo "Virtual environment not found. Run 'make install' first."; \
		exit 1; \
	fi
	$(PYTHON_VENV) -m pytest tests/ -v

lint: ## Run linter (ruff)
	@if [ ! -d "$(VENV)" ]; then \
		echo "Virtual environment not found. Run 'make install' first."; \
		exit 1; \
	fi
	$(PYTHON_VENV) -m ruff check .

format: ## Format code with black
	@if [ ! -d "$(VENV)" ]; then \
		echo "Virtual environment not found. Run 'make install' first."; \
		exit 1; \
	fi
	$(PYTHON_VENV) -m black .

type-check: ## Run type checker (mypy)
	@if [ ! -d "$(VENV)" ]; then \
		echo "Virtual environment not found. Run 'make install' first."; \
		exit 1; \
	fi
	$(PYTHON_VENV) -m mypy .

clean: ## Remove virtual environment and cache files
	rm -rf $(VENV)
	find . -type d -name __pycache__ -exec rm -r {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type d -name "*.egg-info" -exec rm -r {} +
	@echo "Cleanup complete!"

