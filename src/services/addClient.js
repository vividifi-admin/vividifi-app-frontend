import http from "./httpService";
import config from "./config.json";

export const addUser = (data) => {
    return http.post(`${config.api}/api/auth/register/`,data);
};
  