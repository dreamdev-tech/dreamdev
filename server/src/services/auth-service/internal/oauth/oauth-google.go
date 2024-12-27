package oauth

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/jmoiron/sqlx"
	_ "github.com/joho/godotenv/autoload"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var (
	oauthConfig = &oauth2.Config{
		ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		RedirectURL:  os.Getenv("GOOGLE_REDIRECT_URL"),
		Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"},
		Endpoint:     google.Endpoint,
	}
	stateString = os.Getenv("GOOGLE_STATE_STRING")
)

func RegisterGoogleOAuthRoutes(app fiber.Router, db *sqlx.DB) {
	api := app.Group("/oauth/google")
	api.Get("/login", googleLoginRoute)
	api.Get("/callback", func(c *fiber.Ctx) error {
		return googleCallbackRoute(c, db)
	})
}

func googleLoginRoute(c *fiber.Ctx) error {
	url := oauthConfig.AuthCodeURL(stateString)
	return c.Redirect(url)
}

func googleCallbackRoute(c *fiber.Ctx, db *sqlx.DB) error {
	// Validate state
	if c.Query("state") != stateString {
		return c.Status(fiber.StatusBadRequest).SendString("Invalid state")
	}

	// Exchange code for token
	code := c.Query("code")
	token, err := oauthConfig.Exchange(context.Background(), code)
	if err != nil {
		log.Println("Error exchanging token:", err)
		return c.Status(fiber.StatusInternalServerError).SendString("Failed to exchange token")
	}

	// Use the token to get user info
	client := oauthConfig.Client(context.Background(), token)
	resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		log.Println("Error getting user info:", err)
		return c.Status(fiber.StatusInternalServerError).SendString("Failed to get user info")
	}
	defer resp.Body.Close()

	var userInfo map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&userInfo); err != nil {
		log.Println("Error decoding user info:", err)
		return c.Status(fiber.StatusInternalServerError).SendString("Failed to parse user info")
	}
	if userInfo["family_name"] == nil {
		userInfo["family_name"] = ""
	}
	userExists, err := googleCheckUserExistsQuery(userInfo["email"].(string), db)
	if err != nil {

		return c.Status(fiber.StatusInternalServerError).SendString("Failed to check if user exists")
	}
	if userExists {
		token, refreshToken, err := googleLoginUserQuery(userInfo["email"].(string), db)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString("Failed to login user")
		}
		response := fmt.Sprintf("%s?access_token=%s&refresh_token=%s", os.Getenv("FRONTEND_URL"), token, refreshToken)
		return c.Redirect(response)
	}
	a, refreshToken, err := googleCreateUserQuery(userInfo["email"].(string), userInfo["given_name"].(string), userInfo["family_name"].(string), db)
	if err != nil {
		log.Println(err.Error())
		return c.Status(fiber.StatusInternalServerError).SendString("Failed to create user")
	}

	response := fmt.Sprintf("%s?access_token=%s&refresh_token=%s", os.Getenv("FRONTEND_URL"), a, refreshToken)
	return c.Redirect(response)
}
