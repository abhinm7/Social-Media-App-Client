import axios from "axios";
import { setAccessToken, clearSession } from "../redux/features/authSlice";
import { AppStore } from "@/redux/store";

let store: AppStore;

export const injectStore = (_store: AppStore) => {
  store = _store;
};

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// --- Request Interceptor ---
api.interceptors.request.use(
  (config) => {
    const accessToken = store?.getState().auth.accessToken;
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

      // If the error came FROM the refresh endpoint, logout and give up.
      if (originalRequest.url.includes("/auth/refresh")) {
         store.dispatch(clearSession());
         return Promise.reject(error);
      }

      // Normal 401 handling
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const { data } = await api.post("/auth/refresh");
          store.dispatch(setAccessToken(data.accessToken));

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