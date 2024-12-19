package server

import (
	"os"

	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/helmet"
	"github.com/gofiber/fiber/v2/middleware/idempotency"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/monitor"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func (s *TeacherService) RegisterFiberRoutes() {
	api := s.App.Group("teacher-service/api/v1/")
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
		AllowMethods:     "GET,POST,OPTIONS,PUT,DELETE",
		AllowCredentials: true,
	}))
	api.Use(idempotency.New(idempotency.ConfigDefault))
	// middleware.AdminMiddleware()
	// api.Get("/health", s.healthHandler)
}

// func (s *TeacherService) healthHandler(c *fiber.Ctx) error {
// 	return c.JSON(s.db.Health())
// }
