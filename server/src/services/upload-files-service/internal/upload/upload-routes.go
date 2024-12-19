package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/Aziz798/dreamdev/src/libs/go/bucket"
	"github.com/gofiber/fiber/v2"
	"github.com/minio/minio-go/v7"
)

func transcodeToHLS(inputFile string, outputDir string) error {
	// Define output directories for each resolution
	qualityDirs := []string{"360p", "480p", "720p"}

	// Create the directories for each resolution
	for _, dir := range qualityDirs {
		dirPath := filepath.Join(outputDir, dir)
		err := os.MkdirAll(dirPath, os.ModePerm)
		if err != nil {
			return fmt.Errorf("failed to create directory %s: %w", dirPath, err)
		}
	}

	// Define the FFmpeg command to create multiple resolutions and segment the video
	cmd := exec.Command("ffmpeg",
		"-i", inputFile,
		"-c:v", "libx264", "-b:v:0", "2000k", "-s:v:0", "1280x720", "-preset", "fast", "-g", "50", "-sc_threshold", "0", "-an", "-f", "hls", "-hls_time", "10", "-hls_playlist_type", "vod", "-hls_segment_filename", filepath.Join(outputDir, "720p", "720p_%03d.ts"), filepath.Join(outputDir, "720p", "720p.m3u8"),
		"-c:v", "libx264", "-b:v:1", "1000k", "-s:v:1", "854x480", "-preset", "fast", "-g", "50", "-sc_threshold", "0", "-an", "-f", "hls", "-hls_time", "10", "-hls_playlist_type", "vod", "-hls_segment_filename", filepath.Join(outputDir, "480p", "480p_%03d.ts"), filepath.Join(outputDir, "480p", "480p.m3u8"),
		"-c:v", "libx264", "-b:v:2", "500k", "-s:v:2", "640x360", "-preset", "fast", "-g", "50", "-sc_threshold", "0", "-an", "-f", "hls", "-hls_time", "10", "-hls_playlist_type", "vod", "-hls_segment_filename", filepath.Join(outputDir, "360p", "360p_%03d.ts"), filepath.Join(outputDir, "360p", "360p.m3u8"))

	// Run the FFmpeg command
	err := cmd.Run()
	if err != nil {
		return fmt.Errorf("failed to transcode video: %w", err)
	}

	// Create the master playlist that references all resolutions
	masterPlaylist := `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:10
#EXT-X-MEDIA-SEQUENCE:0
#EXT-X-STREAM-INF:BANDWIDTH=2000000,RESOLUTION=1280x720
720p/720p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=1000000,RESOLUTION=854x480
480p/480p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=500000,RESOLUTION=640x360
360p/360p.m3u8`

	// Write the master playlist to the output directory
	err = os.WriteFile(filepath.Join(outputDir, "master.m3u8"), []byte(masterPlaylist), 0644)
	if err != nil {
		return fmt.Errorf("failed to create master playlist: %w", err)
	}

	return nil
}

func main() {
	// Create a new Fiber app
	app := fiber.New(fiber.Config{
		// Increase max request body size to 100MB (adjust as needed)
		AppName:               "Video Upload App",
		BodyLimit:             100 * 1024 * 1024, // 100MB limit
		DisableStartupMessage: true,
	})

	// Initialize MinIO client
	minioClient, err := bucket.MinioNewClient()
	if err != nil {
		log.Fatalf("Error initializing MinIO client: %s\n", err.Error())
	}

	// Ensure the bucket exists
	bucketName := "dreamdev"
	exists, err := minioClient.BucketExists(context.Background(), bucketName)
	if err != nil {
		log.Fatalf("Error checking bucket existence: %v", err)
	}
	if !exists {
		err = minioClient.MakeBucket(context.Background(), bucketName, minio.MakeBucketOptions{})
		if err != nil {
			log.Fatalf("Error creating bucket: %v", err)
		}
	}

	// Define the route for uploading videos
	app.Post("/upload", func(c *fiber.Ctx) error {
		// Handle file upload
		file, err := c.FormFile("video")
		if err != nil {
			return c.Status(http.StatusBadRequest).SendString("No file uploaded")
		}

		// Save the file temporarily
		tempFilePath := fmt.Sprintf("./%s", file.Filename)
		err = c.SaveFile(file, tempFilePath)
		if err != nil {
			return c.Status(http.StatusInternalServerError).SendString("Failed to save file")
		}
		defer os.Remove(tempFilePath) // Clean up temporary file after upload

		// Prepare the output directory for HLS
		outputDir := "./hls_output"
		err = os.MkdirAll(outputDir, os.ModePerm)
		if err != nil {
			return c.Status(http.StatusInternalServerError).SendString("Failed to create output directory")
		}

		// Transcode the video to HLS format
		err = transcodeToHLS(tempFilePath, outputDir)
		if err != nil {
			return c.Status(http.StatusInternalServerError).SendString("Failed to transcode video")
		}

		// Upload the HLS files to MinIO
		err = uploadHLSFilesToMinIO(outputDir, minioClient, bucketName)
		if err != nil {
			return c.Status(http.StatusInternalServerError).SendString("Failed to upload HLS files to MinIO")
		}

		// Return a success response
		return c.SendString("File uploaded and transcoded successfully")
	})

	// Start the server
	log.Fatal(app.Listen(":3000"))
}

func uploadHLSFilesToMinIO(outputDir string, minioClient *minio.Client, bucketName string) error {
	// Upload the .m3u8 playlists and .ts video segments to MinIO
	err := filepath.Walk(outputDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		// Skip directories
		if info.IsDir() {
			return nil
		}

		// Upload file to MinIO
		relPath, err := filepath.Rel(outputDir, path)
		if err != nil {
			return fmt.Errorf("failed to get relative path for %s: %w", path, err)
		}
		objectName := fmt.Sprintf("hls/%s", relPath)
		contentType := "application/octet-stream"

		// Set content type based on file extension
		if filepath.Ext(path) == ".m3u8" {
			contentType = "application/x-mpegURL"
		} else if filepath.Ext(path) == ".ts" {
			contentType = "video/mp2t"
		}

		_, err = minioClient.FPutObject(context.Background(), bucketName, objectName, path, minio.PutObjectOptions{
			ContentType: contentType,
		})
		if err != nil {
			return fmt.Errorf("failed to upload file %s: %w", path, err)
		}

		return nil
	})
	return err
}

func transcodeToHLS360(inputFile, outputDir string) error {
	return nil
}

// ffmpeg -i vecteezy_2-minute-countdown-timer-animation-on-black-background_39859523.mp4 \
// -filter_complex \
//   "[0:v]split=3[v1][v2][v3]; \
//    [v1]scale=w=1920:h=1080[v1out]; \
//    [v2]scale=w=1280:h=720[v2out]; \
//    [v3]scale=w=854:h=480[v3out]" \
// -map "[v1out]" -c:v:0 libx264 -b:v:0 5000k -maxrate:v:0 5350k -bufsize:v:0 7500k \
// -map "[v2out]" -c:v:1 libx264 -b:v:1 2800k -maxrate:v:1 2996k -bufsize:v:1 4200k \
// -map "[v3out]" -c:v:2 libx264 -b:v:2 1400k -maxrate:v:2 1498k -bufsize:v:2 2100k \
// -map a:0 -c:a aac -b:a:0 192k -ac 2 \
// -map a:0 -c:a aac -b:a:1 128k -ac 2 \
// -map a:0 -c:a aac -b:a:2 96k -ac 2 \
// -f hls \
// -hls_time 10 \
// -hls_playlist_type vod \
// -hls_flags independent_segments \
// -hls_segment_type mpegts \
// -hls_segment_filename stream_%v/data%03d.ts \
// -master_pl_name master.m3u8 \
// -var_stream_map "v:0,a:0 v:1,a:1 v:2,a:2" \
// stream_%v/playlist.m3u8
