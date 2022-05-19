import {
  getSeries as series,
  getSingleSeries as singleSeries,
} from "../../services/getSeries";

export const getSeries = () => {
  return async (dispatch) => {
    const { data } = await series();
    await dispatch({ type: "INIT_SERIES", payload: data });
  };
};
export const getSingleSeries = (id) => {
  return async (dispatch) => {
    const { data } = await singleSeries(id);
    await dispatch({ type: "SINGLE_SERIES", payload: data });
  };
};
