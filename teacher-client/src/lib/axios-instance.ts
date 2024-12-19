import axios, {
    AxiosError,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";
import { authServiceBaseUrl } from "./services-base-url";
// Define the response data types
interface AuthResponse {
    accessToken: string;
    refreshToken: string;
}

// Create Axios instance
const axiosInstance = axios.create({
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to add the token to headers
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (accessToken) {
            config.headers!["Authorization"] = `Bearer ${accessToken}`;
        }
        if (refreshToken) {
            config.headers!["X-Refresh-Token"] = refreshToken;
        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    },
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        // If token expired, try refreshing the token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");

                // Send request to refresh token endpoint
                const response = await axios.post<AuthResponse>(
                    `${authServiceBaseUrl}/refresh/token`,
                    {
                        refresh_token: refreshToken, // Corrected to match backend expectation
                    },
                );

                // Get new tokens from response
                const { accessToken, refreshToken: newRefreshToken } =
                    response.data;

                // Store new tokens in localStorage
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", newRefreshToken);

                // Update the Authorization header with the new token
                axiosInstance.defaults.headers["Authorization"] =
                    `Bearer ${accessToken}`;
                axiosInstance.defaults.headers["X-Refresh-Token"] =
                    newRefreshToken;
                originalRequest.headers!["Authorization"] =
                    `Bearer ${accessToken}`;
                originalRequest.headers!["X-Refresh-Token"] = newRefreshToken;

                // Retry the original request with the new access token
                return axiosInstance(originalRequest);
            } catch (err) {
                // If refresh fails, log the user out or redirect to home page
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                window.location.href = "/"; // Redirect to home page
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    },
);

export default axiosInstance;
