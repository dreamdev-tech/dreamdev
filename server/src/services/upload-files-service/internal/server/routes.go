package server

import (
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/helmet"
	"github.com/gofiber/fiber/v2/middleware/idempotency"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/monitor"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func (s *UploadFilesServer) RegisterFiberRoutes() {
	api := s.App.Group("upload-files-service/api/v1/")
	origins := os.Getenv("FRONTEND_URL")
	api.Use(logger.New(logger.Config{
		Format: "\n[${time}] | [${status}] | [${method}] ${path}\n" +
			"Received: ${bytesReceived} bytes | Sent: ${bytesSent} bytes | " +
			"Latency: ${latency} | IP: ${ip} | Error: ${error}\n",
	}))
	api.Use(recover.New(recover.ConfigDefault))
	api.Use(helmet.New(helmet.ConfigDefault))
	api.Get("/api/metrics", monitor.New(monitor.Config{Title: "Miljon Go Server Page"}))
	api.Use(cors.New(cors.Config{
		AllowOrigins:     origins,
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization, X-Refresh-Token, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, Idempotency-Key,X-Cache",
		AllowMethods:     "GET,POST,PUT,OPTIONS",
		AllowCredentials: true,
	}))
	api.Use(idempotency.New(idempotency.ConfigDefault))
	api.Use(limiter.New(limiter.Config{
		Max:        10,
		Expiration: 2 * time.Minute,
		KeyGenerator: func(c *fiber.Ctx) string {
			return c.IP()
		},
		LimitReached: func(c *fiber.Ctx) error {
			return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
				"error": "Too many requests",
			})
		},
		SkipFailedRequests:     false,
		SkipSuccessfulRequests: false,
	}))
	api.Get("/health", s.healthHandler)
}

func (s *UploadFilesServer) healthHandler(c *fiber.Ctx) error {
	return c.JSON(s.db.Health())
}
