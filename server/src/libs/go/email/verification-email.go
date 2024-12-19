package email

import (
	"context"
	"fmt"
	"os"
	"time"

	_ "github.com/joho/godotenv/autoload"
	"github.com/mailgun/mailgun-go/v4"
)

var (
	domainName   = os.Getenv("MAILGUN_DOMAIN")
	apiKey       = os.Getenv("MAILGUN_API_KEY")
	emailAddress = os.Getenv("EMAIL_ADDRESS")
)

func SendEmailVerificationEmail(otpCode, recipientEmail string) error {
	mg := mailgun.NewMailgun(domainName, apiKey)
	mg.SetAPIBase(mailgun.APIBaseEU)
	sender := emailAddress
	subject := "Email Verification"
	body := fmt.Sprintf(`
	<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border: 1px solid #dddddd;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            text-align: center;
            color: #333333;
        }
        .otp-code {
            font-size: 24px;
            font-weight: bold;
            color: #007BFF;
            text-align: center;
            margin: 20px 0;
        }
        .email-body {
            color: #555555;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .email-footer {
            text-align: center;
            font-size: 12px;
            color: #999999;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h1 class="email-header">Verify Your Email</h1>
        <p class="email-body">
            Thank you for signing up! To complete your registration, please use the OTP code below to verify your email address. 
            This helps us ensure the security of your account and provide a better user experience.
        </p>
        <div class="otp-code">%s</div>
        <p class="email-body">
            If you did not request this verification, please ignore this email or contact our support team for assistance.
        </p>
        <div class="email-footer">
            &copy; 2024 openpaas-tech. All rights reserved.
        </div>
    </div>
</body>
</html>
	`, otpCode)
	message := mailgun.NewMessage(sender, subject, "", recipientEmail)
	message.SetHTML(body)
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()

	_, _, err := mg.Send(ctx, message)

	if err != nil {
		return fmt.Errorf("error sending email : %s", err.Error())
	}
	return nil
}
