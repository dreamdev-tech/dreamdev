package types

import "github.com/google/uuid"

type CreateChapterType struct {
	CourseID uuid.UUID `json:"course_id" db:"course_id"`
	Name     string    `json:"chapter_name" db:"chapter_name"`
	Type     string    `json:"chapter_type" db:"chapter_type"`
}
