import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
})

api.interceptors.request.use(
  (config) => {
    const { store } = require('../redux/store');
    const accessToken = store.getState().auth.accessToken;
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  }, (err) => {
    return Promise.reject(err);
  }
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.config) {
      const originalRequest = error.config;

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const { data } = await api.post('/identity/refresh');
          const { store } = require('../redux/store');
          const { setAccessToken } = require('../redux/features/authSlice');

          store.dispatch(setAccessToken(data.accessToken));
          originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;

          return api(originalRequest);
        } catch (refreshError) {
          const { store } = require('../redux/store');
          const { logoutUser } = require('../redux/features/authSlice');

          store.dispatch(logoutUser());
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;