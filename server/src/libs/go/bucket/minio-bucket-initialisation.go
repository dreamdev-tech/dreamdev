package bucket

import (
	"fmt"
	"os"

	_ "github.com/joho/godotenv/autoload"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

func getEnvBool(key string, defaultValue bool) bool {
	if value, exists := os.LookupEnv(key); exists {
		return value == "true" || value == "1"
	}
	return defaultValue
}

// MinioNewClient initializes a new MinIO client using environment variables for configuration.
// It retrieves the following environment variables:
// - MINIO_ACCESS_KEY_ID: the access key ID for MinIO (required).
// - MINIO_SECRET_ACCESS_KEY: the secret access key for MinIO (required).
// - MINIO_ENDPOINT: the endpoint for the MinIO server (default: "localhost:4200").
// - MINIO_USE_SSL: whether to use SSL for the connection (default: false).
//
// Returns a pointer to a minio.Client and an error if any of the required environment variables are not set
// or if there is an error creating the MinIO client.
func MinioNewClient() (*minio.Client, error) {
	accessKeyID := os.Getenv("MINIO_ACCESS_KEY_ID")
	if accessKeyID == "" {
		return nil, fmt.Errorf("environment variable MINIO_ACCESS_KEY_ID is not set")
	}

	secretAccessKey := os.Getenv("MINIO_SECRET_ACCESS_KEY")
	if secretAccessKey == "" {
		return nil, fmt.Errorf("environment variable MINIO_SECRET_ACCESS_KEY is not set")
	}

	endpoint := getEnv("MINIO_ENDPOINT", "localhost:4200")
	useSSL := getEnvBool("MINIO_USE_SSL", false)
	minioClient, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
		Secure: useSSL,
	})
	if err != nil {
		return nil, fmt.Errorf("error creating MinIO client (endpoint: %s): %s", endpoint, err.Error())
	}
	return minioClient, nil

}
