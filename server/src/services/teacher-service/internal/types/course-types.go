package types

import "github.com/google/uuid"

type CreateCourseType struct {
	Name        string    `json:"course_name" db:"course_name"`
	Description string    `json:"course_description" db:"course_description"`
	TeacherID   uuid.UUID `json:"teacher_id" db:"teacher_id"`
	ImageURL    string    `json:"course_image_url" db:"course_image_url"`
}

type GetCourseNameType struct {
	Name string    `json:"course_name" db:"course_name"`
	ID   uuid.UUID `json:"id" db:"id"`
}
type GetCourseWithChaptersType struct {
	Name        string    `json:"course_name" db:"course_name"`
	ImageURL    *string   `json:"course_image_url" db:"course_image_url"`
	Description string    `json:"course_description" db:"course_description"`
	IsVerified  *bool     `json:"is_verified" db:"is_verified"`
	Chapter     []Chapter `json:"chapters" db:"chapters"`
}
type Chapter struct {
	ID         *uuid.UUID `json:"id" db:"id"`
	Name       *string    `json:"chapter_name" db:"chapter_name"`
	Type       *string    `json:"chapter_type" db:"chapter_type"`
	IsVerified bool       `json:"is_verified" db:"is_verified"`
	Number     int        `json:"chapter_number" db:"chapter_number"`
}
