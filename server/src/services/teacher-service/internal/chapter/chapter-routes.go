package chapter

import (
	"github.com/Aziz798/dreamdev/src/libs/go/middleware"
	"github.com/Aziz798/dreamdev/src/services/teacher-service/internal/types"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

func RegisterChapterRoutes(app fiber.Router, db *sqlx.DB) {
	api := app.Group("/chapter", middleware.AuthenticationMiddleware(), middleware.IsTeacherMiddleware())
	api.Post("/create", func(c *fiber.Ctx) error {
		return createChapterHandler(c, db)
	})
}

func createChapterHandler(c *fiber.Ctx, db *sqlx.DB) error {
	var chapterToCreate types.CreateChapterType
	if err := c.BodyParser(&chapterToCreate); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	if chapterToCreate.Name == "" || chapterToCreate.CourseID == uuid.Nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Chapter name and course id are required"})
	}
	chapterID, chapterNumber, err := createChapterQuery(chapterToCreate, db)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"chapter_id": chapterID, "chapter_number": chapterNumber})
}
