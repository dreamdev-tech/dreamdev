# Use an official Golang image as the base
FROM golang:1.23.4-alpine AS builder

# Set environment variables for Go modules and app
ENV CGO_ENABLED=0 GOOS=linux GOARCH=amd64

# Set the working directory
WORKDIR /app

# Copy Go modules manifests first to leverage Docker caching
COPY go.mod go.sum ./
# Copy the shared library
COPY src/libs/go ./src/libs/go

# Copy the auth-service
COPY src/services/auth-service ./src/services/auth-service

RUN go mod tidy && go mod download

# Build the auth-service binary
WORKDIR /app/src/services/auth-service/cmd/api
RUN go build -o /auth-service

# Use a minimal image for the runtime
FROM alpine:3.18

# Set the working directory in the final image
WORKDIR /root/

# Copy the binary from the builder
COPY --from=builder /auth-service .

# Expose the port the service will run on
EXPOSE 8080

# Command to run the application
CMD ["./auth-service"]
