export const seriesReducer = (state = [], action) => {
  switch (action.type) {
    case "INIT_SERIES":
      return { ...action.payload };
    default:
      return state;
  }
};
