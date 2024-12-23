package auth

import (
	"fmt"

	"github.com/Aziz798/dreamdev/src/libs/go/utils"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jmoiron/sqlx"
)

func loginTeacherQuery(email, password string, db *sqlx.DB) (string, string, error) {
	q := `SELECT id,role,password,is_premium FROM users WHERE email = $1 `
	var u struct {
		ID        pgtype.UUID `db:"id"`
		Role      string      `db:"role"`
		Password  *string     `db:"password"`
		IsPremium bool        `db:"is_premium"`
	}
	if err := db.Get(&u, q, email); err != nil {
		return "", "", fmt.Errorf("error logging in user: %s", err.Error())
	}
	if u.Role != "teacher" {
		return "", "", fmt.Errorf("user is not an teacher")
	}
	if err := utils.ComparePassword(*u.Password, password); err != nil {
		return "", "", fmt.Errorf("wrong email or password")
	}
	accessToken, refreshToken, err := utils.GenerateToken(u.ID, u.Role, u.IsPremium)
	if err != nil {
		return "", "", fmt.Errorf("error generating token :%s", err.Error())
	}
	return accessToken, refreshToken, nil
}
