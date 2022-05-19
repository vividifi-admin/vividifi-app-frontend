import http from "./httpService";
import config from "./config.json";

export const getSingleSeasen = (seasonId) => {
  return http.get(`${config.api}/api/season/${seasonId}`);
};
