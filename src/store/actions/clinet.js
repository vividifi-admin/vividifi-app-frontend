import { getClient as client } from "../../services/getClinet";

export const getClient = (id) => {
  return async (dispatch) => {
    const { data } = await client(id);
    await dispatch({ type: "INIT_CLINET", payload: data });
  };
};
