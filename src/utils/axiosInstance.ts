import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { refreshTokenThunk } from "store/actions/authActions";
import { store } from "store/store";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  console.log("[Interceptor - Request] Token:", token);
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (result) => result,
  async (error) => {
    const originalRequest = error.config;
    const isInvalidToken =
      error.response?.status === 400 ||
      error.response?.data?.error?.message === "INVALID_ID_TOKEN";

    if (isInvalidToken && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      
      console.log("[Interceptor - Response] Refresh Token:", refreshToken);

      if (refreshToken) {
        try {
          const result = await store
            .dispatch(refreshTokenThunk(refreshToken))
            .unwrap();
          await AsyncStorage.setItem("token", result.token);
          await AsyncStorage.setItem("refreshToken", result.refreshToken);

          originalRequest.headers.Authorization = ` ${result.token}`;
          return axios(originalRequest);
        } catch (error: any) {
          await AsyncStorage.multiRemove([
            "token",
            "uid",
            "email",
            "refreshToken",
          ]);
          return Promise.reject(new Error(error));
        }
      }
      return Promise.reject(new Error(error));
    }
    return Promise.reject(new Error(error));
  }
);

export default axiosInstance;
