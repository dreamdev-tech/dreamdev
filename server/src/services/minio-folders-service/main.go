package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/Aziz798/dreamdev/src/libs/go/bucket"
	"github.com/minio/minio-go/v7"
)

func main() {
	bucketName := flag.String("bucket", "", "Bucket name (required)")
	folderName := flag.String("folder", "", "Folder name (required)")

	flag.Usage = func() {
		fmt.Fprintf(flag.CommandLine.Output(), "Usage: %s --bucket <bucket-name> --folder <folder-name> [OPTIONS]\n", os.Args[0])
		flag.PrintDefaults()
	}

	flag.Parse()

	// Validate required flags
	if *bucketName == "" || *folderName == "" {
		flag.Usage()
		log.Fatalln("Both --bucket and --folder parameters are required")
	}
	minioClient, err := bucket.MinioNewClient()
	if err != nil {
		log.Fatalf("Error initializing MinIO client: %s\n", err.Error())
	}

	// Ensure bucket exists
	ctx := context.Background()
	err = minioClient.MakeBucket(ctx, *bucketName, minio.MakeBucketOptions{Region: "us-east-1"})
	if err != nil {
		exists, errBucketExists := minioClient.BucketExists(ctx, *bucketName)
		if errBucketExists != nil || !exists {
			log.Fatalf("Bucket check failed for '%s': %v\n", *bucketName, err)
		}
	}

	// Create a folder (upload an empty object with trailing slash)
	folderNameWithSlash := fmt.Sprintf("%s/", *folderName)
	_, err = minioClient.PutObject(ctx, *bucketName, folderNameWithSlash, nil, 0, minio.PutObjectOptions{})
	if err != nil {
		log.Fatalf("Failed to create folder '%s' in bucket '%s': %v\n", *folderName, *bucketName, err)
	}

	log.Printf("Folder '%s' created successfully in bucket '%s'\n", folderNameWithSlash, *bucketName)
}
