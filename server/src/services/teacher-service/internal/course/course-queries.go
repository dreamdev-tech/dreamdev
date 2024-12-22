package course

import (
	"github.com/Aziz798/dreamdev/src/services/teacher-service/internal/types"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

func createCourseQuery(course types.CreateCourseType, db *sqlx.DB) (uuid.UUID, error) {
	var courseId uuid.UUID
	err := db.Get(&courseId, "INSERT INTO courses (teacher_id, name, description, course_image_url) VALUES ($1, $2, $3, $4) RETURNING id", course.TeacherID, course.Name, course.Description, course.ImageURL)
	if err != nil {
		return uuid.Nil, err
	}
	return courseId, nil
}