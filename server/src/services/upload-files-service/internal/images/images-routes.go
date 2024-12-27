package images

import (
	"github.com/Aziz798/dreamdev/src/libs/go/middleware"
	"github.com/gofiber/fiber/v2"
)

var AcceptedImageTypes = []string{"jpg", "jpeg", "png", "webp"}

func isValidImageType(extension string) bool {
	for _, t := range AcceptedImageTypes {
		if t == extension {
			return true
		}
	}
	return false
}
func RegisterImagesRoutes(app fiber.Router) {
	api := app.Group("/images", middleware.IsTeacherMiddleware())
	api.Post("/upload-image", uploadImageHandler)

}

func uploadImageHandler(c *fiber.Ctx) error {
	_, err := c.FormFile("image")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}
	// imageExtension := filepath.Ext(image.Filename)
	// if !isValidImageType(imageExtension) {
	// 	return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
	// 		"error": "Invalid image type",
	// 	})
	// }
	// fileUrl, err := insertImageInMilio(image)
	// if err != nil {
	// 	return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
	// 		"error": err.Error(),
	// 	})
	// }
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"url": 'f',
	})

}
