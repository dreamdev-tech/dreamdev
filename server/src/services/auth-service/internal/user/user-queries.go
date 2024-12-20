package user

import (
	"fmt"
	"log"

	"github.com/Aziz798/dreamdev/src/libs/go/email"
	"github.com/Aziz798/dreamdev/src/libs/go/utils"
	"github.com/Aziz798/dreamdev/src/services/auth-service/internal/types"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jmoiron/sqlx"
)

// signupUserWithEmailQuery handles the signup process for a user with an email address.
// It performs the following steps:
// 1. Checks if the email already exists in the database.
// 2. Hashes the user's password.
// 3. Generates an OTP code for email verification.
// 4. Inserts the user into the database and retrieves their ID.
// 5. Sends an email verification to the user's email address.
// 6. Generates authentication tokens (access token and refresh token).
//
// Parameters:
// - db: A pointer to the sqlx.DB instance for database operations.
// - user: A SignupUser struct containing the user's signup details.
//
// Returns:
// - token: The generated access token for the user.
// - refreshToken: The generated refresh token for the user.
// - error: An error object if any step fails, otherwise nil.
func signupUserWithEmailQuery(db *sqlx.DB, user types.SignupUser) (string, string, error) {
	// Check if the email already exists
	exists, err := isEmailExistsQuery(db, user.Email)
	if err != nil {
		return "", "", fmt.Errorf("error checking if email exists: %w", err)
	}
	if exists {
		return "", "", fmt.Errorf("email already exists")
	}

	// Hash the user's password
	hashedPassword, err := utils.HashPassword(user.Password)
	if err != nil {
		return "", "", err
	}

	// Generate OTP code
	otpCode := utils.GenerateOTPCode()

	// Insert the user into the database and get their ID
	userID, err := insertUser(db, user, hashedPassword, otpCode)
	if err != nil {
		return "", "", err
	}

	// Send email verification
	email.SendEmailVerificationEmail(otpCode, user.Email)

	// Generate authentication tokens
	token, refreshToken, err := utils.GenerateToken(userID, "user")
	if err != nil {
		return "", "", fmt.Errorf("error generating tokens: %w", err)
	}

	return token, refreshToken, nil
}

func isEmailExistsQuery(db *sqlx.DB, email string) (bool, error) {
	var count int
	query := `SELECT COUNT(*) FROM users WHERE email = $1;`
	if err := db.Get(&count, query, email); err != nil {
		return false, fmt.Errorf("error checking if email exists: %w", err)
	}
	return count > 0, nil
}

func insertUser(db *sqlx.DB, user types.SignupUser, hashedPassword, otpCode string) (pgtype.UUID, error) {
	var userID pgtype.UUID
	query := `INSERT INTO users (first_name, last_name, email, password, otp_secret,login_provider)
            VALUES ($1, $2, $3, $4, $5,$6) RETURNING id;`
	if err := db.QueryRow(query, user.FirstName, user.LastName, user.Email, hashedPassword, otpCode, "email").Scan(&userID); err != nil {
		return userID, fmt.Errorf("error inserting user into database: %w", err)
	}
	return userID, nil
}

func loginUserQuery(db *sqlx.DB, user types.LoginUser) (string, string, error) {
	q := `SELECT id, password,is_active,role,login_provider FROM users WHERE email = $1;`
	var u struct {
		ID       pgtype.UUID `db:"id"`
		Password *string     `db:"password"`
		IsActive string      `db:"is_active"`
		Role     string      `db:"role"`
		Provider string      `db:"login_provider"`
	}
	if err := db.Get(&u, q, user.Email); err != nil {
		log.Println("error logging in user:", err.Error())
		return "", "", fmt.Errorf("email doesn't exist")
	}
	if u.Provider == "google" {
		return "", "", fmt.Errorf("user signed up with google try logging in with google 😊")
	}
	if err := utils.ComparePassword(*u.Password, user.Password); err != nil {
		return "", "", fmt.Errorf("wrong email or password")
	}
	accessToken, refreshToken, err := utils.GenerateToken(u.ID, u.Role)
	if err != nil {
		return "", "", fmt.Errorf("error generating token :%s", err.Error())
	}
	return accessToken, refreshToken, nil
}
