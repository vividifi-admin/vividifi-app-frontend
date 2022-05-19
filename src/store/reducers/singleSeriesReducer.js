export const singleSeriesRenderer = (state = [], action) => {
  switch (action.type) {
    case "SINGLE_SERIES":
      return { ...action.payload };
    default:
      return state;
  }
};
