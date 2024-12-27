package server

import (
	"log"
	"os"
	"time"

	"github.com/Aziz798/dreamdev/src/libs/go/utils"
	"github.com/Aziz798/dreamdev/src/services/auth-service/internal/oauth"
	"github.com/Aziz798/dreamdev/src/services/auth-service/internal/user"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/helmet"
	"github.com/gofiber/fiber/v2/middleware/idempotency"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/monitor"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func (s *AuthServer) RegisterFiberRoutes() {
	api := s.App.Group("auth-service/api/v1/")
	studentClientUrl := os.Getenv("STUDENT_FRONTEND_URL")
	teacherClientUrl := os.Getenv("TEACHER_FRONTEND_URL")
	api.Use(logger.New(logger.Config{
		Format: "\n[${time}] | [${status}] | [${method}] ${path}\n" +
			"Received: ${bytesReceived} bytes | Sent: ${bytesSent} bytes | " +
			"Latency: ${latency} | IP: ${ip} | Error: ${error}\n",
	}))
	api.Use(recover.New(recover.ConfigDefault))
	api.Use(helmet.New(helmet.ConfigDefault))
	api.Get("/api/metrics", monitor.New(monitor.Config{Title: "Miljon Go Server Page"}))
	api.Use(cors.New(cors.Config{
		AllowOrigins:     studentClientUrl + "," + teacherClientUrl,
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization, X-Refresh-Token, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, Idempotency-Key,X-Cache",
		AllowMethods:     "GET,POST,OPTIONS",
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
	api.Post("/refresh/token", limiter.New(limiter.Config{
		Max:        5,
		Expiration: 1 * time.Minute,
	}), RefreshTokenHandler)
	user.RegisterUserRoutes(api, s.db.DB())
	oauth.RegisterGoogleOAuthRoutes(api, s.db.DB())
}

// RefreshTokenHandler handles the token refresh process.
// It verifies the provided refresh token and returns new access and refresh tokens.
func RefreshTokenHandler(c *fiber.Ctx) error {
	// Get the refresh token from the request body (or headers)
	type RefreshRequest struct {
		RefreshToken string `json:"refresh_token"`
	}

	var request RefreshRequest
	if err := c.BodyParser(&request); err != nil {
		log.Println(err.Error())
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if request.RefreshToken == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Missing refresh token",
		})
	}

	// Refresh the tokens
	newAccessToken, newRefreshToken, err := utils.RefreshToken(request.RefreshToken)
	if err != nil {
		log.Println(err.Error())
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid or expired refresh token",
		})
	}

	// Return the new tokens
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"accessToken":  newAccessToken,
		"refreshToken": newRefreshToken,
	})
}
