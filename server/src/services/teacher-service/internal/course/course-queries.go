package course

import (
	"database/sql"

	"github.com/Aziz798/dreamdev/src/services/teacher-service/internal/types"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

func createCourseQuery(course types.CreateCourseType, db *sqlx.DB) (uuid.UUID, error) {
	var courseId uuid.UUID
	err := db.Get(&courseId, "INSERT INTO courses (teacher_id, course_name, course_description, course_image_url,is_verified) VALUES ($1, $2, $3, $4,$5) RETURNING id", course.TeacherID, course.Name, course.Description, course.ImageURL, false)
	if err != nil {
		return uuid.Nil, err
	}
	return courseId, nil
}
func getOneTeacherCoursesNamesQuery(teacherID uuid.UUID, db *sqlx.DB) ([]types.GetCourseNameType, error) {
	var courses []types.GetCourseNameType
	err := db.Select(&courses, "SELECT id,course_name FROM courses WHERE teacher_id = $1", teacherID)
	if err != nil {
		return nil, err
	}
	return courses, nil
}

func getCourseWithChaptersQuery(courseID uuid.UUID, db *sqlx.DB) (*types.GetCourseWithChaptersType, error) {
	rows, err := db.Queryx(`
        SELECT 
            courses.course_name, 
            courses.course_description, 
            courses.course_image_url, 
            courses.is_verified,
            chapters.id AS chapter_id, 
            chapters.chapter_name, 
            chapters.chapter_type,
            chapters.is_verified,
            chapters.chapter_number
        FROM courses 
        LEFT JOIN chapters 
            ON courses.id = chapters.course_id 
        WHERE courses.id = $1
    `, courseID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	course := types.GetCourseWithChaptersType{
		Chapter: []types.Chapter{},
	}

	chapterMap := make(map[uuid.UUID]bool)
	for rows.Next() {
		var chapter types.Chapter
		var chapterID uuid.UUID
		var isVerified sql.NullBool

		err := rows.Scan(
			&course.Name,
			&course.Description,
			&course.ImageURL,
			&course.IsVerified,
			&chapterID,
			&chapter.Name,
			&chapter.Type,
			&isVerified,
			&chapter.Number,
		)
		if err != nil {
			return nil, err
		}

		if isVerified.Valid {
			isVerifiedPtr := isVerified.Bool
			chapter.IsVerified = &isVerifiedPtr
		} else {
			chapter.IsVerified = nil
		}

		if chapterID != uuid.Nil && !chapterMap[chapterID] {
			chapter.ID = &chapterID
			course.Chapter = append(course.Chapter, chapter)
			chapterMap[chapterID] = true
		}
	}

	// Check for row errors after iteration
	if rows.Err() != nil {
		return nil, rows.Err()
	}

	return &course, nil
}
