import { getLearning as learning } from "../../services/getLearning";

export const getLearning = (data) => {
  console.log("dispach");
  return async (dispatch) => {
    // const { data } = await learning(id);
    await dispatch({ type: "INIT_LEARNING", payload: data });
  };
};
