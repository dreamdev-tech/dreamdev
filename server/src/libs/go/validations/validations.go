package validations

import (
	"github.com/go-playground/validator/v10"
)

// Validator interface defines the contract for validation
type Validator interface {
	Validate(data interface{}) []string
}

// xValidator implements the Validator interface using a global validator instance
type xValidator struct {
	validator *validator.Validate
}

// GlobalErrorHandlerResp represents the structure for global error handling responses
type GlobalErrorHandlerResp struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

// Create a global validator instance
var globalValidator = &xValidator{
	validator: validator.New(validator.WithRequiredStructEnabled()),
}

// Validate validates the given data using the global validator instance
func (v *xValidator) Validate(data interface{}) []string {
	validationErrors := []string{}

	errs := v.validator.Struct(data)
	if errs != nil {
		for _, err := range errs.(validator.ValidationErrors) {
			validationErrors = append(validationErrors, err.Field())
		}
	}

	return validationErrors
}

// GetGlobalValidator returns the global validator instance
func GetGlobalValidator() Validator {
	return globalValidator
}
