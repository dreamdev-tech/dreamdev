package course

import (
	"github.com/Aziz798/dreamdev/src/services/teacher-service/internal/types"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

func createCourseQuery(course types.CreateCourseType, db *sqlx.DB) (uuid.UUID, error) {
	var courseId uuid.UUID
	err := db.Get(&courseId, "INSERT INTO courses (teacher_id, course_name, course_description, course_image_url) VALUES ($1, $2, $3, $4) RETURNING id", course.TeacherID, course.Name, course.Description, course.ImageURL)
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
			chapters.id AS chapter_id, 
			chapters.chapter_name, 
			chapters.chapter_type 
		FROM courses 
		LEFT JOIN chapters 
			ON courses.id = chapters.course_id 
		WHERE courses.id = $1
	`, courseID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Create the course struct
	var course types.GetCourseWithChaptersType
	chapterMap := make(map[uuid.UUID]bool)

	for rows.Next() {
		var chapter types.Chapter
		var chapterID uuid.UUID
		err := rows.Scan(
			&course.Name,
			&course.Description,
			&course.ImageURL,
			&chapterID,
			&chapter.Name,
			&chapter.Type,
		)
		if err != nil {
			return nil, err
		}
		if chapterID != uuid.Nil && !chapterMap[chapterID] {
			chapter.ID = &chapterID
			course.Chapter = append(course.Chapter, chapter)
			chapterMap[chapterID] = true
		}
	}

	if rows.Err() != nil {
		return nil, rows.Err()
	}

	return &course, nil
}
