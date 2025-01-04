package chapter

import (
	"github.com/Aziz798/dreamdev/src/services/teacher-service/internal/types"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

func createChapterQuery(chapterToCreate types.CreateChapterType, db sqlx.DB) (uuid.UUID, error) {
	q := `INSERT INTO chapters (course_id, chapter_name, chapter_type) VALUES ($1, $2, $3) RETURNING id`
	var chapterID uuid.UUID
	err := db.Get(&chapterID, q, chapterToCreate.CourseID, chapterToCreate.Name, chapterToCreate.Type)
	if err != nil {
		return uuid.Nil, err
	}
	return chapterID, nil
}
