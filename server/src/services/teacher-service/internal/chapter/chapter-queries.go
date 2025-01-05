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

func getChapterWithSectionsQuery(chapterID uuid.UUID, db *sqlx.DB) (*types.GetChapterWithSectionsType, error) {
	q := `
		SELECT
			chapters.chapter_name,
			chapters.chapter_type,
			chapters.is_verified,
			chapters.chapter_number,
			chapter_sections.id,
			chapter_sections.title,
			chapter_sections.text,
			chapter_sections.section_number
		FROM chapters
		LEFT JOIN chapter_sections
			ON chapters.id = chapter_sections.chapter_id
		WHERE chapters.id = $1
		`
	rows, err := db.Queryx(q, chapterID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	chapter := types.GetChapterWithSectionsType{
		Section: []*types.GetSectionsType{},
	}
	for rows.Next() {
		var section types.GetSectionsType
		err := rows.Scan(
			&chapter.Name,
			&chapter.Type,
			&chapter.IsVerified,
			&chapter.Number,
			&section.ID,
			&section.Title,
			&section.Text,
			&section.Number,
		)
		if err != nil {
			return nil, err
		}
		if section.ID != nil {
			chapter.Section = append(chapter.Section, &section)
		}
	}
	if rows.Err() != nil {
		return nil, rows.Err()
	}
	return &chapter, nil
}
