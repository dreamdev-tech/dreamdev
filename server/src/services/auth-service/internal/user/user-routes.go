package user

import (
	"net/http"
	"regexp"

	"github.com/Aziz798/dreamdev/src/libs/go/validations"
	"github.com/Aziz798/dreamdev/src/services/auth-service/internal/types"
	"github.com/gofiber/fiber/v2"
	"github.com/jmoiron/sqlx"
)

func RegisterUserRoutes(app fiber.Router, db *sqlx.DB) {
	api := app.Group("/users")
	api.Post("/signup/email", func(c *fiber.Ctx) error {
		return registerUserWithEmailHAndler(c, db)
	})

	api.Post("/login/email", func(c *fiber.Ctx) error {
		return loginUserWithEmailHandler(c, db)
	})
}

func registerUserWithEmailHAndler(c *fiber.Ctx, db *sqlx.DB) error {
	var user types.SignupUser
	if err := c.BodyParser(&user); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}
	v := validations.GetGlobalValidator()
	errList := v.Validate(user)
	if len(errList) > 0 {
		return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{"status": "failed", "error": errList})
	}
	accessToken, refreshToken, err := signupUserWithEmailQuery(db, user)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error":  err.Error(),
			"status": "failed",
		})
	}
	return c.Status(fiber.StatusCreated).JSON(&fiber.Map{
		"status":        "success",
		"message":       "User created successfully",
		"access_token":  accessToken,
		"refresh_token": refreshToken,
	})
}

func loginUserWithEmailHandler(c *fiber.Ctx, db *sqlx.DB) error {
	var user types.LoginUser
	if err := c.BodyParser(&user); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}
	if user.Email == "" || user.Password == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"status": "failed",
			"error":  "Missing fields",
		})
	}
	emailRegex := `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
	re := regexp.MustCompile(emailRegex)
	if !re.MatchString(user.Email) {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"status": "failed",
			"error":  "Invalid email address",
		})
	}
	accessToken, refreshToken, err := loginUserQuery(db, user)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error":  err.Error(),
			"status": "failed",
		})

	}
	return c.Status(fiber.StatusOK).JSON(&fiber.Map{
		"status":        "success",
		"message":       "User created successfully",
		"access_token":  accessToken,
		"refresh_token": refreshToken,
	})
}
