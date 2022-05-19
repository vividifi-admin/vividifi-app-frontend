export const singleSeasenReducer = (state = [], action) => {
  switch (action.type) {
    case "INIT_SINGLE_SEASEN":
      return { ...action.payload };
    default:
      return state;
  }
};
