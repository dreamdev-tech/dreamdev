package middleware

import (
	"log"
	"strings"

	"github.com/Aziz798/dreamdev/src/libs/go/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgtype"
)

// AuthenticationMiddleware checks for the presence and validity of the Authorization header
// on every incoming request. If the token is invalid or expired, it checks if a refresh token
// is available in a custom header. If not, it returns an Unauthorized response. If the token is
// valid, it sets the user ID, role, and premium status from the token in the context and continues
// to the next middleware or handler.
func AuthenticationMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Check for Authorization header
		tokenString := c.Get("Authorization")
		if tokenString == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Missing authentication token"})
		}

		// The token should be prefixed with "Bearer "
		tokenParts := strings.Split(tokenString, " ")
		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid authentication token"})
		}

		tokenString = tokenParts[1]

		// Verify access token
		claims, err := utils.VerifyToken(tokenString, false)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid or expired token, refresh token required"})
		}
		// Set user ID from the token in the context
		c.Locals("user_id", claims["user_id"].(pgtype.UUID))
		// Set user role from the token in the context
		c.Locals("user_role", claims["user_role"])
		log.Println("aaaaaaaaaaaaaaq", c.Locals("user_id"))
		// Continue to the next middleware or handler
		return c.Next()
	}
}

// AdminMiddleware checks if the user is an administrator before allowing the request to proceed.
// If the user is not an administrator, it returns an Unauthorized response.
func AdminMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		userRole := c.Locals("user_role").(string)
		if userRole != "admin" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
		}
		return c.Next()
	}
}

// IsActiveMiddleware checks if the user is active before allowing the request to proceed.
// If the user is not active, it returns an Unauthorized response.
func IsActiveMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		userActive := c.Locals("user_active").(bool)
		if !userActive {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
		}
		return c.Next()
	}
}

func IsTeacherMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		userRole := c.Locals("user_role").(string)
		if userRole != "teacher" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
		}
		return c.Next()
	}
}
