package chapter

import (
	"github.com/Aziz798/dreamdev/src/services/teacher-service/internal/types"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

func createChapterQuery(chapterToCreate types.CreateChapterType, db *sqlx.DB) (uuid.UUID, int, error) {
	q := `INSERT INTO chapters (course_id, chapter_name, chapter_type) VALUES ($1, $2, $3) RETURNING id, chapter_number`
	var chapterID uuid.UUID
	var chapterNumber int
	err := db.QueryRow(q, chapterToCreate.CourseID, chapterToCreate.Name, chapterToCreate.Type).Scan(&chapterID, &chapterNumber)
	if err != nil {
		return uuid.Nil, 0, err
	}
	return chapterID, chapterNumber, nil
}
