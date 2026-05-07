import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/api/user/refresh-token"
    ) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${axiosInstance.defaults.baseURL}/api/user/refresh-token`,
          {},
          {
            withCredentials: true,
          },
        );

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token expired.");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
