package course

import (
	"github.com/Aziz798/dreamdev/src/libs/go/middleware"
	"github.com/Aziz798/dreamdev/src/services/teacher-service/internal/types"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

func RegisterCourseRoutes(app fiber.Router, db *sqlx.DB) {
	api := app.Group("/course")
	middleware.AuthenticationMiddleware()
	middleware.IsTeacherMiddleware()
	api.Post("/create", func(c *fiber.Ctx) error {
		return createCourseHandler(c, db)
	})

}

func createCourseHandler(c *fiber.Ctx, db *sqlx.DB) error {
	teacherID := c.Locals("user_id").(uuid.UUID)
	var course types.CreateCourseType
	course.TeacherID = teacherID
	if err := c.BodyParser(&course); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	courseId, err := createCourseQuery(course, db)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Course created successfully", "course_id": courseId})
}
