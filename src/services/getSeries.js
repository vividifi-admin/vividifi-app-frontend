import http from "./httpService";
import config from "./config.json";

export const getSeries = () => {
  // return http.get(`${config.api}/api/series`);
  return http.get(
    `${config.api}/api/series/client/${localStorage.getItem("client_id")}`
  );
};
export const getSingleSeries = (id) => {
  return http.get(`${config.api}/api/series/${id}`);
};
