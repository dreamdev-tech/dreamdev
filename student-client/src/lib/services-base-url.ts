export const authServiceBaseUrl = process.env.NODE_ENV === "development"
    ? "http://localhost:8080/auth-service/api/v1"
    : "https://api.openpaas.tech/auth-service/api/v1";
