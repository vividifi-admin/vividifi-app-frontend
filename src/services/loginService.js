import http from "./httpService";
import config from "./config.json";

export const loginUser = (email, password) => {
  return http.post(`${config.api}/api/auth/login`, { email, password });
};
