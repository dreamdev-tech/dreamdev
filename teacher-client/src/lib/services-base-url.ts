export const authServiceBaseUrl = process.env.NODE_ENV === "development"
    ? "http://localhost:8080/auth-service/api/v1"
    : "https://api.openpaas.tech/auth-service/api/v1";
export const teacherServiceBaseUrl = process.env.NODE_ENV === "development"
    ? "http://localhost:8081/teacher-service/api/v1"
    : "https://api.openpaas.tech/teacher-service/api/v1";
export const uploadFilesServiceBaseUrl = process.env.NODE_ENV === "development"
    ?"http://localhost:8082/upload-files-service/api/v1"
    :"https://api.openpaas.tech/upload-files-service";