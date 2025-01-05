package types

import "github.com/google/uuid"

type CreateChapterType struct {
	CourseID uuid.UUID `json:"course_id" db:"course_id"`
	Name     string    `json:"chapter_name" db:"chapter_name"`
	Type     string    `json:"chapter_type" db:"chapter_type"`
}

type GetChapterWithSectionsType struct {
	Name       *string            `json:"chapter_name" db:"chapter_name"`
	Type       *string            `json:"chapter_type" db:"chapter_type"`
	IsVerified *bool              `json:"is_verified" db:"is_verified"`
	Number     *int               `json:"chapter_number" db:"chapter_number"`
	Section    []*GetSectionsType `json:"sections" db:"sections"`
}
type GetSectionsType struct {
	ID     *uuid.UUID `json:"id" db:"id"`
	Title  *string    `json:"title" db:"title"`
	Text   *string    `json:"text" db:"text"`
	Number *int       `json:"section_number" db:"section_number"`
}
