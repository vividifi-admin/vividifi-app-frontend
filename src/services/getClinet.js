import http from "./httpService";
import config from "./config.json";

export const getClient = (id) => {
  return http.get(`${config.api}/api/client/${id}`);
};

export const getUser = (id) => {
  return http.get(`${config.api}/api/user/${id}`);
};

export const getUsAllClients = () => {
  return http.get(`${config.api}/api/client`);
};
