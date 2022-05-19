import http from "./httpService";
import config from "./config.json";

export const getEpisode = (seasonId) => {
  return http.get(`${config.api}/api/episode/season/${seasonId}`);
};

export const getSingleEpisode = (episodeId) => {
  return http.get(`${config.api}/api/episode/${episodeId}`);
};

export const getHowTo = (episodeId) => {
  return http.get(`${config.api}/api/how_to/${episodeId}`);
};
