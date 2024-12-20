package types

import "github.com/google/uuid"

type CreateCourseType struct {
	Name        string    `json:"course_name" db:"course_name"`
	Description string    `json:"course_description" db:"course_description"`
	TeacherID   uuid.UUID `json:"teacher_id" db:"teacher_id"`
	ImageURL    string    `json:"course_image_url" db:"course_image_url"`
}
