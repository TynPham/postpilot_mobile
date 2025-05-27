import httpConfigs from "@/configs/http";
import { TOKEN_KEY } from "@/constants/token";
import { getSecureStore } from "@/utils/secure-store";
import axios from "axios";

const http = axios.create({
  baseURL: httpConfigs.baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
http.interceptors.request.use(
  async function (config) {
    try {
      const token = await getSecureStore(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting token:", error);
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
http.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // if (error.response?.status === 401) {
    //   await deleteSecureStore(TOKEN_KEY);
    // }
    return Promise.reject(error);
  }
);

export default http;
