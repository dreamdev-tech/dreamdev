package auth

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jmoiron/sqlx"
)

func RegisterAuthRoutes(app fiber.Router, db *sqlx.DB) {
	api := app.Group("/auth")
	api.Post("/login", func(c *fiber.Ctx) error {
		return loginHandler(c, db)
	})
}

func loginHandler(c *fiber.Ctx, db *sqlx.DB) error {
	var u struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := c.BodyParser(&u); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}
	if u.Email == "" || u.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Email and password are required",
		})
	}
	token, refreshToken, err := loginTeacherQuery(u.Email, u.Password, db)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"access_token":  token,
		"refresh_token": refreshToken,
	})
}
