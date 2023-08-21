import axios from 'axios';
import config from '../config';
import TokenService from "./token";

const instance = axios.create({
  baseURL: config.url.API_URL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": '*',
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = TokenService.getLocalAccessToken();
    if (token) {
      config.headers["Authorization"] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    const url = originalConfig.url;
    if (url !== "/login/" && url !== "/refresh-token/" && err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          const rs = await instance.post("/refresh-token/", {
            refresh: TokenService.getLocalRefreshToken(),
            username: TokenService.getUserName()
          });

          const { access, refresh } = rs.data;
          TokenService.updateLocalTokens(access, refresh);

          return instance(originalConfig);
        } catch (_error) {
          TokenService.updateLocalTokens(null, null);
          return Promise.reject(_error);
        }
      }
    }

    return Promise.reject(err);
  }
);

export default instance;