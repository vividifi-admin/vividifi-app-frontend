import http from "./httpService";
import config from "./config.json";

export const getSeasen = (seriesId) => {
  return http.get(`${config.api}/api/season/series/${seriesId}`);
};
