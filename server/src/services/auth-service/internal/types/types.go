package types

type SignupUser struct {
	FirstName       string `json:"first_name" db:"first_name"`
	LastName        string `json:"last_name" db:"last_name"`
	Email           string `json:"email" db:"email"`
	Password        string `json:"password" db:"password"`
	ConfirmPassword string `json:"confirm_password"`
}

type LoginUser struct {
	Email    string `json:"email" db:"email" validate:"required,email"`
	Password string `json:"password" db:"password" validate:"required,gte=6"`
}
