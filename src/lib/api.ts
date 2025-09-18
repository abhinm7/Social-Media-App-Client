import axios from "axios";
import { setAccessToken, clearSession } from "../redux/features/authSlice";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // send HttpOnly cookie automatically
});

// --- Request Interceptor ---
api.interceptors.request.use(
  (config) => {
    const { store } = require('../redux/store');  
    const accessToken = store.getState().auth.accessToken;
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// --- Response Interceptor ---
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.config) {
      const originalRequest = error.config;
      const { store } = require('../redux/store');
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          // Ask backend for new access token (cookie will be sent automatically)
          const { data } = await api.post("/auth/refresh");
          store.dispatch(setAccessToken(data.accessToken));

          // Retry original request with new token
          originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          store.dispatch(clearSession());
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
