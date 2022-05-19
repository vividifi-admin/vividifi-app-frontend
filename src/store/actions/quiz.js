export const getQuizList = (data) => {
  return async (dispatch) => {
    await dispatch({ type: "INIT_QUIZ", payload: data });
  };
};
