import {
  getEpisode as episode,
  getSingleEpisode as singleEpisode,
} from "../../services/getEpisode";

export const getEpisode = (id) => {
  return async (dispatch) => {
    const { data } = await episode(id);
    await dispatch({ type: "INIT_EPISODE", payload: data });
  };
};
export const getSingleEpisode = (id) => {
  return async (dispatch) => {
    const { data } = await singleEpisode(id);
    await dispatch({ type: "INIT_SINGEL_EPISODE", payload: data });
  };
};
export const clearEpisode = () => {
  return async (dispatch) => {
    await dispatch({ type: "CLEAR_EPISODE", payload: [] });
  };
};
