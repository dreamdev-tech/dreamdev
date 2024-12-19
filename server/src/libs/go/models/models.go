package models

import (
	"time"

	"github.com/google/uuid"
)

// UserRoles enum for roles
type UserRoles string
type ChapterType string

const (
	AdminRole       UserRoles   = "admin"
	studentRole     UserRoles   = "student"
	TeacherRole     UserRoles   = "teacher"
	LearnChapter    ChapterType = "learning"
	ExerciseChapter ChapterType = "exercise"
)

// User represents the users table
type User struct {
	ID               uuid.UUID  `db:"id" json:"id"`
	FirstName        string     `db:"first_name" json:"first_name"`
	LastName         string     `db:"last_name" json:"last_name"`
	Email            string     `db:"email" json:"email"`
	Role             UserRoles  `db:"role" json:"role"`
	Password         *string    `db:"password,omitempty" json:"-"`
	IsActive         bool       `db:"is_active" json:"is_active"`
	LoginProvider    string     `db:"login_provider" json:"login_provider"`
	OTPSecret        *string    `db:"otp_secret" json:"otp_secret,omitempty"`
	IsPremium        bool       `db:"is_premium" json:"is_premium"`
	PremiumStartDate *time.Time `db:"premium_start_date" json:"premium_start_date"`
	PremiumEndDate   *time.Time `db:"premium_end_date" json:"premium_end_date"`
	CreatedAt        time.Time  `db:"created_at" json:"created_at"`
	UpdatedAt        time.Time  `db:"updated_at" json:"updated_at"`
}

// ChapterSectionFile represents the chapter_section_files table
type ChapterSectionFile struct {
	ID               uuid.UUID `db:"id" json:"id"`
	ChapterSectionID string    `db:"chapter_section_id" json:"chapter_section_id"`
	FileTitle        *string   `db:"file_title" json:"file_title,omitempty"`
	FileType         *string   `db:"file_type" json:"file_type,omitempty"`
	FileURL          *string   `db:"file_url" json:"file_url"`
	CreatedAt        time.Time `db:"created_at" json:"created_at"`
	UpdatedAt        time.Time `db:"updated_at" json:"updated_at"`
}

// ChapterSection represents the chapter_sections table
type ChapterSection struct {
	ID        uuid.UUID `db:"id" json:"id"`
	ChapterID string    `db:"chapter_id" json:"chapter_id"`
	Text      string    `db:"text" json:"text"`
	CreatedAt time.Time `db:"created_at" json:"created_at"`
	UpdatedAt time.Time `db:"updated_at" json:"updated_at"`
}

// Chapter represents the chapters table
type Chapter struct {
	ID          uuid.UUID   `db:"id" json:"id"`
	CourseID    string      `db:"course_id" json:"course_id"`
	ChapterName string      `db:"chapter_name" json:"chapter_name"`
	ChapterType ChapterType `db:"chapter_type" json:"chapter_type"`
	CreatedAt   time.Time   `db:"created_at" json:"created_at"`
	UpdatedAt   time.Time   `db:"updated_at" json:"updated_at"`
}

// Course represents the courses table
type Course struct {
	ID                uuid.UUID `db:"id" json:"id"`
	CourseName        string    `db:"course_name" json:"course_name"`
	CourseImageURL    *string   `db:"course_image_url,omitempty" json:"course_image_url,omitempty"`
	CourseDescription string    `db:"course_description" json:"course_description"`
	CreatedAt         time.Time `db:"created_at" json:"created_at"`
	UpdatedAt         time.Time `db:"updated_at" json:"updated_at"`
}

// UserCourseProgress represents the user_course_progress table
type UserCourseProgress struct {
	ID           uuid.UUID `db:"id" json:"id"`
	UserCourseID string    `db:"user_course_id" json:"user_course_id"`
	ChapterID    string    `db:"chapter_id" json:"chapter_id"`
	IsFinished   bool      `db:"is_finished" json:"is_finished"`
	CreatedAt    time.Time `db:"created_at" json:"created_at"`
	UpdatedAt    time.Time `db:"updated_at" json:"updated_at"`
}

// UserCourse represents the user_courses table
type UserCourse struct {
	ID         uuid.UUID `db:"id" json:"id"`
	UserID     string    `db:"user_id" json:"user_id"`
	CourseID   string    `db:"course_id" json:"course_id"`
	IsFinished bool      `db:"is_finished" json:"is_finished"`
	CreatedAt  time.Time `db:"created_at" json:"created_at"`
	UpdatedAt  time.Time `db:"updated_at" json:"updated_at"`
}
