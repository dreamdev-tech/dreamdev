package images

import (
	"context"
	"fmt"
	"mime/multipart"
	"os"
	"path/filepath"

	"github.com/Aziz798/dreamdev/src/libs/go/bucket"
	"github.com/google/uuid"
	_ "github.com/joho/godotenv/autoload"
	"github.com/minio/minio-go/v7"
)

func insertImageInMilio(img *multipart.FileHeader) (string, error) {
	minioServerURL := fmt.Sprintf("%s/dreamdev", os.Getenv("MINIO_ENDPOINT"))
	client, err := bucket.MinioNewClient()
	if err != nil {
		return "", fmt.Errorf("error creating minio client: %s", err.Error())
	}

	// Open the image file
	file, err := img.Open()
	if err != nil {
		return "", fmt.Errorf("error opening image: %s", err.Error())
	}
	defer file.Close()
	customFileName := uuid.New().String()
	// Get the file extension and name
	ext := filepath.Ext(img.Filename)
	objectName := fmt.Sprintf("courses_images/%s", customFileName+img.Filename) // Store under 'courses_images' folder

	// Upload the image to the MinIO bucket
	_, err = client.PutObject(
		context.Background(), // Context
		"dreamdev",           // Bucket name
		objectName,           // Object name (path in the bucket)
		file,                 // File content
		img.Size,             // File size
		minio.PutObjectOptions{ContentType: "image/" + ext[1:]}, // Content type based on file extension
	)
	if err != nil {
		return "", fmt.Errorf("error uploading image to MinIO: %s", err.Error())
	}

	// Generate a public URL (adjust according to your server configuration)
	url := fmt.Sprintf("%s/%s", minioServerURL, objectName)

	return url, nil
}
