package server

import (
	"github.com/gofiber/fiber/v2"

	"github.com/Aziz798/dreamdev/src/libs/go/database"
	"github.com/Aziz798/dreamdev/src/libs/go/validations"
	"github.com/goccy/go-json"
)

type TeacherService struct {
	*fiber.App

	db database.Service
}

func New() *TeacherService {
	server := &TeacherService{
		App: fiber.New(fiber.Config{
			ServerHeader: "dreamdev-teacher-service",
			AppName:      "dreamdev-teacher-service",
			ErrorHandler: func(c *fiber.Ctx, err error) error {
				return c.Status(fiber.StatusBadRequest).JSON(validations.GlobalErrorHandlerResp{
					Success: false,
					Message: err.Error(),
				})
			},
			JSONEncoder: json.Marshal,
			JSONDecoder: json.Unmarshal,
		}),

		db: database.New(),
	}

	return server
}
