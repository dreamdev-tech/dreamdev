db-generate:
	@echo "Generating database..."
	@pnpm run db:generate

db-migrate:
	@echo "Migrating database..."
	@pnpm run db:migrate

db-studio:
	@echo "Opening database studio..."
	@pnpm run db:studio

build-auth-service:
	@echo "Building auth service..."
	@go build -o bin/auth-service ./src/services/auth-service/cmd/api/main.go

run-auth-service: build-auth-service
	@echo "Running auth service..."
	@./bin/auth-service

build-teacher-service:
	@echo "Building teacher service..."
	@go build -o bin/teacher-service ./src/services/teacher-service/cmd/api/main.go

run-teacher-service: build-teacher-service
	@echo "Running teacher service..."
	@./bin/teacher-service

run-all:
	@echo "Running all services..."
	@go run .src/services/auth-service/cmd/api/main.go&

# Create DB container
docker-run:
	@if docker compose up -d 2>/dev/null; then \
		: ; \
	else \
		echo "Falling back to Docker Compose V1"; \
		docker-compose up -d; \
	fi

# Shutdown DB container
docker-down:
	@if docker compose down 2>/dev/null; then \
		: ; \
	else \
		echo "Falling back to Docker Compose V1"; \
		docker-compose down; \
	fi


# Clean the binary
clean:
	@echo "Cleaning..."
	@rm -rf bin 

# Variables for arguments
BIN_DIR := bin
SERVICE_NAME := minio-folder-service
OUTPUT := $(BIN_DIR)/$(SERVICE_NAME)
GO_FILE := services/minio-folders-service/main.go

# Build and run the service
minio-folder-add:
	@echo "Building the service..."
	@mkdir -p $(BIN_DIR)
	@go build -o $(OUTPUT) $(GO_FILE)
	@echo 'Usage example:'
	@echo '  make run-minio-folder-add ARGS="--endpoint localhost:9000 --access-key root --secret-key root --bucket example-bucket --folder my-folder"'

run-minio-folder-add:
	@echo "Running the service with provided arguments..."
	@$(OUTPUT) $(ARGS)

build-file-upload-service:
	@echo "Building file upload service..."
	@cargo build -p file-upload-service

run-file-upload-service: build-file-upload-service
	@echo "Running file upload service..."
	@cargo run -p file-upload-service

release-file-upload-service:
	@echo "Releasing file upload service..."
	@cargo build -p file-upload-service --release