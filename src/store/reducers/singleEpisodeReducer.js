export const singleEpisodeReducer = (state = [], action) => {
  switch (action.type) {
    case "INIT_SINGEL_EPISODE":
      return { ...action.payload };
    default:
      return state;
  }
};
