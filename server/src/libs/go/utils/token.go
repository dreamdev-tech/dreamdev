package utils

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/jackc/pgx/v5/pgtype"
)

var (
	secretKey        = []byte(os.Getenv("JWT_SECRET_KEY"))
	refreshSecretKey = []byte(os.Getenv("REFRESH_TOKEN_SECRET_KEY"))
)

// GenerateToken generates a new access token and refresh token for the given user.
// The access token is valid for 15 minutes and the refresh token is valid for 7 days.
// The function returns the access token, refresh token and an error.
func GenerateToken(userID pgtype.UUID, userRole string, isPremium bool) (string, string, error) {
	// Access Token
	accessClaims := jwt.MapClaims{
		"user_id":    userID,
		"exp":        time.Now().Add(time.Minute * 15).Unix(), // Token valid for 15 minutes
		"user_role":  userRole,
		"is_premium": isPremium,
	}
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	accessTokenString, err := accessToken.SignedString(secretKey)
	if err != nil {
		return "", "", err
	}

	// Refresh Token
	refreshClaims := jwt.MapClaims{
		"user_id":    userID,
		"exp":        time.Now().Add(time.Hour * 24 * 7).Unix(), // Token valid for 7 days
		"user_role":  userRole,
		"is_premium": isPremium,
	}
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims)
	refreshTokenString, err := refreshToken.SignedString(refreshSecretKey)
	if err != nil {
		return "", "", err
	}

	return accessTokenString, refreshTokenString, nil
}

// VerifyToken verifies a token JWT validate
func VerifyToken(tokenString string, isRefreshToken bool) (jwt.MapClaims, error) {
	var key []byte
	if isRefreshToken {
		key = refreshSecretKey
	} else {
		key = secretKey
	}

	// Parse the token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Check the signing method
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("invalid signing method")
		}

		return key, nil
	})

	// Check for errors
	if err != nil {
		return nil, err
	}

	// Validate the token
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, fmt.Errorf("invalid token")
}

// RefreshToken verifies a refresh token, extracts the user_id, role, and premium status from it,
// generates a new access token and a new refresh token, and returns them.
// The new access token is valid for 15 minutes and the new refresh token is valid for 7 days.
// If the token is invalid or expired, the function returns an error.
func RefreshToken(tokenString string) (string, string, error) {
	// Verify the provided refresh token
	claims, err := VerifyToken(tokenString, true) // true indicates this is a refresh token
	if err != nil {
		log.Println(err.Error())
		return "", "", err
	}
	log.Println(claims)
	// Extract user_id from the claims
	userID := claims["user_id"]

	// Extract user_role from the claims
	userRole, ok := claims["user_role"].(string)
	if !ok {
		return "", "", fmt.Errorf("invalid token payload")
	}
	isPremium, ok := claims["is_premium"].(bool)
	if !ok {
		return "", "", fmt.Errorf("invalid token payload")
	}
	// Generate a new access token
	accessClaims := jwt.MapClaims{
		"user_id":    userID,                                  
		"exp":        time.Now().Add(time.Minute * 15).Unix(), // Token valid for 15 minutes
		"user_role":  userRole,
		"is_premium": isPremium,
	}
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	accessTokenString, err := accessToken.SignedString(secretKey)
	if err != nil {
		return "", "", err
	}

	// Generate a new refresh token
	refreshClaims := jwt.MapClaims{
		"user_id":    userID,
		"exp":        time.Now().Add(time.Hour * 24 * 7).Unix(), // Refresh token valid for another 7 days
		"user_role":  userRole,
		"is_premium": isPremium,
	}
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims)
	refreshTokenString, err := refreshToken.SignedString(refreshSecretKey)
	if err != nil {
		return "", "", err
	}

	// Return both the new access token and the new refresh token
	return accessTokenString, refreshTokenString, nil
}
