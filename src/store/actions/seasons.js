import { getSeasen as seasen } from "../../services/getSeasen";
import { getSingleSeasen as singleSeasen } from "../../services/getSingleSeasen";
export const getSeasen = (id) => {
  return async (dispatch) => {
    const { data } = await seasen(id);
    await dispatch({ type: "INIT_SEASEN", payload: data });
  };
};
export const getSingleSeasen = (id) => {
  return async (dispatch) => {
    const { data } = await singleSeasen(id);
    await dispatch({ type: "INIT_SINGLE_SEASEN", payload: data });
  };
};
