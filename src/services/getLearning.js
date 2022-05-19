import http from "./httpService";
import config from "./config.json";

export const getLearning = (episodeId) => {
  return http.get(`${config.api}/api/learning/episode/${episodeId}`);
};
