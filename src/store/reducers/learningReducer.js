export const learningReducer = (state = [], action) => {
  switch (action.type) {
    case "INIT_LEARNING":
      return { ...action.payload };
    default:
      return state;
  }
};
