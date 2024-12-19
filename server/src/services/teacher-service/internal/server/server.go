package server

import (
	"github.com/gofiber/fiber/v2"

	"github.com/Aziz798/dreamdev/src/libs/go/database"
	"github.com/Aziz798/dreamdev/src/libs/go/validations"
)

type TeacherService struct {
	*fiber.App

	db database.Service
}

func New() *TeacherService {
	server := &TeacherService{
		App: fiber.New(fiber.Config{
			ServerHeader: "dreamdev-admin-service",
			AppName:      "dreamdev-admin-service",
			ErrorHandler: func(c *fiber.Ctx, err error) error {
				return c.Status(fiber.StatusBadRequest).JSON(validations.GlobalErrorHandlerResp{
					Success: false,
					Message: err.Error(),
				})
			},
		}),

		db: database.New(),
	}

	return server
}
