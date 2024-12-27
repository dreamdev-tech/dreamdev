package oauth

import (
	"fmt"

	"github.com/Aziz798/dreamdev/src/libs/go/utils"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jmoiron/sqlx"
)

func googleCheckUserExistsQuery(email string, db *sqlx.DB) (bool, error) {
	q := `SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)`
	res, err := db.Query(q, email)
	if err != nil {
		return false, fmt.Errorf("error checking if user exists in database: %s", err.Error())
	}
	defer res.Close()
	res.Next()
	var exists bool
	err = res.Scan(&exists)
	if err != nil {
		return false, err
	}
	return exists, nil
}

func googleCreateUserQuery(email, firstName, lastName string, db *sqlx.DB) (string, string, error) {
	q := `INSERT INTO users (email, first_name, last_name,login_provider) VALUES ($1, $2, $3,$4) RETURNING id, role, is_premium`
	res, err := db.Query(q, email, firstName, lastName, "google")
	if err != nil {
		return "", "", fmt.Errorf("error creating user: %s", err.Error())
	}
	defer res.Close()
	res.Next()
	var id pgtype.UUID
	var role string
	var isPremium bool
	err = res.Scan(&id, &role, &isPremium)
	if err != nil {
		return "", "", fmt.Errorf("error scanning user creation query: %s", err.Error())
	}
	token, refreshToken, err := utils.GenerateToken(id, role, isPremium)
	if err != nil {
		return "", "", fmt.Errorf("error generating token for user: %s", err.Error())
	}
	return token, refreshToken, nil
}

func googleLoginUserQuery(email string, db *sqlx.DB) (string, string, error) {
	q := `SELECT id,role,is_premium FROM users WHERE email = $1`
	res, err := db.Query(q, email)
	if err != nil {
		return "", "", fmt.Errorf("error logging in user: %s", err.Error())
	}
	defer res.Close()
	res.Next()
	var id pgtype.UUID
	var role string
	var isPremium bool
	err = res.Scan(&id, &role, &isPremium)
	if err != nil {
		return "", "", fmt.Errorf("error scanning user login query: %s", err.Error())
	}
	token, refreshToken, err := utils.GenerateToken(id, role, isPremium)
	if err != nil {
		return "", "", fmt.Errorf("error generating token for user: %s", err.Error())
	}
	return token, refreshToken, nil
}
