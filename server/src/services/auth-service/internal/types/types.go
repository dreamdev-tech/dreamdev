package types

type SignupUser struct {
	FirstName       string `json:"first_name" db:"first_name" validate:"required"`
	LastName        string `json:"last_name" db:"last_name" validate:"required"`
	Email           string `json:"email" db:"email" validate:"required,email"`
	Password        string `json:"password" db:"password" validate:"required,gte=6"`
	ConfirmPassword string `json:"confirm_password" validate:"required,eqfield=Password"`
}

type LoginUser struct {
	Email    string `json:"email" db:"email" validate:"required,email"`
	Password string `json:"password" db:"password" validate:"required,gte=6"`
}
