package server

import (
	"github.com/gofiber/fiber/v2"

	"github.com/Aziz798/dreamdev/src/libs/go/database"
	"github.com/Aziz798/dreamdev/src/libs/go/validations"
)

type UploadFilesServer struct {
	*fiber.App

	db database.Service
}

func New() *UploadFilesServer {
	server := &UploadFilesServer{
		App: fiber.New(fiber.Config{
			ServerHeader: "dreamdev-upload-files-service",
			AppName:      "dreamdev-upload-files-service",
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
