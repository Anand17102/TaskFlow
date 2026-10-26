import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach the access token to outgoing requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Refresh the access token when an API request returns 401
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("auth/login/") &&
      !originalRequest.url?.includes("auth/register/") &&
      !originalRequest.url?.includes("auth/refresh/")
    ) {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        localStorage.removeItem("accessToken");
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        // Use plain Axios to avoid triggering this interceptor again
        const response = await axios.post(`${API_BASE_URL}auth/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;

        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry the original request with the new access token
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
